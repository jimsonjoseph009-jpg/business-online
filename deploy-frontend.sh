#!/bin/bash
# Deploy React frontend to AWS S3 + CloudFront

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Frontend Deployment to S3 + CloudFront                   ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Check prerequisites
if [ ! -d "build" ]; then
    echo -e "${RED}Error: build/ directory not found${NC}"
    echo "Run 'npm run build' first"
    exit 1
fi

# Get configuration
if [ -f ".deployment-config" ]; then
    source .deployment-config
else
    read -p "Enter AWS Region (default: us-east-1): " AWS_REGION
    AWS_REGION=${AWS_REGION:-us-east-1}
    
    read -p "Enter application name (default: businessonline): " APP_NAME
    APP_NAME=${APP_NAME:-businessonline}
fi

# Create S3 bucket
echo -e "${BLUE}Creating S3 bucket...${NC}"
TIMESTAMP=$(date +%s)
BUCKET_NAME="$APP_NAME-frontend-$TIMESTAMP"

aws s3 mb "s3://$BUCKET_NAME" \
    --region "$AWS_REGION" \
    --create-bucket-configuration LocationConstraint="$AWS_REGION"

echo -e "${GREEN}✓ S3 bucket created: $BUCKET_NAME${NC}"

# Enable static website hosting
echo -e "${BLUE}Configuring S3 for static website hosting...${NC}"
aws s3 website "s3://$BUCKET_NAME" \
    --index-document index.html \
    --error-document index.html

# Block public access (we'll use CloudFront instead)
aws s3api put-public-access-block \
    --bucket "$BUCKET_NAME" \
    --public-access-block-configuration \
    "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"

# Upload build files
echo -e "${BLUE}Uploading files to S3...${NC}"

# Upload non-HTML files with caching
aws s3 sync ./build "s3://$BUCKET_NAME" \
    --region "$AWS_REGION" \
    --delete \
    --cache-control "max-age=31536000,public" \
    --exclude "*.html" \
    --exclude "*.json" \
    --exclude "*.map"

# Upload HTML files with no caching
aws s3 sync ./build "s3://$BUCKET_NAME" \
    --region "$AWS_REGION" \
    --cache-control "max-age=0,no-cache,no-store,must-revalidate" \
    --include "*.html" \
    --include "*.json"

echo -e "${GREEN}✓ Files uploaded to S3${NC}"

# Create CloudFront distribution
echo -e "${BLUE}Creating CloudFront distribution...${NC}"

# Create distribution config
cat > /tmp/cf-config.json << EOF
{
  "CallerReference": "businessonline-$(date +%s)",
  "Enabled": true,
  "Comment": "Business Online Frontend Distribution",
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "$BUCKET_NAME",
        "DomainName": "$BUCKET_NAME.s3.amazonaws.com",
        "S3OriginConfig": {
          "OriginAccessIdentity": ""
        }
      }
    ]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "$BUCKET_NAME",
    "ViewerProtocolPolicy": "redirect-to-https",
    "AllowedMethods": {
      "Quantity": 2,
      "Items": [
        "GET",
        "HEAD"
      ]
    },
    "CachePolicyId": "658327ea-f89d-4fab-a63d-7e88639e58f6",
    "Compress": true,
    "ForwardedValues": {
      "QueryString": false,
      "Cookies": {
        "Forward": "none"
      }
    },
    "TrustedSigners": {
      "Enabled": false,
      "Quantity": 0
    },
    "MinTTL": 0
  },
  "CacheBehaviors": [
    {
      "PathPattern": "*.html",
      "TargetOriginId": "$BUCKET_NAME",
      "ViewerProtocolPolicy": "redirect-to-https",
      "AllowedMethods": {
        "Quantity": 2,
        "Items": [
          "GET",
          "HEAD"
        ]
      },
      "CachePolicyId": "658327ea-f89d-4fab-a63d-7e88639e58f6",
      "Compress": true,
      "ForwardedValues": {
        "QueryString": false,
        "Cookies": {
          "Forward": "none"
        }
      },
      "TrustedSigners": {
        "Enabled": false,
        "Quantity": 0
      },
      "MinTTL": 0
    }
  ],
  "DefaultRootObject": "index.html",
  "WebACLId": "",
  "HttpVersion": "http2and3",
  "PriceClass": "PriceClass_100"
}
EOF

# Create CloudFront distribution
CF_OUTPUT=$(aws cloudfront create-distribution \
    --distribution-config file:///tmp/cf-config.json \
    --region "$AWS_REGION" \
    --output json)

CF_ID=$(echo "$CF_OUTPUT" | grep -o '"Id":"[^"]*' | head -1 | cut -d'"' -f4)
CF_DOMAIN=$(echo "$CF_OUTPUT" | grep -o '"DomainName":"[^"]*' | head -1 | cut -d'"' -f4)

echo -e "${GREEN}✓ CloudFront distribution created${NC}"
echo "  ID: $CF_ID"
echo "  Domain: $CF_DOMAIN"

# Save frontend config
cat > FRONTEND_DEPLOYMENT_INFO.json << EOF
{
  "deploymentDate": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "s3": {
    "bucket": "$BUCKET_NAME",
    "region": "$AWS_REGION",
    "website": "http://$BUCKET_NAME.s3-website-$AWS_REGION.amazonaws.com"
  },
  "cloudfront": {
    "distributionId": "$CF_ID",
    "domain": "$CF_DOMAIN",
    "status": "Deploying (takes 5-10 minutes)"
  },
  "nextSteps": [
    "Wait for CloudFront distribution to deploy",
    "Configure Route 53 to point to CloudFront domain",
    "Request SSL certificate for your custom domain",
    "Update CORS settings in backend for your domain"
  ]
}
EOF

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║           FRONTEND DEPLOYMENT SUMMARY                      ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo -e "${GREEN}S3 Bucket:${NC}"
echo "  Name: $BUCKET_NAME"
echo "  Region: $AWS_REGION"
echo ""
echo -e "${GREEN}CloudFront Distribution:${NC}"
echo "  ID: $CF_ID"
echo "  Domain: $CF_DOMAIN"
echo "  Status: Deploying (⏳ 5-10 minutes)"
echo ""
echo -e "${YELLOW}Temporary URL (before DNS setup):${NC}"
echo "  http://$CF_DOMAIN"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "  1. Wait for CloudFront deployment to complete"
echo "  2. Set up Route 53 DNS records:"
echo "     - yourdomain.com → CloudFront ($CF_DOMAIN)"
echo "  3. Request SSL certificate for yourdomain.com"
echo "  4. Update backend CORS_ORIGIN to https://yourdomain.com"
echo ""
echo "Configuration saved to: FRONTEND_DEPLOYMENT_INFO.json"
echo ""

rm /tmp/cf-config.json
