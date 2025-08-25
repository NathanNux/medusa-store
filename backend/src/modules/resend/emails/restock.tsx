export function variantRestockEmail({ variant }: { variant: any }) {
  const images = variant.product_variant?.images || [];
  const storefrontUrl = process.env.MEDUSA_STOREFRONT_URL || "https://yourstore.com";
  return (
    <div>
      <h1>Dobré zprávy!</h1>
      <p>
        Produkt <strong>{variant.product_variant?.title}</strong> je opět skladem.
      </p>
      <p>{variant.product_variant?.description}</p>
      {images.length > 0 && (
        <img src={images[0].url} alt={variant.product_variant?.title} style={{ maxWidth: "300px" }} />
      )}
      <p>
        <a href={`${storefrontUrl}/products/${variant.product_variant?.id}`}>Zobrazit produkt</a>
      </p>
    </div>
  );
}