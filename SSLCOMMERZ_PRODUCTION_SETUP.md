# SSLCommerz Production Configuration Guide

## Overview
This document provides a comprehensive guide for configuring SSLCommerz payment gateway in production mode for the Biluibaba platform.

## Changes Made

### 1. Payment.js Configuration (server/utils/Payment.js)
**Previous Issue:** The SSLCommerz instance was hardcoded with `false` as the third parameter, forcing it to always run in sandbox mode regardless of the environment variable.

**Fix Applied:**
```javascript
const isLive = process.env.SSLCOMMERZ_IS_LIVE === 'true';
const SSLCommerz = new SSLCommerzPayment(
  process.env.SSLCOMMERZ_STORE_ID,
  process.env.SSLCOMMERZ_API_KEY,
  isLive // true for production, false for sandbox
);
```

### 2. Enhanced Logging
Added comprehensive logging throughout the payment flow:
- **Initialization logs**: Shows payment mode (PRODUCTION/SANDBOX) on server startup
- **Payment creation logs**: Transaction ID, amount, product details
- **Validation logs**: Validation ID, status, transaction details

### 3. Server Startup Validation (server/server.js)
Added configuration validation on server startup:
- Verifies all required SSLCommerz environment variables are set
- Displays current payment mode prominently
- Shows warning when running in production mode
- Exits if required variables are missing

## Environment Variables

### Required Variables
```env
SSLCOMMERZ_STORE_ID=bilui67fbeb6dbaac0
SSLCOMMERZ_API_KEY=bilui67fbeb6dbaac0@ssl
SSLCOMMERZ_IS_LIVE=true
BACKEND_URL=https://api.yourdomain.com
FRONTEND_URL=https://yourdomain.com
```

### Environment Variable Details

| Variable | Description | Current Value |
|----------|-------------|---------------|
| `SSLCOMMERZ_STORE_ID` | Your SSLCommerz merchant store ID | `bilui67fbeb6dbaac0` |
| `SSLCOMMERZ_API_KEY` | Your SSLCommerz store password/API key | `bilui67fbeb6dbaac0@ssl` |
| `SSLCOMMERZ_IS_LIVE` | Set to `true` for production, `false` for sandbox | `true` |
| `BACKEND_URL` | Your backend API URL (for payment callbacks) | Must be publicly accessible |
| `FRONTEND_URL` | Your frontend URL (for redirects) | Must be publicly accessible |

## Production Checklist

### Before Going Live

- [ ] **Verify Credentials**: Ensure `SSLCOMMERZ_STORE_ID` and `SSLCOMMERZ_API_KEY` are production credentials
  - Contact SSLCommerz support if you need production credentials
  - Test credentials typically start with "test" or contain "sandbox"
  - Production credentials are provided after merchant verification

- [ ] **Set Live Mode**: Confirm `SSLCOMMERZ_IS_LIVE=true` in `.env`

- [ ] **Update URLs**: Ensure all URLs are production URLs (not localhost)
  - `BACKEND_URL` must be publicly accessible HTTPS URL
  - `FRONTEND_URL` must be publicly accessible HTTPS URL
  - All callback URLs must accept POST requests from SSLCommerz

- [ ] **Test Webhook URLs**: Verify SSLCommerz can reach your callback endpoints
  - Success URL: `{BACKEND_URL}/api/order/validate`
  - Fail URL: `{BACKEND_URL}/api/order/validate`
  - IPN URL: `{BACKEND_URL}/api/order/validate`
  - Adoptions: `{BACKEND_URL}/api/adoptions/validate`
  - Appointments: `{BACKEND_URL}/api/vet/appointment/validate`

- [ ] **SSL Certificate**: Ensure your backend has a valid SSL certificate
  - SSLCommerz requires HTTPS for production callbacks
  - Use Let's Encrypt or your hosting provider's SSL

- [ ] **Whitelist IPs** (if using firewall): Add SSLCommerz IP addresses
  - Contact SSLCommerz for their current IP ranges

### Testing in Production

1. **Start with Small Amounts**: Test with minimum transaction amounts
2. **Monitor Logs**: Watch server logs for payment mode confirmation
3. **Verify Callbacks**: Ensure all callback URLs are being hit correctly
4. **Check Email Notifications**: Verify customers receive payment confirmations
5. **Test Failure Scenarios**: Try cancelled and failed payments

### Monitoring

The system now logs detailed information for each payment:

```
==============================================
SSLCommerz Configuration Check
==============================================
Environment: production
SSLCommerz Mode: PRODUCTION ✓
Store ID: bilui67fbeb6dbaac0
API Key: ***@ssl
Backend URL: https://api.yourdomain.com
Frontend URL: https://yourdomain.com

⚠️  WARNING: SSLCommerz is in PRODUCTION mode!
   Real transactions will be processed.
   Ensure you have valid production credentials.
==============================================
```

For each payment transaction:
```
=== Creating Payment Request ===
Transaction ID: ABC123XYZ
Amount: 1500.00 BDT
Product: Biluibaba Product
Mode: PRODUCTION
Payment Gateway URL: https://securepay.sslcommerz.com/...
Session Key: xxxxx
=== Payment Request Created Successfully ===
```

## Payment Flow

### 1. Product Orders
- Endpoint: `POST /api/order`
- Callback: `/api/order/validate`
- Products: General products from vendors

### 2. Adoption Payments
- Endpoint: `POST /api/adoptions/order`
- Callback: `/api/adoptions/validate`
- Products: Pet adoption fees

### 3. Vet Appointments
- Endpoint: `POST /api/vet/appointment/book`
- Callback: `/api/vet/appointment/validate`
- Products: Veterinary appointment fees

## Troubleshooting

### Issue: Payments still in sandbox mode
**Solution**: 
- Verify `SSLCOMMERZ_IS_LIVE=true` in `.env`
- Restart the server
- Check startup logs for "SSLCommerz Mode: PRODUCTION ✓"

### Issue: Payment gateway not accessible
**Solution**:
- Verify your SSLCommerz account is activated for production
- Check if your store credentials are correct
- Contact SSLCommerz support to verify account status

### Issue: Callbacks not working
**Solution**:
- Ensure `BACKEND_URL` is publicly accessible
- Verify SSL certificate is valid
- Check firewall settings
- Test callback URLs directly with curl

### Issue: Production transactions failing
**Solution**:
- Verify production credentials are active
- Check SSLCommerz dashboard for error messages
- Review server logs for detailed error information
- Ensure all required fields are being sent correctly

## SSLCommerz Dashboard

Access your SSLCommerz merchant dashboard:
- Production: https://merchant.sslcommerz.com/
- Sandbox: https://sandbox.sslcommerz.com/

Monitor:
- Transaction history
- Settlement reports
- Failed transactions
- API logs

## Security Best Practices

1. **Never commit `.env` file**: Already in `.gitignore`
2. **Rotate credentials regularly**: Update API keys periodically
3. **Use HTTPS only**: All production URLs must be HTTPS
4. **Validate webhooks**: Always verify payment status with `validatePayment()`
5. **Log transactions**: Keep detailed logs for auditing
6. **Monitor for fraud**: Review unusual transaction patterns

## Support

### SSLCommerz Support
- Email: operation@sslcommerz.com
- Phone: +880 1678 906 906
- Documentation: https://developer.sslcommerz.com/

### Internal Contact
- Check server logs at: `/var/log/` or your logging service
- Monitor application health
- Review payment validation logs

## Files Modified

1. `server/utils/Payment.js` - Main payment configuration
2. `server/server.js` - Startup validation
3. `server/.env.example` - Environment template
4. `SSLCOMMERZ_PRODUCTION_SETUP.md` - This documentation

## Rollback Plan

If you need to revert to sandbox mode:
1. Set `SSLCOMMERZ_IS_LIVE=false` in `.env`
2. Update credentials to sandbox credentials if needed
3. Restart the server
4. Verify logs show "SANDBOX ⚠️" mode

## Version History

- **v1.0** (Current) - Production mode implementation with environment-based configuration
  - Fixed hardcoded sandbox mode
  - Added comprehensive logging
  - Added startup validation
  - Created documentation
