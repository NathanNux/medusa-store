'use client';

import { useState } from "react";
import { subscribeToRestock } from "@lib/data/products";

type RestockFormProps = {
  variant: { id: string; title?: string }
  product: { title?: string }
}

const RestockForm: React.FC<RestockFormProps> = ({ variant, product }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  if (!variant) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setToast(null);

    try {
      await subscribeToRestock({
        variant_id: variant.id,
        email,
      });
      setToast({ type: "success", message: "Subscribed! You'll be notified when it's back in stock." });
      setEmail("");
    } catch (err) {
      setToast({ type: "error", message: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="restock-form">
      <form onSubmit={handleSubmit}>
        <label>
          Get notified when <strong>{variant.title || product.title}</strong> is back in stock:
        </label>
        <input
          type="email"
          required
          placeholder="Your email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          disabled={loading}
        />
        <button type="submit" disabled={loading || !email}>
          {loading ? "Subscribing..." : "Notify Me"}
        </button>
      </form>
      {toast && (
        <div className={`toast toast--${toast.type}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default RestockForm;