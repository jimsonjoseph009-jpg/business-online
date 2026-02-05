#!/bin/bash
# Quick deployment verification script

echo "🔍 AWS Deployment Verification"
echo "=================================="
echo ""

# Check AWS CLI
echo "1. Checking AWS CLI..."
if command -v aws &> /dev/null; then
    echo "   ✓ AWS CLI installed"
    aws --version
else
    echo "   ✗ AWS CLI not installed"
fi
echo ""

# Check AWS credentials
echo "2. Checking AWS credentials..."
if aws sts get-caller-identity &> /dev/null; then
    ACCOUNT_ID=$(aws sts get-caller-identity --query 'Account' --output text)
    echo "   ✓ AWS credentials configured"
    echo "   Account ID: $ACCOUNT_ID"
else
    echo "   ✗ AWS credentials not configured"
fi
echo ""

# Check Elastic Beanstalk CLI
echo "3. Checking Elastic Beanstalk CLI..."
if command -v eb &> /dev/null; then
    echo "   ✓ Elastic Beanstalk CLI installed"
    eb --version
else
    echo "   ✗ Elastic Beanstalk CLI not installed"
    echo "   Install with: pip install awsebcli"
fi
echo ""

# Check Node.js
echo "4. Checking Node.js..."
if command -v node &> /dev/null; then
    echo "   ✓ Node.js installed: $(node -v)"
else
    echo "   ✗ Node.js not installed"
fi
echo ""

# Check npm
echo "5. Checking npm..."
if command -v npm &> /dev/null; then
    echo "   ✓ npm installed: $(npm -v)"
else
    echo "   ✗ npm not installed"
fi
echo ""

# Check build directory
echo "6. Checking React build..."
if [ -d "build" ]; then
    BUILD_SIZE=$(du -sh build | cut -f1)
    FILE_COUNT=$(find build -type f | wc -l)
    echo "   ✓ Build directory exists"
    echo "   Size: $BUILD_SIZE (Files: $FILE_COUNT)"
else
    echo "   ✗ Build directory not found"
    echo "   Run: npm run build"
fi
echo ""

# Check production env file
echo "7. Checking production environment..."
if [ -f "server/.env.production" ]; then
    echo "   ✓ Production .env exists"
    REQUIRED_VARS=("MYSQL_HOST" "MYSQL_USER" "MYSQL_PASSWORD" "MYSQL_DATABASE" "FIREBASE_PROJECT_ID")
    for var in "${REQUIRED_VARS[@]}"; do
        if grep -q "^$var=" server/.env.production; then
            echo "   ✓ $var configured"
        else
            echo "   ⚠ $var not set"
        fi
    done
else
    echo "   ✗ Production .env not found"
    echo "   Copy from: server/.env.example"
fi
echo ""

# Check RDS instance
echo "8. Checking RDS instances..."
if aws rds describe-db-instances --query 'DBInstances[?DBInstanceIdentifier==\`businessonline-db\`]' --output json &> /dev/null; then
    RDS_STATUS=$(aws rds describe-db-instances --db-instance-identifier businessonline-db --query 'DBInstances[0].DBInstanceStatus' --output text 2>/dev/null)
    if [ "$RDS_STATUS" = "available" ]; then
        echo "   ✓ RDS instance 'businessonline-db' is available"
        RDS_ENDPOINT=$(aws rds describe-db-instances --db-instance-identifier businessonline-db --query 'DBInstances[0].Endpoint.Address' --output text)
        echo "   Endpoint: $RDS_ENDPOINT"
    else
        echo "   ⚠ RDS instance status: $RDS_STATUS"
    fi
else
    echo "   ⚠ RDS instance 'businessonline-db' not found"
    echo "   Create with: aws rds create-db-instance ... (see guide)"
fi
echo ""

# Check Elastic Beanstalk environment
echo "9. Checking Elastic Beanstalk environments..."
if eb status &> /dev/null; then
    EB_STATUS=$(eb status --json 2>/dev/null | grep -o '"Status":"[^"]*"' | cut -d'"' -f4 || echo "unknown")
    echo "   ✓ Elastic Beanstalk configured"
    echo "   Environment status: $EB_STATUS"
else
    echo "   ⚠ Elastic Beanstalk not initialized"
    echo "   Initialize with: eb init -p node.js-20 businessonline --region us-east-1"
fi
echo ""

echo "=================================="
echo "✓ Verification complete!"
echo ""
echo "📚 Next steps:"
echo "   1. Review AWS_DEPLOYMENT_COMPLETE_GUIDE.md"
echo "   2. Run: bash AWS_DEPLOYMENT_SETUP.sh"
echo "   3. Follow on-screen instructions"
echo ""
