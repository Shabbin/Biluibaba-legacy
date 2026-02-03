# SSLCommerz Production Deployment Checklist

Use this checklist before deploying to production.

## Pre-Deployment Checks

### ✅ Code Changes
- [x] Updated `server/utils/Payment.js` to use environment variable
- [x] Added startup validation in `server/server.js`
- [x] Created `.env.example` template
- [x] Created production documentation
- [x] Created verification script
- [x] Updated README.md

### ⚠️ Environment Configuration
- [x] `SSLCOMMERZ_STORE_ID` is set to production credentials
- [x] `SSLCOMMERZ_API_KEY` is set to production credentials
- [x] `SSLCOMMERZ_IS_LIVE=true` in `.env`
- [ ] `BACKEND_URL` is set to production URL (currently localhost)
- [ ] `FRONTEND_URL` is set to production URL (currently localhost)
- [ ] `NODE_ENV=production` is set

### 🔒 Security
- [ ] Backend has valid SSL certificate (HTTPS required)
- [ ] `.env` file is in `.gitignore` (verify)
- [ ] Production credentials are stored securely
- [ ] Firewall allows SSLCommerz IP addresses (if applicable)

### 🌐 Network & URLs
- [ ] Backend URL is publicly accessible
- [ ] Backend accepts POST requests at callback endpoints:
  - [ ] `/api/order/validate`
  - [ ] `/api/adoptions/validate`
  - [ ] `/api/vet/appointment/validate`
- [ ] Frontend URL is publicly accessible
- [ ] No localhost or development URLs in production `.env`

### 📊 SSLCommerz Account
- [ ] SSLCommerz production account is activated
- [ ] Production credentials verified with SSLCommerz support
- [ ] Merchant dashboard access confirmed
- [ ] Payment settlement details configured
- [ ] Business verification completed

### 🧪 Testing
- [ ] Run verification script: `./verify-sslcommerz.sh`
- [ ] Server starts without errors
- [ ] Startup logs show "PRODUCTION" mode
- [ ] Test with minimum transaction amount
- [ ] Verify payment gateway redirects to securepay.sslcommerz.com
- [ ] Test successful payment flow
- [ ] Test failed payment flow
- [ ] Test cancelled payment flow
- [ ] Verify email notifications are sent
- [ ] Verify database updates correctly

### 📝 Documentation
- [x] Production setup guide created
- [x] Changelog documented
- [x] README updated
- [ ] Team informed of production mode
- [ ] Monitoring procedures documented

### 🔍 Monitoring
- [ ] Logging system configured
- [ ] Error tracking set up (e.g., Sentry)
- [ ] Payment logs are being written
- [ ] Dashboard for transaction monitoring ready
- [ ] Alert system for failed payments configured

## Deployment Steps

### 1. Run Verification
```bash
./verify-sslcommerz.sh
```
Expected: All checks pass ✅

### 2. Update Environment Variables
Edit `server/.env`:
```env
NODE_ENV=production
BACKEND_URL=https://api.yourdomain.com
FRONTEND_URL=https://yourdomain.com
SSLCOMMERZ_IS_LIVE=true
```

### 3. Start Server
```bash
cd server
npm start
# or with PM2:
pm2 start server.js --name biluibaba-api
```

### 4. Verify Startup Logs
Look for:
```
==============================================
SSLCommerz Configuration Check
==============================================
Environment: production
SSLCommerz Mode: PRODUCTION ✓
```

### 5. Test Payment Flow
1. Create a test order with minimum amount
2. Complete payment on SSLCommerz gateway
3. Verify callback is received
4. Check database for order status update
5. Verify customer receives email confirmation

### 6. Monitor Initial Transactions
- Watch server logs in real-time
- Check SSLCommerz merchant dashboard
- Verify settlement appears in dashboard
- Confirm no error alerts

## Post-Deployment

### Day 1 Checks
- [ ] Monitor first 5 transactions closely
- [ ] Verify all payment types work (products, adoptions, appointments)
- [ ] Check error rates
- [ ] Verify settlement in SSLCommerz dashboard
- [ ] Review server logs for any issues

### Week 1 Checks
- [ ] Review transaction success rate
- [ ] Check for any failed webhooks
- [ ] Verify all email notifications sent
- [ ] Review customer support tickets related to payments
- [ ] Analyze payment analytics

### Ongoing Monitoring
- [ ] Daily transaction monitoring
- [ ] Weekly settlement verification
- [ ] Monthly reconciliation with SSLCommerz
- [ ] Regular credential rotation (every 6 months)
- [ ] Keep documentation updated

## Emergency Rollback

If critical issues occur:

1. **Immediate**: Set `SSLCOMMERZ_IS_LIVE=false` in `.env`
2. **Restart**: Restart the server
3. **Verify**: Check logs show "SANDBOX" mode
4. **Investigate**: Review error logs and SSLCommerz dashboard
5. **Contact**: Reach out to SSLCommerz support if needed

## Rollback Command
```bash
# Stop server
pm2 stop biluibaba-api

# Edit .env
nano /path/to/server/.env
# Change: SSLCOMMERZ_IS_LIVE=false

# Restart server
pm2 start biluibaba-api

# Verify
pm2 logs biluibaba-api | grep "SSLCommerz"
# Should show: "SSLCommerz initialized in SANDBOX mode"
```

## Support Contacts

### SSLCommerz
- **Email**: operation@sslcommerz.com
- **Phone**: +880 1678 906 906
- **Merchant Portal**: https://merchant.sslcommerz.com/
- **Hours**: 9 AM - 6 PM (Bangladesh Time)

### Internal
- **Server Logs**: Check application logs
- **Error Tracking**: Check error monitoring service
- **Documentation**: `SSLCOMMERZ_PRODUCTION_SETUP.md`

## Sign-Off

Before going live, ensure:

- [ ] Technical lead has reviewed all changes
- [ ] QA has tested all payment flows
- [ ] Security review completed
- [ ] SSLCommerz integration confirmed
- [ ] Backup and rollback plan ready
- [ ] Monitoring systems active
- [ ] Team trained on production procedures

**Deployment Approved By**: _________________

**Date**: _________________

**Production Go-Live Time**: _________________

---

## Quick Reference

### Check Current Mode
```bash
cd server
grep SSLCOMMERZ_IS_LIVE .env
```

### View Startup Logs
```bash
pm2 logs biluibaba-api --lines 50 | grep -A 10 "SSLCommerz"
```

### Test Payment Endpoint
```bash
curl -X POST https://api.yourdomain.com/api/order/validate \
  -H "Content-Type: application/json" \
  -d '{"status":"test"}'
```

### Monitor Real-Time Logs
```bash
pm2 logs biluibaba-api --lines 100
```

---

**Status**: Ready for deployment after URL updates
**Last Updated**: January 27, 2026
**Version**: 1.0
