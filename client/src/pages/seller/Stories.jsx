import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { fetchMyStories, createStory, deleteStory } from '../../api/storyApi';
import { fetchMyProducts } from '../../api/productApi';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../../components/common/Spinner';

const Stories = () => {
  const { user } = useAuth();
  const [stories, setStories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [media, setMedia] = useState(null);
  const [caption, setCaption] = useState('');
  const [linkedProduct, setLinkedProduct] = useState('');
  const [posting, setPosting] = useState(false);

  const load = () =>
    Promise.all([fetchMyStories(), fetchMyProducts()]).then(([s, p]) => {
      setStories(s.items);
      setProducts(p.items.filter((x) => x.isPublished));
    });

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

  const handlePost = async (e) => {
    e.preventDefault();
    if (!user.emailVerified) return toast.error('Verify your email before posting a story');
    if (!media) return toast.error('Choose an image or video to post');

    const data = new FormData();
    data.append('media', media);
    if (caption) data.append('caption', caption);
    if (linkedProduct) data.append('linkedProduct', linkedProduct);

    setPosting(true);
    try {
      await createStory(data);
      toast.success('Story posted');
      setMedia(null);
      setCaption('');
      setLinkedProduct('');
      e.target.reset();
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not post story');
    } finally {
      setPosting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Remove this story?')) return;
    try {
      await deleteStory(id);
      setStories((s) => s.filter((x) => x._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not remove story');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-ink-900">Stories</h2>
      <p className="mt-1 text-sm text-ink-900/50">
        Post a photo or short video to the "Shop the Trend" circles on the homepage.
      </p>

      <form onSubmit={handlePost} className="mt-6 max-w-md space-y-3 rounded-2xl border border-blush-200 bg-white p-5">
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime"
          onChange={(e) => setMedia(e.target.files[0])}
          className="w-full text-sm"
        />
        <input
          placeholder="Caption (optional)"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full rounded-xl border border-blush-200 px-4 py-2 text-sm outline-none focus:border-rose-400"
        />
        <select
          value={linkedProduct}
          onChange={(e) => setLinkedProduct(e.target.value)}
          className="w-full rounded-xl border border-blush-200 px-4 py-2 text-sm outline-none focus:border-rose-400"
        >
          <option value="">No linked product</option>
          {products.map((p) => (
            <option key={p._id} value={p._id}>{p.title}</option>
          ))}
        </select>
        <button
          type="submit"
          disabled={posting}
          className="w-full rounded-full bg-rose-600 py-2.5 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
        >
          {posting ? 'Posting…' : 'Post Story'}
        </button>
      </form>

      {stories.length === 0 ? (
        <p className="mt-10 text-sm text-ink-900/50">No stories yet.</p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {stories.map((s) => (
            <div key={s._id} className="group relative aspect-9/16 overflow-hidden rounded-xl bg-blush-100">
              {s.mediaType === 'video' ? (
                <video src={s.mediaUrl} className="h-full w-full object-cover" muted />
              ) : (
                <img src={s.mediaUrl} alt="" className="h-full w-full object-cover" />
              )}
              <button
                onClick={() => handleDelete(s._id)}
                className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-sm text-white opacity-0 transition group-hover:opacity-100"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Stories;
