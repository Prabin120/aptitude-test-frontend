export interface RazorpaySuccessResponse {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}

export interface RazorpayError {
  error: {
    description: string
    code: string
    source: string
    step: string
    reason: string
    metadata: Record<string, unknown>
  }
}

export interface RazorpayOptions {
  key: string
  order_id: string
  handler: (response: RazorpaySuccessResponse) => void
  prefill: {
    name: string
    email: string
    contact: string
  }
  theme: {
    color: string
  }
}
