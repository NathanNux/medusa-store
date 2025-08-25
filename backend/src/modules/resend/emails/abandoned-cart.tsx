
export function abandonedCartEmail({ customer, cart_id, items }: any) {
  const storefrontUrl = process.env.MEDUSA_STOREFRONT_URL || "https://yourstore.com";
  return (
    <div>
      <h1>Dobrý den, {customer?.first_name}, váš košík čeká! 🛍️</h1>
      <p>Nechali jste si v košíku skvělé položky. Dokončete svůj nákup, než budou pryč!</p>
      {items?.map((item: any, idx: number) => (
        <div key={idx} style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
          {item.thumbnail && (
            <img src={item.thumbnail} alt={item.product_title} style={{ width: 80, marginRight: 16, borderRadius: 5 }} />
          )}
          <div>
            <strong>{item.product_title}</strong>
            <div>Množství: <strong>{item.quantity}</strong></div>
            <div>Cena: <strong>{item.unit_price / 100} Kč</strong></div>
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
        Vrátit se do košíku a k pokladně
      </a>
      <p style={{ fontSize: 12, color: "#888", marginTop: 20 }}>
        Potřebujete pomoc? <a href="mailto:support@yourstore.com">Kontaktujte nás</a>
      </p>
    </div>
  );
}

// WIP: Add here valid email for support