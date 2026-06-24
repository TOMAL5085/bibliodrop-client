import Stripe from "stripe";

let stripeClient: Stripe | null = null;

export function getStripeSecretKey() {
  return process.env.STRIPE_SECRET_KEY?.trim() ?? "";
}

export function getStripeWebhookSecret() {
  return process.env.STRIPE_WEBHOOK_SECRET?.trim() ?? "";
}

export function getAppBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "") ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
  );
}

export function isStripeConfigured() {
  return Boolean(getStripeSecretKey());
}

export function getStripeClient() {
  const secretKey = getStripeSecretKey();
  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }

  if (!stripeClient) {
    stripeClient = new Stripe(secretKey);
  }

  return stripeClient;
}

export function toStripeAmount(deliveryFee: number) {
  return Math.round(deliveryFee * 100);
}
