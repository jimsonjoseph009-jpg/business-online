# 🚀 AWS Deployment - START HERE

Welcome! This guide will help you deploy your **Business Online** application to AWS in just a few steps.

## Quick Overview

Your application consists of:
- **Frontend:** React.js (deployed to AWS S3 + CloudFront)
- **Backend:** Node.js/Express (deployed to AWS Elastic Beanstalk)
- **Database:** MySQL (deployed to AWS RDS)

---

## ⚡ Quick Start (Recommended)

### For the impatient: 3-step deployment

```bash
# 1. Set up AWS prerequisites (one-time setup)
bash verify-deployment.sh          # Verify everything is ready
# Then: Configure AWS CLI with credentials from IAM user

# 2. Deploy backend automatically
bash quick-deploy.sh               # Creates RDS database and deploys to Elastic Beanstalk
# Follow the prompts!

# 3. Deploy frontend automatically
bash deploy-frontend.sh            # Uploads to S3 and creates CloudFront distribution
```

**Total time:** ~15-20 minutes (mostly waiting for AWS to set things up)

---

## 📚 Complete Guides

### For detailed information:

1. **[AWS_DEPLOYMENT_COMPLETE_GUIDE.md](AWS_DEPLOYMENT_COMPLETE_GUIDE.md)** ← **Read this first**
   - Complete step-by-step walkthrough
   - Detailed explanations for each step
   - Manual setup instructions
   - Troubleshooting guide

2. **[AWS_DEPLOYMENT_CHECKLIST.sh](AWS_DEPLOYMENT_CHECKLIST.sh)**
   - Printable checklist of all tasks
   - Track your progress

---

## 🛠️ Prerequisites

Before starting, you need:

### 1. AWS Account
- [ ] Create account at https://aws.amazon.com
- [ ] Create IAM user with programmatic access
- [ ] Save Access Key ID and Secret Access Key

### 2. Local Tools
```bash
# AWS CLI (required)
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Elastic Beanstalk CLI (required)
pip install awsebcli

# Verify everything
bash verify-deployment.sh
```

### 3. AWS CLI Configuration
```bash
aws configure
# Enter:
# - AWS Access Key ID: [from IAM user]
# - AWS Secret Access Key: [from IAM user]
# - Default region: us-east-1
# - Default output: json
```

---

## 📋 Deployment Scripts

| Script | Purpose | Time |
|--------|---------|------|
| `verify-deployment.sh` | Check prerequisites | 1 min |
| `quick-deploy.sh` | Deploy everything | 15 min |
| `deploy-frontend.sh` | Update/redeploy frontend | 5 min |

---

## 🚀 Deployment Steps

### Step 1: Verify Prerequisites ✅
```bash
bash verify-deployment.sh
```
This checks that you have:
- AWS CLI installed and configured
- Elastic Beanstalk CLI
- Node.js and npm
- All required files

### Step 2: Deploy Backend 🔧
```bash
bash quick-deploy.sh
```
This script will:
1. Build your React frontend
2. Create an RDS MySQL database
3. Configure environment variables
4. Deploy to Elastic Beanstalk
5. Provide you with backend URL

**What it creates:**
- AWS RDS MySQL database (db.t3.micro - free tier)
- AWS Elastic Beanstalk environment
- Auto-scaling group with 1 instance (t3.micro)
- CloudWatch logs for monitoring

### Step 3: Deploy Frontend 📱
```bash
bash deploy-frontend.sh
```
This script will:
1. Create an S3 bucket for static files
2. Upload optimized React build
3. Create CloudFront distribution
4. Set up caching policies
5. Provide you with CDN URL

**What it creates:**
- AWS S3 bucket for frontend
- CloudFront distribution (CDN)
- Caching policies optimized for React
- Auto-index.html routing

### Step 4: Configure Domain (Manual) 🌐
See [AWS_DEPLOYMENT_COMPLETE_GUIDE.md](AWS_DEPLOYMENT_COMPLETE_GUIDE.md) Phase 6:
- Request SSL certificate (AWS Certificate Manager)
- Set up Route 53 DNS
- Point domain to CloudFront
- Update backend CORS settings

---

## 📊 Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│            Your Custom Domain                           │
│         yourdomain.com (Route 53)                       │
└───────┬─────────────────────────────┬──────────────────┘
        │                             │
        │                             │
   ┌────▼──────────────┐     ┌────────▼─────────────┐
   │  Frontend (CDN)   │     │  Backend API         │
   │  CloudFront       │     │  Elastic Beanstalk   │
   │  S3 Bucket        │     │  (Node.js server)    │
   └───────────────────┘     └────────┬──────────────┘
                                      │
                                      │
                            ┌─────────▼──────────┐
                            │  MySQL Database    │
                            │  AWS RDS           │
                            └────────────────────┘
```

---

## 💰 Cost Estimates

**Free Tier (12 months):**
- Elastic Beanstalk: ✅ 750 hours/month
- RDS MySQL: ✅ 750 hours/month
- S3: ✅ 5 GB storage
- CloudFront: ✅ 1 TB data transfer

**Estimated Monthly Cost:** $0.40 (Route 53 only)

---

## 🔍 Verification

After deployment, verify everything works:

```bash
# Test backend API
curl https://api.yourdomain.com/api/health

# Visit frontend
https://yourdomain.com

# Check Elastic Beanstalk logs
eb logs

# Check database connection
mysql -h [rds-endpoint] -u admin -p business_online
```

---

## 📝 Environment Files

### Backend Configuration
File: `server/.env.production`

Contains:
- Database credentials
- Firebase configuration
- API settings
- CORS origins

**IMPORTANT:** Keep this file secure and never commit to git!

### Deployment Configuration
Files automatically created:
- `.deployment-config` - Quick deployment settings
- `DEPLOYMENT_INFO.json` - Backend deployment details
- `FRONTEND_DEPLOYMENT_INFO.json` - Frontend deployment details

---

## 🆘 Troubleshooting

### Issue: "AWS credentials not configured"
```bash
aws configure
# Enter your IAM credentials
```

### Issue: "Elastic Beanstalk CLI not found"
```bash
pip install awsebcli
```

### Issue: Backend connection fails
```bash
# Check logs
eb logs --all

# SSH into instance
eb ssh

# Check database connection
mysql -h $MYSQL_HOST -u admin -p business_online
```

### Issue: Frontend shows blank page
```bash
# Clear CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id [ID] \
  --paths "/*"
```

### Issue: Database connection failed
- Verify RDS endpoint in `.env`
- Check security group allows MySQL (port 3306)
- Verify database credentials are correct

---

## 📞 Support & Resources

- **AWS Documentation:** https://docs.aws.amazon.com
- **Elastic Beanstalk:** https://docs.aws.amazon.com/elasticbeanstalk/
- **RDS:** https://docs.aws.amazon.com/rds/
- **CloudFront:** https://docs.aws.amazon.com/cloudfront/
- **Route 53:** https://docs.aws.amazon.com/route53/

---

## ✅ Deployment Checklist

Use this as your deployment checklist:

```
Prerequisites:
  [ ] AWS account created
  [ ] IAM user with programmatic access
  [ ] AWS CLI installed and configured
  [ ] EB CLI installed
  [ ] Ran verify-deployment.sh successfully

Backend Deployment:
  [ ] Ran quick-deploy.sh
  [ ] RDS database created and available
  [ ] Backend deployed to Elastic Beanstalk
  [ ] Got backend URL
  [ ] Tested /api/health endpoint

Frontend Deployment:
  [ ] Ran deploy-frontend.sh
  [ ] S3 bucket created
  [ ] Files uploaded successfully
  [ ] CloudFront distribution created
  [ ] Got CloudFront domain

Domain Configuration:
  [ ] Requested SSL certificate
  [ ] Set up Route 53 DNS
  [ ] Pointed domain to CloudFront
  [ ] Updated backend CORS_ORIGIN
  [ ] Verified HTTPS working

Final Testing:
  [ ] Frontend loads at domain
  [ ] Backend API responds
  [ ] Database connection works
  [ ] Login functionality works
  [ ] Can create/read/update/delete data
```

---

## 🎉 Success!

Once you've completed all steps, your application is live on AWS!

**You now have:**
- ✅ Scalable backend infrastructure
- ✅ Global CDN for fast frontend delivery
- ✅ Managed database with automatic backups
- ✅ Automatic SSL certificates
- ✅ Auto-scaling and monitoring

---

## 📚 Next Steps

After deployment:

1. **Monitor your application:**
   ```bash
   eb health
   eb logs --stream
   ```

2. **Set up alerts:** AWS CloudWatch → Alarms

3. **Configure backups:** AWS RDS → Automated backups

4. **Enable logging:** CloudWatch Logs

5. **Optimize costs:** Reserved Instances, Auto Scaling

---

**Last Updated:** February 2026  
**Application:** Business Online  
**Version:** 1.0

For detailed guidance, see [AWS_DEPLOYMENT_COMPLETE_GUIDE.md](AWS_DEPLOYMENT_COMPLETE_GUIDE.md)
