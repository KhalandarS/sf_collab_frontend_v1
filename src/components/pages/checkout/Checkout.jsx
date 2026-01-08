// Checkout.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {useCheckout, PaymentElement, CheckoutProvider} from '@stripe/react-stripe-js/checkout';

import {
  Elements,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import axios from "axios";
import { API_URL, STRIPE_PUBLIC_KEY } from "@/utils/config";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

// Load Stripe with your public key
const stripePromise = loadStripe(STRIPE_PUBLIC_KEY); // <-- replace with your key

// Checkout Form Component
function CheckoutForm({ clientSecret }) {
  const checkoutState = useCheckout();
  const { user, access_token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (event) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();
    setLoading(true)
    if (checkoutState.type === 'loading') {
      return (
        <div>Loading...</div>
      );
    } else if (checkoutState.type === 'error') {
      return (
        <div>Error: {checkoutState.error.message}</div>
      );
    }

    // checkoutState.type === 'success'
    const { checkout } = checkoutState;
    const result = await checkout.confirm({
      redirect: 'always',
      email: user.email,
      phoneNumber: user.phoneNumber,
      billingAddress: checkoutState.billingAddress,
      shippingAddress: checkoutState.shippingAddress,
    });
    
    setLoading(false);
    if (result.type === 'error') {
      // Show error to your customer (for example, payment details incomplete)
      toast.error(`Payment failed: ${result.error.message}`);
      console.log(result.error.message);
    } else {
      toast.success("Payment successful! Thank you for your support.");
      
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
    }
  };

  return (
    <div className="max-w-7xl w-full bg-slate-900/70 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-3">
            Payment Details
          </label>
          <div className="bg-slate-800/50 rounded-lg p-4 border border-white/5">
            <PaymentElement />
          </div>
        </div>
        <button 
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          {loading ? "Processing..." : "Complete Payment"}
        </button>
      </form>
    </div>
  );
};

// Main Checkout Page
export default function Checkout() {
  const { tierId } = useParams();
  const [tier, setTier] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, access_token } = useSelector((state) => state.auth);
  useEffect(() => {
    async function fetchTier() {
      try {
        const res = await axios.get(`${API_URL}/payments/plans/${tierId}`);
        const data = res.data;
        setTier(data);

        // Create PaymentIntent on the backend
        // const intentRes = await axios.post(`${API_URL}/payments/create-payment-intent`, {
        //   priceId: data.stripe_price_id,
        // }, {
        //   headers: {
        //     'Content-Type': 'application/json',
        //     'Authorization': `Bearer ${access_token}`,
        //   }
        // });

        // console.log("intentRes:", intentRes);
        // const intentData = intentRes.data;
        // setClientSecret(intentData.clientSecret);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchTier();
  }, [tierId]);

  const [clientSecret, setClientSecret] = useState(null);

  useEffect(() => {
    if (!tier) return;

    if (!user) return;
    async function createCheckoutSession() {
      try {
        const response = await axios.post(`${API_URL}/payments/create-checkout-session`, {
          priceId: tier.stripe_price_id,
          user_id: user.id,
          id: tier.id,
          title: tier.title,
          description: tier.description,
          currency: tier.currency,
          features: tier.features,
          price: tier.price,
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`,
          }
        });

        setClientSecret(response.data.checkoutSessionClientSecret);
        window.location.href = response.data.url;
      } catch (err) {
        console.error(err);
      }
    }

    createCheckoutSession();
  }, [tier, access_token, user]);

  if (loading) return <div className="text-center mt-20">Loading...</div>;
  if (!tier) return <div className="text-center mt-20">Tier not found</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 p-8 flex flex-col items-center">
      {/* Tier Info */}
      <div className="bg-slate-900/70 backdrop-blur-xl border border-white/10 rounded-2xl p-8 w-full max-w-7xl text-center mb-10 shadow-xl">
        {tier.crown && <div className="text-yellow-400 text-4xl mb-2">👑</div>}
        <h1
          className={`text-3xl font-bold mb-2 ${
            tier.accent === "gold"
              ? "text-yellow-400"
              : "text-white"
          }`}
        >
          {tier.title}
        </h1>
        <p className="text-slate-300 mb-4">{tier.description}</p>
        <p className="text-2xl font-semibold mb-4">
          {(tier.price / 100).toFixed(2)} {tier.currency.toUpperCase()}{" "}
          {tier.note && `• ${tier.note}`}
        </p>
        <ul className="text-left text-slate-300 mb-4 space-y-1">
          {tier.features.map((f, i) => (
            <li key={i} className="flex items-center gap-2">
              <span className="text-blue-400">•</span>
              {f}
            </li>
          ))}
        </ul>
        <p className="text-sm text-slate-500">
          {tier.limit && `Limited to ${tier.limit} members`}
        </p>
      </div>

      {/* Stripe Payment Form */}
      {clientSecret && (
        <CheckoutProvider stripe={stripePromise} options={{clientSecret}}>

          <CheckoutForm clientSecret={clientSecret} />
        </CheckoutProvider>
      )}
    </div>
  );
}
