#!/bin/bash
# AWS CLI Command Reference for Business Online Deployment
# Copy and paste commands as needed

# ============================================================================
# PART 1: AWS ACCOUNT & CLI SETUP
# ============================================================================

# Configure AWS CLI with your credentials
aws configure

# Verify AWS credentials are configured
aws sts get-caller-identity

# List your AWS account ID
aws sts get-caller-identity --query 'Account'

# ============================================================================
# PART 2: RDS DATABASE SETUP
# ============================================================================

# Create MySQL database
aws rds create-db-instance \
  --db-instance-identifier businessonline-db \
  --db-instance-class db.t3.micro \
  --engine mysql \
  --engine-version 8.0.35 \
  --allocated-storage 20 \
  --master-username admin \
  --master-user-password YourSecurePassword123 \
  --db-name business_online \
  --storage-type gp2 \
  --publicly-accessible \
  --backup-retention-period 7 \
  --region us-east-1

# Check database creation status
aws rds describe-db-instances \
  --db-instance-identifier businessonline-db \
  --query 'DBInstances[0].DBInstanceStatus'

# Get database endpoint
aws rds describe-db-instances \
  --db-instance-identifier businessonline-db \
  --query 'DBInstances[0].Endpoint.Address'

# List all RDS instances
aws rds describe-db-instances \
  --query 'DBInstances[*].[DBInstanceIdentifier,DBInstanceStatus]'

# Delete database (if needed)
aws rds delete-db-instance \
  --db-instance-identifier businessonline-db \
  --skip-final-snapshot

# ============================================================================
# PART 3: ELASTIC BEANSTALK COMMANDS
# ============================================================================

# Initialize Elastic Beanstalk application
eb init -p node.js-20 businessonline \
  --region us-east-1

# Create Elastic Beanstalk environment
eb create businessonline-prod \
  --instance-type t3.micro \
  --scale 1 \
  --region us-east-1

# Deploy code to Elastic Beanstalk
eb deploy

# Check environment status
eb status

# View environment health
eb health

# Stream logs in real-time
eb logs --stream

# SSH into Elastic Beanstalk instance
eb ssh

# Terminate Elastic Beanstalk environment
eb terminate

# List all Elastic Beanstalk environments
eb list

# Scale up to 2 instances
eb scale 2

# Scale down to 1 instance
eb scale 1

# ============================================================================
# PART 4: S3 BUCKET MANAGEMENT
# ============================================================================

# Create S3 bucket for frontend
aws s3 mb s3://businessonline-frontend-$(date +%s) \
  --region us-east-1

# List all S3 buckets
aws s3 ls

# Upload all files from build directory
aws s3 sync ./build s3://businessonline-frontend-1234567890 \
  --delete

# Upload with caching for production
aws s3 sync ./build s3://businessonline-frontend-1234567890 \
  --delete \
  --cache-control "max-age=31536000" \
  --exclude "*.html" \
  --exclude "*.json"

# Upload HTML files with no caching
aws s3 sync ./build s3://businessonline-frontend-1234567890 \
  --cache-control "no-cache" \
  --include "*.html"

# Enable static website hosting
aws s3 website s3://businessonline-frontend-1234567890 \
  --index-document index.html \
  --error-document index.html

# Remove all files from bucket
aws s3 rm s3://businessonline-frontend-1234567890 \
  --recursive

# Delete S3 bucket (must be empty first)
aws s3 rb s3://businessonline-frontend-1234567890

# ============================================================================
# PART 5: CLOUDFRONT DISTRIBUTION
# ============================================================================

# List CloudFront distributions
aws cloudfront list-distributions

# Get distribution configuration
aws cloudfront get-distribution \
  --id E123ABCD4XYZ

# Create cache invalidation (refresh CDN cache)
aws cloudfront create-invalidation \
  --distribution-id E123ABCD4XYZ \
  --paths "/*"

# Check invalidation status
aws cloudfront get-invalidation \
  --distribution-id E123ABCD4XYZ \
  --id I1234567890ABC

# ============================================================================
# PART 6: ROUTE 53 (DNS)
# ============================================================================

# List hosted zones
aws route53 list-hosted-zones

# Get hosted zone ID
aws route53 list-hosted-zones-by-name \
  --query 'HostedZones[0].Id'

# List DNS records in zone
aws route53 list-resource-record-sets \
  --hosted-zone-id Z1234ABCD5XYZ

# ============================================================================
# PART 7: CERTIFICATE MANAGER (SSL)
# ============================================================================

# List SSL certificates
aws acm list-certificates

# Request new SSL certificate
aws acm request-certificate \
  --domain-name yourdomain.com \
  --subject-alternative-names "*.yourdomain.com" \
  --validation-method DNS

# Describe certificate details
aws acm describe-certificate \
  --certificate-arn arn:aws:acm:...

# ============================================================================
# PART 8: EC2 SECURITY GROUPS
# ============================================================================

# List security groups
aws ec2 describe-security-groups

# Get security group for RDS
aws ec2 describe-security-groups \
  --filters Name=group-name,Values=default

# Add inbound rule for MySQL
aws ec2 authorize-security-group-ingress \
  --group-id sg-0123456789abcdef0 \
  --protocol tcp \
  --port 3306 \
  --cidr 0.0.0.0/0

# ============================================================================
# PART 9: MONITORING & LOGS
# ============================================================================

# List CloudWatch log groups
aws logs describe-log-groups

# Get log events from Elastic Beanstalk
aws logs get-log-events \
  --log-group-name /aws/elasticbeanstalk/businessonline-prod/var/log/eb-engine.log \
  --log-stream-name i-0123456789abcdef0 \
  --start-time $(($(date +%s)*1000))

# Create CloudWatch alarm for CPU
aws cloudwatch put-metric-alarm \
  --alarm-name businessonline-high-cpu \
  --alarm-description "Alert when CPU exceeds 80%" \
  --metric-name CPUUtilization \
  --namespace AWS/EC2 \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold

# ============================================================================
# PART 10: BILLING & COST
# ============================================================================

# Get account cost and usage
aws ce get-cost-and-usage \
  --time-period Start=2026-02-01,End=2026-02-28 \
  --granularity MONTHLY \
  --metrics BlendedCost

# List AWS budgets
aws budgets describe-budgets \
  --account-id YOUR_ACCOUNT_ID

# ============================================================================
# PART 11: CLEANUP (WHEN DONE)
# ============================================================================

# WARNING: These commands delete resources. Use with caution!

# Delete Elastic Beanstalk environment
eb terminate

# Delete RDS database
aws rds delete-db-instance \
  --db-instance-identifier businessonline-db \
  --skip-final-snapshot

# Empty and delete S3 bucket
aws s3 rm s3://businessonline-frontend-1234567890 --recursive
aws s3 rb s3://businessonline-frontend-1234567890

# Delete CloudFront distribution (must be disabled first)
aws cloudfront delete-distribution \
  --id E123ABCD4XYZ

# ============================================================================
# TIPS & TRICKS
# ============================================================================

# Get help for any command
aws [service] [command] help

# Example:
aws rds create-db-instance help

# Query results in different formats
--output text      # Tab-separated values
--output json      # JSON format
--output table     # Formatted table
--output yaml      # YAML format

# Filter results with JMESPath
--query 'DBInstances[?DBInstanceStatus==`available`]'

# Set default region for all commands
export AWS_DEFAULT_REGION=us-east-1

# Verify current AWS credentials
aws sts get-caller-identity

# Get AWS account info
aws ec2 describe-account-attributes

# Create AWS CLI alias for common commands
alias deploy-backend='eb deploy'
alias check-status='eb status && eb health'

# ============================================================================
# TROUBLESHOOTING COMMANDS
# ============================================================================

# Check if AWS CLI is installed
which aws
aws --version

# Test AWS connectivity
aws ec2 describe-regions

# Validate IAM user permissions
aws iam get-user

# Test database connectivity (if mysql-client installed)
mysql -h [RDS-ENDPOINT] -u admin -p business_online

# Check Elastic Beanstalk initialization
cat .elasticbeanstalk/config.yml

# View recent EB changes
eb printenv

# Get EB environment CNAME (URL)
aws elasticbeanstalk describe-environments \
  --environment-names businessonline-prod \
  --query 'Environments[0].CNAME'

# ============================================================================

echo "AWS CLI Command Reference loaded successfully!"
echo ""
echo "Copy the commands above as needed for your deployment."
echo "Remember to update placeholder values like:"
echo "  - Database passwords"
echo "  - S3 bucket names"
echo "  - Distribution IDs"
echo "  - Domain names"
echo ""
