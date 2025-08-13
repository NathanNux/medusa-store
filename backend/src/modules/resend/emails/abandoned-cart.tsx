
export function abandonedCartEmail({ customer, cart_id, items }: any) {
  const storefrontUrl = process.env.MEDUSA_STOREFRONT_URL || "https://yourstore.com";
  return (
    <div>
      <h1>Hi {customer?.first_name}, your cart is waiting! 🛍️</h1>
      <p>You left some great items in your cart. Complete your purchase before they're gone!</p>
      {items?.map((item: any, idx: number) => (
        <div key={idx} style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
          {item.thumbnail && (
            <img src={item.thumbnail} alt={item.product_title} style={{ width: 80, marginRight: 16, borderRadius: 5 }} />
          )}
          <div>
            <strong>{item.product_title}</strong>
            <div>Quantity: <strong>{item.quantity}</strong></div>
            <div>Price: <strong>{item.unit_price / 100} Kč</strong></div>
          </div>
        </div>
      ))}
      <a
        href={`${storefrontUrl}/cart/recover/${cart_id}`}
        style={{
          display: "inline-block",
          background: "#007bff",
          color: "#fff",
          padding: "12px 20px",
          borderRadius: 5,
          textDecoration: "none",
          marginTop: 20,
        }}
      >
        Return to Cart & Checkout
      </a>
      <p style={{ fontSize: 12, color: "#888", marginTop: 20 }}>
        Need help? <a href="mailto:support@yourstore.com">Contact us</a>
      </p>
    </div>
  );
}