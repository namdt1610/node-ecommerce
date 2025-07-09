# Stripe Frontend Integration Examples

## 🚀 **React/Next.js Integration**

### **1. Install Dependencies**

```bash
npm install @stripe/stripe-js @stripe/react-stripe-js
```

### **2. Environment Variables (Frontend)**

```bash
# .env.local (Next.js)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
```

### **3. Stripe Provider Setup**

```typescript
// lib/stripe.ts
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default stripePromise
```

```typescript
// pages/_app.tsx (hoặc app/layout.tsx cho App Router)
import { Elements } from '@stripe/react-stripe-js'
import stripePromise from '../lib/stripe'

function MyApp({ Component, pageProps }) {
  return (
    <Elements stripe={stripePromise}>
      <Component {...pageProps} />
    </Elements>
  )
}

export default MyApp
```

### **4. Checkout Component**

```typescript
// components/CheckoutForm.tsx
'use client'

import { useState } from 'react'
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js'

interface CheckoutFormProps {
  orderId: string
  amount: number
  onSuccess: () => void
  onError: (error: string) => void
}

export default function CheckoutForm({ orderId, amount, onSuccess, onError }: CheckoutFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [processing, setProcessing] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setProcessing(true)

    try {
      // 1. Create Payment Intent
      const response = await fetch('/api/payments/intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          orderId,
          amount,
          currency: 'USD',
        }),
      })

      const { data } = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create payment intent')
      }

      // 2. Confirm Payment
      const cardElement = elements.getElement(CardElement)
      
      const { error, paymentIntent } = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: cardElement!,
          billing_details: {
            name: 'Customer Name',
            email: 'customer@example.com',
          },
        },
      })

      if (error) {
        onError(error.message || 'Payment failed')
      } else if (paymentIntent.status === 'succeeded') {
        onSuccess()
      }
    } catch (err: any) {
      onError(err.message)
    } finally {
      setProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 border rounded">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
            },
          }}
        />
      </div>
      
      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded disabled:opacity-50"
      >
        {processing ? 'Processing...' : `Pay $${amount}`}
      </button>
    </form>
  )
}
```

### **5. Checkout Page**

```typescript
// pages/checkout.tsx
'use client'

import { useState } from 'react'
import { Elements } from '@stripe/react-stripe-js'
import stripePromise from '../lib/stripe'
import CheckoutForm from '../components/CheckoutForm'

export default function CheckoutPage() {
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  // These would come from your cart/order context
  const orderId = 'order-123'
  const amount = 99.99

  const handleSuccess = () => {
    setPaymentStatus('success')
    // Redirect to success page or show success message
    window.location.href = '/order-success'
  }

  const handleError = (error: string) => {
    setPaymentStatus('error')
    setErrorMessage(error)
  }

  if (paymentStatus === 'success') {
    return (
      <div className="max-w-md mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold text-green-600 mb-4">Payment Successful!</h2>
        <p>Thank you for your purchase.</p>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Complete Your Payment</h2>
      
      <div className="mb-4 p-4 bg-gray-50 rounded">
        <p>Order ID: {orderId}</p>
        <p className="text-xl font-semibold">Total: ${amount}</p>
      </div>

      {paymentStatus === 'error' && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {errorMessage}
        </div>
      )}

      <Elements stripe={stripePromise}>
        <CheckoutForm
          orderId={orderId}
          amount={amount}
          onSuccess={handleSuccess}
          onError={handleError}
        />
      </Elements>
    </div>
  )
}
```

### **6. API Integration Hook**

```typescript
// hooks/usePayments.ts
import { useState } from 'react'

interface CreatePaymentIntentParams {
  orderId: string
  amount: number
  currency?: string
}

export function usePayments() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createPaymentIntent = async (params: CreatePaymentIntentParams) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/payments/intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          ...params,
          currency: params.currency || 'USD',
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create payment intent')
      }

      return data.data
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getPaymentStatus = async (paymentIntentId: string) => {
    try {
      const response = await fetch(`/api/payments/status/${paymentIntentId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })

      const data = await response.json()
      return data.data
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  return {
    createPaymentIntent,
    getPaymentStatus,
    loading,
    error,
  }
}
```

### **7. Advanced Payment Form với Custom Styling**

```typescript
// components/CustomPaymentForm.tsx
'use client'

import { useState, useEffect } from 'react'
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from '@stripe/react-stripe-js'

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#32325d',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  },
}

export default function CustomPaymentForm({ orderId, amount, onSuccess, onError }) {
  const stripe = useStripe()
  const elements = useElements()
  const [processing, setProcessing] = useState(false)
  const [cardComplete, setCardComplete] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements || !cardComplete) {
      return
    }

    setProcessing(true)

    try {
      // Create Payment Intent
      const response = await fetch('/api/payments/intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ orderId, amount, currency: 'USD' }),
      })

      const { data } = await response.json()

      // Confirm Payment
      const cardNumberElement = elements.getElement(CardNumberElement)
      
      const { error, paymentIntent } = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: cardNumberElement!,
          billing_details: {
            name: 'Customer Name',
          },
        },
      })

      if (error) {
        onError(error.message || 'Payment failed')
      } else if (paymentIntent.status === 'succeeded') {
        onSuccess()
      }
    } catch (err: any) {
      onError(err.message)
    } finally {
      setProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Number
          </label>
          <div className="border border-gray-300 rounded-md p-3">
            <CardNumberElement
              options={CARD_ELEMENT_OPTIONS}
              onChange={(e) => setCardComplete(e.complete)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expiry Date
            </label>
            <div className="border border-gray-300 rounded-md p-3">
              <CardExpiryElement options={CARD_ELEMENT_OPTIONS} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CVC
            </label>
            <div className="border border-gray-300 rounded-md p-3">
              <CardCvcElement options={CARD_ELEMENT_OPTIONS} />
            </div>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe || !cardComplete || processing}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {processing ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Processing...
          </div>
        ) : (
          `Pay $${amount}`
        )}
      </button>
    </form>
  )
}
```

### **8. Mobile-Optimized Payment**

```typescript
// components/MobilePaymentForm.tsx
'use client'

import { useState } from 'react'
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js'

export default function MobilePaymentForm({ orderId, amount, onSuccess, onError }) {
  const stripe = useStripe()
  const elements = useElements()
  const [processing, setProcessing] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setProcessing(true)

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
        redirect: 'if_required',
      })

      if (error) {
        onError(error.message || 'Payment failed')
      } else {
        onSuccess()
      }
    } catch (err: any) {
      onError(err.message)
    } finally {
      setProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement
        options={{
          layout: {
            type: 'tabs',
            defaultCollapsed: false,
          },
        }}
      />
      
      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg disabled:opacity-50 text-lg font-medium"
      >
        {processing ? 'Processing...' : `Pay $${amount}`}
      </button>
    </form>
  )
}
```

### **9. Payment Status Component**

```typescript
// components/PaymentStatus.tsx
'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

export default function PaymentStatus() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const paymentIntentId = searchParams.get('payment_intent')
    const paymentIntentStatus = searchParams.get('payment_intent_client_secret')

    if (paymentIntentId) {
      // Check payment status
      fetch(`/api/payments/status/${paymentIntentId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setStatus('success')
            setMessage('Payment completed successfully!')
          } else {
            setStatus('error')
            setMessage('Payment verification failed')
          }
        })
        .catch(() => {
          setStatus('error')
          setMessage('Error checking payment status')
        })
    }
  }, [searchParams])

  if (status === 'loading') {
    return <div className="text-center">Checking payment status...</div>
  }

  return (
    <div className={`text-center p-6 rounded-lg ${
      status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
    }`}>
      <h2 className="text-2xl font-bold mb-2">
        {status === 'success' ? '✅ Payment Success' : '❌ Payment Failed'}
      </h2>
      <p>{message}</p>
    </div>
  )
}
```

## 📱 **React Native Integration**

```typescript
// Install: npm install @stripe/stripe-react-native

// App.tsx
import { StripeProvider } from '@stripe/stripe-react-native'

export default function App() {
  return (
    <StripeProvider publishableKey="pk_test_...">
      <YourAppContent />
    </StripeProvider>
  )
}

// PaymentScreen.tsx
import { useStripe } from '@stripe/stripe-react-native'

export default function PaymentScreen() {
  const { confirmPayment } = useStripe()

  const handlePayPress = async () => {
    // Create payment intent from your backend
    const response = await fetch('/api/payments/intent', {
      method: 'POST',
      body: JSON.stringify({ orderId: 'order-123', amount: 99.99 }),
    })
    const { clientSecret } = await response.json()

    // Confirm payment
    const { error, paymentIntent } = await confirmPayment(clientSecret, {
      paymentMethodType: 'Card',
    })

    if (error) {
      console.log('Payment failed:', error)
    } else {
      console.log('Payment succeeded:', paymentIntent)
    }
  }

  return (
    <TouchableOpacity onPress={handlePayPress}>
      <Text>Pay Now</Text>
    </TouchableOpacity>
  )
}
```

## 🎯 **Testing Checklist**

- [ ] Test với Stripe test cards
- [ ] Test successful payment flow
- [ ] Test failed payment flow
- [ ] Test webhook handling
- [ ] Test mobile responsiveness
- [ ] Test error handling
- [ ] Test loading states
- [ ] Test different currencies (nếu cần)

Stripe frontend integration đã sẵn sàng! 🚀 