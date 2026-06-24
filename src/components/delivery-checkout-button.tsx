"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";
import { getSession, startStripeCheckout } from "@/lib/api";

type DeliveryCheckoutButtonProps = {
  bookId: string;
  disabled?: boolean;
};

export function DeliveryCheckoutButton({ bookId, disabled = false }: DeliveryCheckoutButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    if (disabled || loading) {
      return;
    }

    setLoading(true);

    try {
      const session = await getSession();
      if (!session?.user) {
        toast.error("Sign in to pay for delivery.");
        router.push(`/login?next=${encodeURIComponent(`/books/${bookId}`)}`);
        return;
      }

      const checkout = await startStripeCheckout(bookId);
      if (!checkout?.url) {
        toast.error("Stripe checkout is unavailable. Check your server configuration.");
        return;
      }

      window.location.href = checkout.url;
    } catch {
      toast.error("Unable to start checkout. Try again in a moment.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      disabled={disabled || loading}
      onClick={handleCheckout}
      className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-950 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
      Pay delivery fee with Stripe
    </button>
  );
}
