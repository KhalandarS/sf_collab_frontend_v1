import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "@/utils/config";
import { useSelector } from "react-redux";

export default function ReturnPage() {
  const [status, setStatus] = useState("loading"); // loading, success, failed
  const [session, setSession] = useState(null);
  const [error, setError] = useState(null);
  const { access_token } = useSelector((state) => state.auth);

  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  async function savePaymentInfo(checkout) {
    const body = {
      user_id: checkout.metadata.user_id,
      plan_id: checkout.metadata.plan_id,
      amount: checkout.amount_total,
      currency: checkout.currency,
      stripe_payment_intent_id: checkout.payment_intent
    }
    const response = await axios.post(`${API_URL}/payments/record-transaction`, body, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access_token}`,
      }
    });
    console.log("Transaction recorded:", response.data);
  }
  useEffect(() => {
    if (!sessionId) {
      setStatus("failed");
      setError("No session_id provided");
      return;
    }

    async function fetchSession() {
      try {
        const res = await axios.get(`${API_URL}/payments/checkout-session/${sessionId}`, {
          headers: {
            "Authorization": `Bearer ${access_token}`,
          },
        });

        setSession(res.data);
        if (res.data.payment_status === "paid") {
          setStatus("success");
          savePaymentInfo(res.data);
        } else {
          setStatus("failed");
          setError("Payment not completed");
        }
      } catch (err) {
        console.error(err);
        setStatus("failed");
        setError(err.response?.data?.message || "Something went wrong");
      }
    }

    fetchSession();
  }, [sessionId, access_token]);

  if (status === "loading") return <div className="text-center mt-20">Checking payment...</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 p-8">
      {status === "success" ? (
        <div className="bg-green-700 text-white p-8 rounded-2xl shadow-lg text-center">
          <h1 className="text-3xl font-bold mb-4">Payment Successful! 🎉</h1>
          <p className="mb-2">Thank you for your purchase.</p>
          <p>Plan: {session?.metadata?.plan_id}</p>
          <p>Amount: {(session?.amount_total / 100).toFixed(2)} {session?.currency?.toUpperCase()}</p>
        </div>
      ) : (
        <div className="bg-red-700 text-white p-8 rounded-2xl shadow-lg text-center">
          <h1 className="text-3xl font-bold mb-4">Payment Failed ❌</h1>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
