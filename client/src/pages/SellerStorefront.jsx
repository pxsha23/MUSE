import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiInstagram, FiFacebook } from 'react-icons/fi';
import { fetchStoreBySlug } from '../api/storeApi';
import { fetchProducts } from '../api/productApi';
import ProductGrid from '../components/product/ProductGrid';
import Spinner from '../components/common/Spinner';

const SellerStorefront = () => {
  const { slug } = useParams();
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchStoreBySlug(slug), fetchProducts({ seller: slug, limit: 24 })])
      .then(([storeData, productData]) => {
        setStore(storeData.store);
        setProducts(productData.items);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner />
      </div>
    );
  }

  if (notFound || !store) {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <h1 className="font-display text-2xl font-bold">Store not found</h1>
        <Link to="/catalog" className="mt-4 inline-block text-rose-600">Back to catalog</Link>
      </div>
    );
  }

  return (
    <div>
      <div
        className="h-48 w-full bg-blush-200 bg-cover bg-center sm:h-64"
        style={store.bannerUrl ? { backgroundImage: `url(${store.bannerUrl})` } : undefined}
      />

      <div className="mx-auto -mt-12 max-w-6xl px-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-end">
          <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-cream-50 bg-blush-100 shadow-md">
            {store.logoUrl ? (
              <img src={store.logoUrl} alt={store.storeName} className="h-full w-full object-cover" />
            ) : (
              <span className="flex h-full w-full items-center justify-center font-display text-2xl text-rose-600">
                {store.storeName[0]}
              </span>
            )}
          </div>
          <div className="text-center sm:text-left">
            <h1 className="font-display text-2xl font-bold text-ink-900">{store.storeName}</h1>
            {store.bio && <p className="mt-1 max-w-xl text-sm text-ink-900/60">{store.bio}</p>}
          </div>
          <div className="flex gap-3 sm:ml-auto">
            {store.socialLinks?.instagram && (
              <a href={store.socialLinks.instagram} target="_blank" rel="noreferrer" className="text-ink-900/50 hover:text-rose-600">
                <FiInstagram size={18} />
              </a>
            )}
            {store.socialLinks?.facebook && (
              <a href={store.socialLinks.facebook} target="_blank" rel="noreferrer" className="text-ink-900/50 hover:text-rose-600">
                <FiFacebook size={18} />
              </a>
            )}
          </div>
        </div>

        <div className="mt-10">
          <h2 className="font-display text-xl font-bold text-ink-900">{products.length} Products</h2>
          <div className="mt-5">
            <ProductGrid products={products} emptyMessage="This shop hasn't published any products yet." />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerStorefront;
