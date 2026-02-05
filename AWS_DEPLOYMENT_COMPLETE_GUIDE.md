# 🚀 AWS Deployment Guide - Business Online

## Overview
This guide walks you through deploying a full-stack React + Node.js + MySQL application to AWS.

**Architecture:**
```
┌─────────────────────────────────────────────────────────────┐
│                     Route 53 (DNS)                          │
│              yourdomain.com                                 │
└────────────┬────────────────────────────────────────────────┘
             │
    ┌────────┴────────┐
    │                 │
┌───▼────────────┐  ┌─▼─────────────────────┐
│  CloudFront    │  │ Elastic Beanstalk     │
│  (React CDN)   │  │ (Node.js Backend)     │
│  S3 Static     │  │ with Auto Scaling     │
└────────────────┘  └─┬────────────────────┘
                      │
                      │
              ┌───────▼──────────┐
              │  Amazon RDS      │
              │  MySQL Database  │
              └──────────────────┘
```

---

## PHASE 1: Prerequisites & AWS Account Setup

### Step 1.1: Create AWS Account
1. Go to https://aws.amazon.com
2. Click "Create an AWS Account"
3. Enter your email and create a strong password
4. Provide billing information
5. Complete phone verification
6. Choose support plan (Basic is free)

### Step 1.2: Create IAM User with Programmatic Access
1. Log in to AWS Console
2. Go to **IAM** → **Users** → **Create User**
3. User name: `businessonline-deployer`
4. Select **Access key - Programmatic access**
5. Click **Next: Permissions**
6. Attach policies:
   - `AmazonElasticBeanstalkFullAccess`
   - `AmazonEC2ContainerRegistryFullAccess`
   - `AmazonECS_FullAccess`
   - `AmazonRDSFullAccess`
   - `AmazonS3FullAccess`
   - `CloudFrontFullAccess`
   - `Route53FullAccess`
7. Click **Create user**
8. **Save the Access Key ID and Secret Access Key** (you'll need these)

### Step 1.3: Install AWS CLI
```bash
# Download and install
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Verify installation
aws --version
```

### Step 1.4: Configure AWS CLI
```bash
aws configure

# Enter when prompted:
# AWS Access Key ID: [your-access-key-id]
# AWS Secret Access Key: [your-secret-access-key]
# Default region name: us-east-1
# Default output format: json
```

---

## PHASE 2: Database Setup (AWS RDS)

### Step 2.1: Create RDS MySQL Instance

**Option A: Using AWS Console**
1. Go to **RDS** → **Create database**
2. Select **MySQL** → **8.0.35**
3. Instance class: `db.t3.micro` (free tier eligible)
4. Instance identifier: `businessonline-db`
5. Master username: `admin`
6. Master password: `[create-strong-password]`
7. Database name: `business_online`
8. Publicly accessible: **Yes**
9. Click **Create database**

**Option B: Using AWS CLI**
```bash
aws rds create-db-instance \
  --db-instance-identifier businessonline-db \
  --db-instance-class db.t3.micro \
  --engine mysql \
  --engine-version 8.0.35 \
  --allocated-storage 20 \
  --master-username admin \
  --master-user-password YourStrongPassword123 \
  --db-name business_online \
  --storage-type gp2 \
  --publicly-accessible \
  --backup-retention-period 7 \
  --region us-east-1
```

### Step 2.2: Wait for Database to Be Available
```bash
# Monitor creation status
aws rds describe-db-instances \
  --db-instance-identifier businessonline-db \
  --query 'DBInstances[0].DBInstanceStatus'
  
# Wait until status shows "available" (takes 5-10 minutes)
```

### Step 2.3: Get RDS Endpoint
```bash
aws rds describe-db-instances \
  --db-instance-identifier businessonline-db \
  --query 'DBInstances[0].Endpoint.Address'
  
# Output will be something like:
# businessonline-db.xxxxxxxxxxxxx.us-east-1.rds.amazonaws.com
```

### Step 2.4: Test Database Connection
```bash
# Install mysql-client if needed
sudo apt-get install -y mysql-client

# Test connection
mysql -h businessonline-db.xxxxxxxxxxxxx.us-east-1.rds.amazonaws.com \
  -u admin \
  -p business_online

# Type password when prompted
# If you see `mysql>` prompt, connection successful!
# Type `exit` to quit
```

---

## PHASE 3: Update Application Configuration

### Step 3.1: Create Production Environment File
```bash
# Copy the template
cp server/.env.example server/.env.production

# Edit with actual values
nano server/.env.production
```

### Step 3.2: Update Production .env
```env
# Server Configuration
PORT=5000
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com

# Firebase Configuration (keep your existing keys)
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
FIREBASE_APP_ID=your_firebase_app_id

# MySQL Database Configuration (UPDATE WITH YOUR RDS INFO)
MYSQL_HOST=businessonline-db.xxxxxxxxxxxxx.us-east-1.rds.amazonaws.com
MYSQL_PORT=3306
MYSQL_USER=admin
MYSQL_PASSWORD=YourStrongPassword123
MYSQL_DATABASE=business_online

# Logging
LOG_LEVEL=info
```

### Step 3.3: Build React Frontend
```bash
npm run build

# This creates ./build directory with optimized production files
# Size should be 2-5 MB
ls -lh build/ | head -20
```

---

## PHASE 4: Deploy Backend to Elastic Beanstalk

### Step 4.1: Install Elastic Beanstalk CLI
```bash
# Using pip (Python package manager)
pip install --upgrade awsebcli

# Or using homebrew on macOS
brew install aws-elasticbeanstalk

# Verify installation
eb --version
```

### Step 4.2: Initialize Elastic Beanstalk Application
```bash
# From your project root directory
cd /home/j-walker/Desktop/businessonline

# Initialize
eb init -p node.js-20 businessonline \
  --region us-east-1 \
  --instance-profile aws-elasticbeanstalk-ec2-role
```

### Step 4.3: Create Elastic Beanstalk Environment
```bash
# Create the environment
eb create businessonline-prod \
  --instance-type t3.micro \
  --scale 1 \
  --envvars PORT=5000,NODE_ENV=production

# Wait 3-5 minutes for environment creation
eb status
```

### Step 4.4: Deploy Application
```bash
# Deploy code to Elastic Beanstalk
eb deploy

# Monitor deployment
eb logs --all

# Check status
eb status
```

### Step 4.5: Get Backend URL
```bash
# Display environment details
eb open

# Or get URL from console
eb printenv | grep ELASTICBEANSTALK_ENVIRONMENT_NAME
```

Save your backend URL, it will look like:
```
http://businessonline-prod.xxxxx.us-east-1.elasticbeanstalk.com
```

---

## PHASE 5: Deploy Frontend to S3 + CloudFront

### Step 5.1: Create S3 Bucket for Frontend
```bash
# Create bucket with unique name
aws s3 mb s3://businessonline-frontend-$(date +%s) \
  --region us-east-1
  
# Note the bucket name, you'll need it
# Example: s3://businessonline-frontend-1707129600
```

### Step 5.2: Configure S3 for Static Website
```bash
# Enable static website hosting
aws s3 website s3://businessonline-frontend-1707129600 \
  --index-document index.html \
  --error-document index.html
```

### Step 5.3: Upload React Build Files
```bash
# Upload all build files
aws s3 sync ./build s3://businessonline-frontend-1707129600 \
  --delete \
  --cache-control "max-age=3600" \
  --exclude "*.html" \
  --exclude "*.json"

# Upload HTML with no caching
aws s3 sync ./build s3://businessonline-frontend-1707129600 \
  --delete \
  --cache-control "no-cache, no-store, must-revalidate" \
  --include "*.html" \
  --include "*.json"
```

### Step 5.4: Create CloudFront Distribution
```bash
# Create distribution (see detailed steps below for full setup)
# This requires additional configuration for origin, caching, etc.
```

**Detailed CloudFront Setup (AWS Console):**
1. Go to **CloudFront** → **Create Distribution**
2. Origin domain: Select your S3 bucket
3. Origin path: `/` (leave empty)
4. Viewer protocol policy: **Redirect HTTP to HTTPS**
5. Cache policy: **CachingOptimized**
6. Compress objects automatically: **Yes**
7. Default root object: `index.html`
8. Create distribution

Save your CloudFront domain (e.g., `d123456789.cloudfront.net`)

---

## PHASE 6: Configure DNS & SSL Certificate

### Step 6.1: Request SSL Certificate (AWS Certificate Manager)
1. Go to **Certificate Manager** → **Request certificate**
2. Domain name: `yourdomain.com`
3. Also add: `*.yourdomain.com` (for subdomains)
4. Validation method: **DNS validation**
5. Create records in Route 53 (automated option available)

### Step 6.2: Set Up Route 53 (DNS)
1. Go to **Route 53** → **Hosted zones**
2. Create hosted zone for your domain
3. Update your domain registrar's nameservers to Route 53 nameservers
4. Create A records:
   - **yourdomain.com** → CloudFront distribution
   - **api.yourdomain.com** → Elastic Beanstalk endpoint

Example using AWS CLI:
```bash
# Get your hosted zone ID
aws route53 list-hosted-zones-by-name \
  --query 'HostedZones[0].Id'
```

---

## PHASE 7: Verification & Testing

### Step 7.1: Test Backend API
```bash
# Test health endpoint
curl https://api.yourdomain.com/api/health

# Should return JSON response with status
```

### Step 7.2: Test Frontend
1. Visit `https://yourdomain.com` in browser
2. Verify page loads completely
3. Check browser console for errors
4. Test login functionality
5. Test key features (orders, products, etc.)

### Step 7.3: Verify Database Connection
```bash
# SSH into Elastic Beanstalk instance
eb ssh

# Once connected, check logs
tail -f /var/log/eb-engine.log
```

### Step 7.4: Monitor Application
```bash
# Check real-time logs
eb logs --all --stream

# Check environment health
eb health

# Scale up if needed
eb scale 2  # Creates 2 instances
```

---

## PHASE 8: Cost Optimization

### Estimated Monthly Costs (Free tier eligible):
| Service | Free Tier | Over Quota |
|---------|-----------|-----------|
| RDS (db.t3.micro) | 750 hrs/month | $0.018/hour |
| Elastic Beanstalk (t3.micro) | 750 hrs/month | $0.0104/hour |
| S3 Storage | 5 GB/month | $0.023/GB |
| CloudFront | 1 TB egress | $0.085/GB |
| Route 53 | - | $0.40 per domain/month |
| **Total** | **~$0.40** | **varies** |

### Cost Reduction Tips:
1. Use Auto Scaling: Stop instances during off-hours
2. Enable RDS Multi-AZ: Automatic failover
3. Use CloudFront: Reduces data transfer costs
4. Enable CloudWatch alarms: Monitor usage
5. Set billing alerts: AWS Budgets

---

## Troubleshooting

### Backend Not Accessible
```bash
# Check Elastic Beanstalk logs
eb logs

# Check environment health
eb health

# SSH into instance
eb ssh
cd /var/app/current
npm start
```

### Database Connection Failed
```bash
# Test RDS connection
mysql -h [RDS-ENDPOINT] -u admin -p business_online

# Check security group
aws ec2 describe-security-groups \
  --filters Name=group-name,Values=default
```

### Frontend Shows Blank Page
```bash
# Check browser console for errors (F12)
# Check CloudFront cache invalidation
aws cloudfront create-invalidation \
  --distribution-id [DISTRIBUTION_ID] \
  --paths "/*"
```

### High Costs
```bash
# Check AWS Billing Dashboard
# Use AWS Budgets to set alerts
# Consider Reserved Instances for long-term savings
```

---

## Deployment Summary

✅ **Phase 1:** AWS Account + IAM Setup + AWS CLI  
✅ **Phase 2:** MySQL Database on RDS  
✅ **Phase 3:** Application Configuration  
✅ **Phase 4:** Backend deployed to Elastic Beanstalk  
✅ **Phase 5:** Frontend deployed to S3 + CloudFront  
✅ **Phase 6:** DNS + SSL configured  
✅ **Phase 7:** Testing and verification  
✅ **Phase 8:** Optimization and monitoring  

---

## Support Resources

- [AWS Elastic Beanstalk Documentation](https://docs.aws.amazon.com/elasticbeanstalk/)
- [AWS RDS Documentation](https://docs.aws.amazon.com/rds/)
- [AWS S3 + CloudFront Guide](https://docs.aws.amazon.com/s3/latest/userguide/WebsiteHosting.html)
- [AWS Route 53 Documentation](https://docs.aws.amazon.com/route53/)

---

**Last Updated:** February 2026  
**Application:** Business Online  
**Version:** 1.0  
