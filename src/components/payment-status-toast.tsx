"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

export function PaymentStatusToast() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const payment = searchParams.get("payment");

    if (payment === "success") {
      toast.success("Payment received. Your delivery request is being processed.");
    } else if (payment === "cancelled") {
      toast.error("Checkout was cancelled. No charge was made.");
    }
  }, [searchParams]);

  return null;
}
