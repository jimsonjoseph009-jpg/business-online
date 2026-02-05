#!/bin/bash
# AWS Quick Start Deployment - 5-Step Process
# This script automates the complete deployment process

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Display banner
clear
cat << "EOF"
╔══════════════════════════════════════════════════════════════╗
║     AWS QUICK START DEPLOYMENT - Business Online            ║
║     Complete Deployment in 5 Steps                          ║
╚══════════════════════════════════════════════════════════════╝
EOF
echo ""

# Get configuration
echo -e "${BLUE}📋 STEP 1: Configuration${NC}"
echo "================================"
read -p "Enter AWS Region (default: us-east-1): " AWS_REGION
AWS_REGION=${AWS_REGION:-us-east-1}

read -p "Enter application name (default: businessonline): " APP_NAME
APP_NAME=${APP_NAME:-businessonline}

read -p "Enter RDS database password: " RDS_PASSWORD
while [ -z "$RDS_PASSWORD" ]; do
    echo -e "${RED}Password cannot be empty${NC}"
    read -p "Enter RDS database password: " RDS_PASSWORD
done

read -p "Enter your domain (e.g., example.com): " DOMAIN
DOMAIN=${DOMAIN:-yourdomain.com}

echo -e "${GREEN}✓ Configuration saved${NC}"
echo ""

# Save configuration
cat > .deployment-config << EOF
AWS_REGION=$AWS_REGION
APP_NAME=$APP_NAME
DOMAIN=$DOMAIN
DEPLOYMENT_DATE=$(date -u +%Y-%m-%dT%H:%M:%SZ)
EOF

# Step 2: Build React frontend
echo -e "${BLUE}🔨 STEP 2: Building React Frontend${NC}"
echo "================================"
if [ -d "build" ]; then
    echo "Build directory exists, skipping build"
else
    echo "Building React application..."
    npm run build
fi
echo -e "${GREEN}✓ Frontend built successfully${NC}"
echo ""

# Step 3: Create RDS Database
echo -e "${BLUE}🗄️  STEP 3: Setting up RDS Database${NC}"
echo "================================"
echo "Creating MySQL database on AWS RDS..."
echo ""

# Check if database already exists
if aws rds describe-db-instances --db-instance-identifier "$APP_NAME-db" --region "$AWS_REGION" &>/dev/null; then
    echo -e "${YELLOW}⚠ Database '$APP_NAME-db' already exists${NC}"
else
    echo "Creating new RDS instance..."
    aws rds create-db-instance \
        --db-instance-identifier "$APP_NAME-db" \
        --db-instance-class db.t3.micro \
        --engine mysql \
        --engine-version 8.0.35 \
        --allocated-storage 20 \
        --master-username admin \
        --master-user-password "$RDS_PASSWORD" \
        --db-name business_online \
        --storage-type gp2 \
        --publicly-accessible \
        --backup-retention-period 7 \
        --region "$AWS_REGION"
    
    echo -e "${YELLOW}⏳ Waiting for database to be created (this takes 5-10 minutes)...${NC}"
fi

# Wait for database
echo "Checking database status..."
while true; do
    STATUS=$(aws rds describe-db-instances \
        --db-instance-identifier "$APP_NAME-db" \
        --region "$AWS_REGION" \
        --query 'DBInstances[0].DBInstanceStatus' \
        --output text 2>/dev/null || echo "creating")
    
    if [ "$STATUS" = "available" ]; then
        echo -e "${GREEN}✓ Database is ready${NC}"
        break
    else
        echo "Status: $STATUS... waiting..."
        sleep 10
    fi
done

# Get RDS endpoint
RDS_ENDPOINT=$(aws rds describe-db-instances \
    --db-instance-identifier "$APP_NAME-db" \
    --region "$AWS_REGION" \
    --query 'DBInstances[0].Endpoint.Address' \
    --output text)

echo "RDS Endpoint: $RDS_ENDPOINT"
echo ""

# Step 4: Update Environment Configuration
echo -e "${BLUE}⚙️  STEP 4: Configuring Environment${NC}"
echo "================================"
echo "Updating production environment variables..."

# Create/update production env file
cat > server/.env.production << ENV
PORT=5000
NODE_ENV=production
CORS_ORIGIN=https://$DOMAIN

# Firebase Configuration
FIREBASE_API_KEY=$(grep FIREBASE_API_KEY server/.env 2>/dev/null | cut -d'=' -f2 || echo "")
FIREBASE_AUTH_DOMAIN=$(grep FIREBASE_AUTH_DOMAIN server/.env 2>/dev/null | cut -d'=' -f2 || echo "")
FIREBASE_PROJECT_ID=$(grep FIREBASE_PROJECT_ID server/.env 2>/dev/null | cut -d'=' -f2 || echo "")
FIREBASE_STORAGE_BUCKET=$(grep FIREBASE_STORAGE_BUCKET server/.env 2>/dev/null | cut -d'=' -f2 || echo "")
FIREBASE_MESSAGING_SENDER_ID=$(grep FIREBASE_MESSAGING_SENDER_ID server/.env 2>/dev/null | cut -d'=' -f2 || echo "")
FIREBASE_APP_ID=$(grep FIREBASE_APP_ID server/.env 2>/dev/null | cut -d'=' -f2 || echo "")

# MySQL Database
MYSQL_HOST=$RDS_ENDPOINT
MYSQL_PORT=3306
MYSQL_USER=admin
MYSQL_PASSWORD=$RDS_PASSWORD
MYSQL_DATABASE=business_online

# Logging
LOG_LEVEL=info
API_PREFIX=/api
NODE_PATH=/var/app/current/server
ENV

echo -e "${GREEN}✓ Environment configured${NC}"
echo ""

# Step 5: Deploy to Elastic Beanstalk
echo -e "${BLUE}🚀 STEP 5: Deploying to Elastic Beanstalk${NC}"
echo "================================"

if ! command -v eb &> /dev/null; then
    echo -e "${YELLOW}Installing AWS Elastic Beanstalk CLI...${NC}"
    pip install awsebcli
fi

# Initialize if not already done
if ! [ -d ".elasticbeanstalk" ]; then
    echo "Initializing Elastic Beanstalk..."
    eb init -p node.js-20 "$APP_NAME" \
        --region "$AWS_REGION"
fi

# Create environment if it doesn't exist
echo "Creating Elastic Beanstalk environment..."
if eb status &>/dev/null; then
    echo "Environment already exists, deploying..."
else
    eb create "$APP_NAME-prod" \
        --instance-type t3.micro \
        --scale 1 \
        --region "$AWS_REGION"
fi

# Deploy application
echo "Deploying application..."
eb deploy

# Get environment URL
EB_URL=$(eb open --print-url 2>/dev/null || echo "unknown")

echo -e "${GREEN}✓ Elastic Beanstalk deployment complete${NC}"
echo ""

# Display deployment summary
echo "╔════════════════════════════════════════════════════════════╗"
echo "║           DEPLOYMENT SUMMARY - SUCCESS!                   ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo -e "${GREEN}Backend API:${NC}"
echo "  URL: $EB_URL"
echo "  API Health: $EB_URL/api/health"
echo ""
echo -e "${GREEN}Database:${NC}"
echo "  Host: $RDS_ENDPOINT"
echo "  Database: business_online"
echo "  User: admin"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "  1. Deploy frontend to S3:"
echo "     bash scripts/deploy-frontend.sh"
echo ""
echo "  2. Configure DNS in Route 53"
echo ""
echo "  3. Set up SSL certificate in Certificate Manager"
echo ""
echo "  4. Test application at:"
echo "     http://$EB_URL"
echo ""
echo "  5. Review AWS_DEPLOYMENT_COMPLETE_GUIDE.md for full details"
echo ""

# Save deployment info
cat > DEPLOYMENT_INFO.json << EOF
{
  "deploymentDate": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "applicationName": "$APP_NAME",
  "region": "$AWS_REGION",
  "domain": "$DOMAIN",
  "backend": {
    "url": "$EB_URL",
    "type": "AWS Elastic Beanstalk"
  },
  "database": {
    "host": "$RDS_ENDPOINT",
    "name": "business_online",
    "engine": "MySQL 8.0.35",
    "type": "AWS RDS"
  },
  "frontend": {
    "status": "To be deployed",
    "destination": "AWS S3 + CloudFront"
  }
}
EOF

echo -e "${GREEN}Deployment configuration saved to DEPLOYMENT_INFO.json${NC}"
echo ""
