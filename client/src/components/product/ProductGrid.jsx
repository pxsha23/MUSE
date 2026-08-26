import ProductCard from './ProductCard';

const Skeleton = () => (
  <div className="overflow-hidden rounded-2xl border border-blush-200 bg-white">
    <div className="aspect-[4/5] animate-pulse bg-blush-100" />
    <div className="space-y-2 p-3.5">
      <div className="h-2.5 w-1/3 animate-pulse rounded bg-blush-100" />
      <div className="h-3 w-2/3 animate-pulse rounded bg-blush-100" />
      <div className="h-3 w-1/4 animate-pulse rounded bg-blush-100" />
    </div>
  </div>
);

const ProductGrid = ({ products, loading, emptyMessage = 'No products found.' }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} />
        ))}
      </div>
    );
  }

  if (!products?.length) {
    return <p className="py-16 text-center text-sm text-ink-900/50">{emptyMessage}</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p._id} product={p} />
      ))}
    </div>
  );
};

export default ProductGrid;
