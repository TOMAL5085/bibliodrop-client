"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Truck } from "lucide-react";
import toast from "react-hot-toast";
import { getSession, requestDelivery } from "@/lib/api";

type RequestDeliveryButtonProps = {
  bookId: string;
  disabled?: boolean;
};

export function RequestDeliveryButton({ bookId, disabled = false }: RequestDeliveryButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleRequest() {
    if (disabled || loading) {
      return;
    }

    setLoading(true);

    try {
      const session = await getSession();
      if (!session?.user) {
        toast.error("Sign in to request delivery.");
        router.push(`/login?next=${encodeURIComponent(`/books/${bookId}`)}`);
        return;
      }

      const result = await requestDelivery({ bookId, userEmail: session.user.email });
      if (!result) {
        toast.error("Unable to request delivery. Try again in a moment.");
        return;
      }

      toast.success("Delivery requested. Dashboard stats will update shortly.");
      window.dispatchEvent(new Event("bibliodrop-delivery-changed"));
      router.refresh();
    } catch {
      toast.error("Unable to request delivery. Try again in a moment.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      disabled={disabled || loading}
      onClick={handleRequest}
      className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold ${
        disabled || loading
          ? "cursor-not-allowed bg-slate-200 text-slate-400"
          : "bg-slate-950 text-white transition hover:bg-slate-800"
      }`}
    >
      {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Truck className="h-4 w-4" />}
      Request Delivery
    </button>
  );
}
