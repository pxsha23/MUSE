import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts } from '../api/productApi';
import { CATEGORY_NAV } from '../components/layout/CategoryNav';
import ProductGrid from '../components/product/ProductGrid';
import Dropdown from '../components/common/Dropdown';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
];

const Catalog = () => {
  const [params, setParams] = useSearchParams();
  const [data, setData] = useState({ items: [], total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);

  const category = params.get('category') || '';
  const search = params.get('search') || '';
  const sort = params.get('sort') || 'newest';
  const page = params.get('page') || '1';

  useEffect(() => {
    setLoading(true);
    fetchProducts({ category, search, sort, page })
      .then(setData)
      .finally(() => setLoading(false));
  }, [category, search, sort, page]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete('page');
    setParams(next);
  };

  const goToPage = (p) => {
    const next = new URLSearchParams(params);
    next.set('page', p);
    setParams(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="font-display text-3xl font-bold text-ink-900">
        {search ? `Results for "${search}"` : category ? CATEGORY_NAV.find((c) => c.value === category)?.label : 'Shop the Catalog'}
      </h1>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Dropdown
          value={category}
          onChange={(v) => updateParam('category', v)}
          className="w-48"
          options={[{ value: '', label: 'All Categories' }, ...CATEGORY_NAV]}
        />

        <Dropdown
          value={sort}
          onChange={(v) => updateParam('sort', v)}
          className="ml-auto w-56"
          options={SORT_OPTIONS}
        />
      </div>

      <p className="mt-4 text-xs text-ink-900/40">{data.total} item{data.total === 1 ? '' : 's'}</p>

      <div className="mt-4">
        <ProductGrid products={data.items} loading={loading} emptyMessage="No products match your filters yet." />
      </div>

      {data.pages > 1 && (
        <div className="mt-10 flex justify-center gap-2">
          {Array.from({ length: data.pages }).map((_, i) => (
            <button
              key={i}
              onClick={() => goToPage(i + 1)}
              className={`h-9 w-9 rounded-full text-sm font-medium transition ${
                Number(page) === i + 1
                  ? 'bg-ink-900 text-white'
                  : 'bg-white text-ink-900/60 hover:bg-blush-100'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Catalog;
