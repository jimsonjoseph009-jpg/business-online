#!/bin/bash
# AWS Deployment Setup Script for Business Online Application
# This script automates the deployment process to AWS
# Created: February 2026

set -e

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║  AWS Deployment Setup - Business Online Application            ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check prerequisites
echo "${YELLOW}[1/7] Checking prerequisites...${NC}"
command -v aws &> /dev/null || { echo "${RED}AWS CLI not found. Install it first:${NC}"; echo "curl \"https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip\" -o \"awscliv2.zip\" && unzip awscliv2.zip && sudo ./aws/install"; exit 1; }
command -v node &> /dev/null || { echo "${RED}Node.js not found${NC}"; exit 1; }
command -v npm &> /dev/null || { echo "${RED}npm not found${NC}"; exit 1; }
echo "${GREEN}✓ Prerequisites verified${NC}"
echo ""

# Get AWS configuration
echo "${YELLOW}[2/7] Getting AWS configuration...${NC}"
AWS_REGION=$(aws configure get region || echo "us-east-1")
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query 'Account' --output text 2>/dev/null || echo "UNKNOWN")
echo "${GREEN}✓ AWS Region: $AWS_REGION${NC}"
echo "${GREEN}✓ AWS Account ID: $AWS_ACCOUNT_ID${NC}"
echo ""

# Build React frontend
echo "${YELLOW}[3/7] Building React frontend...${NC}"
npm run build
echo "${GREEN}✓ React build completed${NC}"
echo ""

# Create production environment file
echo "${YELLOW}[4/7] Setting up production environment...${NC}"
if [ -f "server/.env.production" ]; then
  cp server/.env.production server/.env
  echo "${GREEN}✓ Production .env created${NC}"
else
  echo "${YELLOW}⚠ Warning: server/.env.production not found${NC}"
fi
echo ""

# Initialize Elastic Beanstalk
echo "${YELLOW}[5/7] Setting up Elastic Beanstalk...${NC}"
if ! [ -d ".ebextensions" ]; then
  mkdir -p .ebextensions
  echo "${GREEN}✓ Created .ebextensions directory${NC}"
fi
echo ""

# Create .ebextensions/nodecommand.config
cat > .ebextensions/nodecommand.config << 'EOF'
commands:
  01_npm_install:
    command: npm install
    leader_only: true
    ignoreErrors: true
    
option_settings:
  aws:elasticbeanstalk:container:nodejs:
    NodeCommand: "node server/index.js"
    GzipCompression: true
  aws:elasticbeanstalk:cloudwatch:logs:
    StreamLogs: true
    DeleteOnTerminate: false
    RetentionInDays: 7
  aws:elasticbeanstalk:application:environment:
    NODE_ENV: "production"
    NODE_PATH: "/var/app/current/server"
EOF

echo "${GREEN}✓ Created Elastic Beanstalk configuration${NC}"
echo ""

# Create deployment configuration
echo "${YELLOW}[6/7] Creating deployment configuration...${NC}"
cat > DEPLOYMENT_CONFIG.json << EOF
{
  "version": "1.0",
  "deployedAt": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "application": "businessonline",
  "frontend": {
    "type": "S3 + CloudFront",
    "buildPath": "./build",
    "region": "$AWS_REGION"
  },
  "backend": {
    "type": "Elastic Beanstalk",
    "region": "$AWS_REGION",
    "environment": "businessonline-prod"
  },
  "database": {
    "type": "Amazon RDS MySQL",
    "region": "$AWS_REGION"
  },
  "dns": {
    "type": "Route 53",
    "region": "$AWS_REGION"
  }
}
EOF

echo "${GREEN}✓ Created deployment configuration${NC}"
echo ""

# Display deployment checklist
echo "${YELLOW}[7/7] Deployment Checklist${NC}"
echo ""
echo "📋 NEXT STEPS:"
echo ""
echo "1. SET UP AWS RDS DATABASE:"
echo "   aws rds create-db-instance \\"
echo "     --db-instance-identifier businessonline-db \\"
echo "     --db-instance-class db.t3.micro \\"
echo "     --engine mysql \\"
echo "     --engine-version 8.0.35 \\"
echo "     --allocated-storage 20 \\"
echo "     --master-username admin \\"
echo "     --master-user-password YOUR_PASSWORD \\"
echo "     --db-name business_online \\"
echo "     --storage-type gp2 \\"
echo "     --publicly-accessible \\"
echo "     --region $AWS_REGION"
echo ""

echo "2. WAIT FOR DATABASE (5-10 minutes), then UPDATE .env with RDS endpoint"
echo ""

echo "3. DEPLOY TO ELASTIC BEANSTALK:"
echo "   eb init -p node.js-20 businessonline --region $AWS_REGION"
echo "   eb create businessonline-prod"
echo "   eb deploy"
echo ""

echo "4. UPLOAD FRONTEND TO S3:"
echo "   aws s3 mb s3://businessonline-frontend-\$RANDOM --region $AWS_REGION"
echo "   aws s3 sync ./build s3://businessonline-frontend-\$RANDOM --delete"
echo ""

echo "5. CONFIGURE ROUTE 53 & SSL CERTIFICATE"
echo ""

echo "${GREEN}Setup preparation complete!${NC}"
echo ""
echo "Configuration saved to: DEPLOYMENT_CONFIG.json"
echo ""
