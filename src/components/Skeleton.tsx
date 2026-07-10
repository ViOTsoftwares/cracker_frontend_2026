export function ProductCardSkeleton() {
  return (
    <div className="skeleton-card">
      <div className="skeleton skeleton-img" />
      <div className="skeleton-body">
        <div className="skeleton skeleton-line w-3-4" />
        <div className="skeleton skeleton-line w-full" />
        <div className="skeleton skeleton-line w-1-2" />
        <div className="skeleton skeleton-line w-3-4" />
        <div className="skeleton skeleton-line" style={{ height: 34, borderRadius: 6, marginTop: 4 }} />
      </div>
    </div>
  );
}

export function ProductsGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="products-grid">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function BannerSkeleton() {
  return <div className="skeleton" style={{ height: 360, borderRadius: 0, width: "100%" }} />;
}
