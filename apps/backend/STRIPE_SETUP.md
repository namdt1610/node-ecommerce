# Stripe Payment Integration Setup

## Overview

Chức năng thanh toán Stripe đã được setup hoàn chỉnh với clean architecture pattern. Dưới đây là hướng dẫn cấu hình và sử dụng.

## 🔧 **Environment Variables**

Thêm các environment variables sau vào file `.env`:

```bash
# Stripe Payment Gateway
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key_here"
STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_publishable_key_here"  
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret_here"
```

## 📚 **API Endpoints**

### 1. **Create Payment Intent**
```http
POST /api/payments/intent
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "orderId": "uuid-order-id",
  "amount": 99.99,
  "currency": "USD",
  "metadata": {
    "productId": "product-123",
    "customerNote": "Gift wrapping requested"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "pi_1234567890",
    "amount": 99.99,
    "currency": "USD",
    "status": "requires_payment_method",
    "clientSecret": "pi_1234567890_secret_abc123",
    "metadata": {
      "orderId": "uuid-order-id",
      "userId": "user-id"
    }
  },
  "message": "Payment intent created successfully"
}
```

### 2. **Confirm Payment**
```http
POST /api/payments/confirm
Content-Type: application/json

{
  "paymentIntentId": "pi_1234567890",
  "paymentMethodId": "pm_1234567890"
}
```

### 3. **Refund Payment**
```http
POST /api/payments/refund
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "paymentIntentId": "pi_1234567890",
  "amount": 50.00,
  "reason": "requested_by_customer"
}
```

### 4. **Get Payment Status**
```http
GET /api/payments/status/:paymentIntentId
Authorization: Bearer <jwt_token>
```

### 5. **Webhook Endpoint**
```http
POST /api/payments/webhook
Stripe-Signature: t=1234567890,v1=abc123...
Content-Type: application/json
```

## 🏗️ **Architecture**

### **Domain Layer**
```
domain/
├── interfaces/
│   ├── payment-gateway.interface.ts    # Interface cho payment gateway
│   └── payment-container.ts           # DI container interface
```

### **Application Layer**
```
application/
├── use-cases/
│   ├── create-payment-intent.usecase.ts
│   ├── confirm-payment.usecase.ts
│   ├── refund-payment.usecase.ts
│   └── handle-webhook.usecase.ts
└── dto/
    └── payment.dto.ts                  # DTOs với Zod validation
```

### **Infrastructure Layer**
```
infrastructure/
└── services/
    └── stripe-payment-gateway.ts       # Stripe implementation
```

### **Presentation Layer**
```
presentation/
└── controllers/
    └── payment.controller.ts           # HTTP controllers
```

## 🔄 **Payment Flow**

### **Frontend Integration Flow:**

1. **Create Payment Intent**
   ```typescript
   // Frontend: Create payment intent
   const response = await fetch('/api/payments/intent', {
     method: 'POST',
     headers: {
       'Authorization': `Bearer ${token}`,
       'Content-Type': 'application/json'
     },
     body: JSON.stringify({
       orderId: 'order-123',
       amount: 99.99,
       currency: 'USD'
     })
   })
   const { data } = await response.json()
   const { clientSecret } = data
   ```

2. **Frontend Payment Processing**
   ```typescript
   // Frontend: Use Stripe Elements
   import { loadStripe } from '@stripe/stripe-js'
   import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'

   const stripe = await loadStripe('pk_test_...')

   // In component:
   const result = await stripe.confirmCardPayment(clientSecret, {
     payment_method: {
       card: cardElement,
       billing_details: {
         name: 'Customer Name',
         email: 'customer@example.com'
       }
     }
   })
   ```

3. **Webhook Processing**
   - Stripe tự động gọi webhook khi payment thành công
   - Backend xử lý webhook và cập nhật order status
   - Gửi email confirmation (TODO)

## 🎯 **Stripe Dashboard Configuration**

### **1. Webhook Setup**
1. Đăng nhập Stripe Dashboard
2. Developers → Webhooks → Add endpoint
3. URL: `https://yourdomain.com/api/payments/webhook`
4. Events to send:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `payment_intent.canceled`
   - `charge.dispute.created`

### **2. API Keys**
1. Developers → API keys
2. Copy **Publishable key** (pk_test_...) cho frontend
3. Copy **Secret key** (sk_test_...) cho backend
4. Copy **Webhook signing secret** (whsec_...) từ webhook endpoint

## 🧪 **Testing**

### **Test Cards (Stripe Test Mode):**
```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
Insufficient funds: 4000 0000 0000 9995
Expired card: 4000 0000 0000 0069
CVC fail: 4000 0000 0000 0127
```

### **Testing Webhooks Locally:**
```bash
# Install Stripe CLI
npm install -g stripe-cli

# Login to Stripe
stripe login

# Forward events to local server
stripe listen --forward-to localhost:3030/api/payments/webhook

# This will give you webhook signing secret for .env
```

## 💡 **Next Steps**

### **Integration với Order System:**
1. Khi payment succeed → Update order status to "PAID"
2. Khi payment failed → Update order status to "FAILED"
3. Auto inventory management
4. Email notifications

### **Security Features:**
1. ✅ Webhook signature verification
2. ✅ Authentication required for sensitive endpoints
3. ✅ Input validation với Zod
4. ✅ Error handling

### **Additional Features có thể thêm:**
1. **Subscription payments** cho recurring products
2. **Multi-party payments** cho marketplace
3. **Payment analytics** dashboard
4. **Fraud detection** integration
5. **Currency conversion** support

## 🔒 **Security Notes**

1. **Never expose Secret Key** trên frontend
2. **Always validate webhooks** với signature
3. **Use HTTPS** cho production
4. **Monitor failed payments** để detect fraud
5. **Store minimal payment data** - Stripe handles sensitive info

## 📋 **Checklist Setup**

- [ ] Cài đặt Stripe SDK: `npm install stripe @types/stripe`
- [ ] Thêm environment variables vào `.env`
- [ ] Setup webhook endpoint trong Stripe Dashboard
- [ ] Test với test cards
- [ ] Setup webhook forwarding cho development
- [ ] Integrate với order management system
- [ ] Setup email notifications
- [ ] Test production với real cards (small amounts)

Payment system đã sẵn sàng sử dụng! 🎉 