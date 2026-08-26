import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import AppRoutes from './routes/AppRoutes';

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Toaster position="top-center" toastOptions={{ style: { fontSize: '14px' } }} />
          <AppRoutes />
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
