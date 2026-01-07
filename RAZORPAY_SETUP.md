# Razorpay Integration Setup Guide

## Environment Variables

Add the following environment variables to your `.env.local` file (for local development) or your deployment platform (Vercel, etc.):

### Required Frontend Variables

```env
# Backend API URL
NEXT_PUBLIC_BACKEND_API_URL=https://texonaxa-cms.vercel.app

# Razorpay Public Key (Frontend)
# Get this from Razorpay Dashboard: https://dashboard.razorpay.com/app/keys
# For development, use Test Keys (rzp_test_...)
# For production, use Live Keys (rzp_live_...)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
```

### Backend Variables (Already Configured)

These should be in your backend `.env` file (NOT in the frontend):

```env
# Razorpay Secret Key (Backend Only - Never expose to frontend!)
RAZORPAY_KEY_SECRET=your_secret_key_here

# Razorpay Webhook Secret (Backend Only)
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_here
```

## Getting Razorpay Keys

1. **Sign up/Login** to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. **Complete KYC** verification (required for live keys)
3. **Get Test Keys:**
   - Go to: Settings → API Keys
   - Generate Test Keys
   - Copy `Key ID` → Use as `NEXT_PUBLIC_RAZORPAY_KEY_ID`
   - Copy `Key Secret` → Use as `RAZORPAY_KEY_SECRET` (backend only)

4. **Get Live Keys (for production):**
   - Complete KYC first
   - Switch to Live Mode
   - Generate Live Keys
   - Use the same format

5. **Configure Webhook:**
   - Go to: Settings → Webhooks
   - Add webhook URL: `https://your-backend-domain.com/api/razorpay/webhook`
   - Select events: `payment.captured`, `payment.failed`, `order.paid`
   - Copy Webhook Secret → Use as `RAZORPAY_WEBHOOK_SECRET` (backend only)

## Frontend Implementation

The contact form now has a **3-step flow**:

### Step 1: Lead Form
- User fills: Name, Email, Phone, Company, **Region** (required), Budget, Service, Message
- On submit: Creates lead with status "new"
- Moves to Step 2

### Step 2: Package Selection
- System fetches packages based on selected service and region
- User can:
  - Select a package → Proceeds to payment (Step 3)
  - Skip → Shows thank you message, ends flow

### Step 3: Razorpay Payment
- Creates Razorpay order via backend
- Opens Razorpay checkout modal
- On success: Verifies payment, updates lead status to "converted"
- On failure: Shows error, user can retry

## API Endpoints Used

The frontend calls these backend endpoints:

1. **POST `/api/leads`** - Create lead (Step 1)
2. **GET `/api/packages?service={service}&region={region}`** - Fetch packages (Step 2)
3. **POST `/api/razorpay/create-order`** - Create payment order (Step 3)
4. **POST `/api/razorpay/verify`** - Verify payment (Step 3)

## Testing

### Test Cards (Razorpay Test Mode)

**Success:**
- Card: `4111 1111 1111 1111`
- CVV: Any 3 digits
- Expiry: Any future date

**Failure:**
- Card: `4111 1111 1111 1112`

### Test Flow

1. Fill Step 1 form with test data
2. Select a package in Step 2
3. Use test card in Step 3
4. Verify lead status changes to "converted" in admin dashboard

## Important Notes

1. **Never expose secret keys** to frontend (no `NEXT_PUBLIC_` prefix)
2. **Always verify signatures** on backend (already implemented)
3. **Test with test keys** before switching to live keys
4. **Webhook URL** must be publicly accessible (not localhost)
5. **HTTPS required** for production webhooks

## Troubleshooting

### Payment modal not opening
- Check if Razorpay script is loaded: `window.Razorpay` should exist
- Verify `NEXT_PUBLIC_RAZORPAY_KEY_ID` is set correctly
- Check browser console for errors

### Payment verification fails
- Ensure backend has correct `RAZORPAY_KEY_SECRET`
- Check signature verification logic in backend
- Verify order was created successfully

### Packages not loading
- Check backend `/api/packages` endpoint
- Verify service and region parameters are sent correctly
- Check browser network tab for API errors

