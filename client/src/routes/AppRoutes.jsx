import { Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { ProtectedRoute, RoleRoute } from '../components/common/ProtectedRoute';

import Home from '../pages/Home';
import Catalog from '../pages/Catalog';
import ProductDetail from '../pages/ProductDetail';
import SellerStorefront from '../pages/SellerStorefront';
import Login from '../pages/Login';
import Register from '../pages/Register';
import VerifyEmail from '../pages/VerifyEmail';
import Account from '../pages/Account';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
import BuyerOrders from '../pages/BuyerOrders';
import OrderDetail from '../pages/OrderDetail';
import Studio from '../pages/Studio';
import NotFound from '../pages/NotFound';

import DashboardLayout from '../pages/seller/DashboardLayout';
import SellerProducts from '../pages/seller/Products';
import SellerProductEdit from '../pages/seller/ProductEdit';
import SellerOrders from '../pages/seller/Orders';
import SellerStories from '../pages/seller/Stories';
import SellerProfile from '../pages/seller/Profile';

const AppRoutes = () => (
  <Routes>
    <Route element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="catalog" element={<Catalog />} />
      <Route path="product/:id" element={<ProductDetail />} />
      <Route path="store/:slug" element={<SellerStorefront />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route path="verify-email" element={<VerifyEmail />} />
        <Route path="account" element={<Account />} />
      </Route>

      <Route element={<RoleRoute allow={['buyer']} />}>
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="orders" element={<BuyerOrders />} />
        <Route path="orders/:id" element={<OrderDetail />} />
        <Route path="studio" element={<Studio />} />
      </Route>

      <Route element={<RoleRoute allow={['seller']} />}>
        <Route path="seller" element={<DashboardLayout />}>
          <Route index element={<SellerProducts />} />
          <Route path="products" element={<SellerProducts />} />
          <Route path="products/new" element={<SellerProductEdit />} />
          <Route path="products/:id/edit" element={<SellerProductEdit />} />
          <Route path="orders" element={<SellerOrders />} />
          <Route path="stories" element={<SellerStories />} />
          <Route path="profile" element={<SellerProfile />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
);

export default AppRoutes;
