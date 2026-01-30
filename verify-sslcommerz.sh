#!/bin/bash

# SSLCommerz Production Configuration Verification Script
# This script verifies that all required environment variables are set correctly

echo "=================================================="
echo "SSLCommerz Production Configuration Verification"
echo "=================================================="
echo ""

# Load environment variables
if [ -f server/.env ]; then
    source server/.env
else
    echo "❌ ERROR: server/.env file not found!"
    exit 1
fi

# Function to check if variable is set
check_var() {
    local var_name=$1
    local var_value=${!var_name}
    
    if [ -z "$var_value" ]; then
        echo "❌ $var_name: NOT SET"
        return 1
    else
        # Mask sensitive values
        if [[ "$var_name" == *"KEY"* ]] || [[ "$var_name" == *"SECRET"* ]] || [[ "$var_name" == *"PASSWORD"* ]]; then
            echo "✓ $var_name: ***${var_value: -4}"
        else
            echo "✓ $var_name: $var_value"
        fi
        return 0
    fi
}

echo "Required SSLCommerz Variables:"
echo "------------------------------"

errors=0

check_var "SSLCOMMERZ_STORE_ID" || ((errors++))
check_var "SSLCOMMERZ_API_KEY" || ((errors++))
check_var "SSLCOMMERZ_IS_LIVE" || ((errors++))

echo ""
echo "Required URL Variables:"
echo "----------------------"

check_var "BACKEND_URL" || ((errors++))
check_var "FRONTEND_URL" || ((errors++))

echo ""
echo "Payment Mode Check:"
echo "------------------"

if [ "$SSLCOMMERZ_IS_LIVE" = "true" ]; then
    echo "⚠️  Mode: PRODUCTION"
    echo "   Real transactions will be processed!"
    
    # Check if using test credentials
    if [[ "$SSLCOMMERZ_STORE_ID" == *"test"* ]] || [[ "$SSLCOMMERZ_STORE_ID" == *"sandbox"* ]]; then
        echo "❌ WARNING: Store ID appears to be a test/sandbox credential!"
        echo "   Production mode requires production credentials!"
        ((errors++))
    fi
    
    # Check if URLs are localhost
    if [[ "$BACKEND_URL" == *"localhost"* ]] || [[ "$FRONTEND_URL" == *"localhost"* ]]; then
        echo "❌ WARNING: URLs contain 'localhost'!"
        echo "   Production requires publicly accessible URLs!"
        ((errors++))
    fi
    
    # Check for HTTPS
    if [[ "$BACKEND_URL" != https://* ]]; then
        echo "❌ WARNING: BACKEND_URL is not HTTPS!"
        echo "   SSLCommerz requires HTTPS for production callbacks!"
        ((errors++))
    fi
else
    echo "ℹ️  Mode: SANDBOX (Test Mode)"
    echo "   No real transactions will be processed"
fi

echo ""
echo "=================================================="

if [ $errors -eq 0 ]; then
    echo "✅ Configuration looks good!"
    echo "   You can start the server now."
else
    echo "❌ Found $errors configuration issue(s)"
    echo "   Please fix the issues above before going live."
    exit 1
fi

echo "=================================================="
