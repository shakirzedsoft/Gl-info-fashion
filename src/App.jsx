import { Stack } from "@mui/material";
import Products from "./components/product/ProductsListPage";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./components/auth/Login/LoginPage";
import SignUpPage from "./components/auth/SignUp/SignUpPage";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import ProductSinglePage from "./components/product/ProductSinglePage";
import PublicRoute from "./components/auth/PublicRouter";
import ProfileSection from "./components/profile/ProfilePage";
import PrivateRoute from "./components/auth/PrivateRoute";
import WishlistPage from "./components/wishlist/WishlistPage";
import CartPage from "./components/cart/CartPage";

function App() {
  return (

    <Stack>
      <BrowserRouter>
        <Routes>

          <Route
            path="/wishlist"
            element={
              <PrivateRoute>
                <>
                  <Header />
                  <WishlistPage />
                  <Footer />
                </>
              </PrivateRoute>
            }
          />

          <Route
            path="/cart"
            element={
              <PrivateRoute>
                <>
                  <Header />
                  <CartPage />
                  <Footer />
                </>
              </PrivateRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <>
                  <Header />
                  <ProfileSection />
                  <Footer />
                </>
              </PrivateRoute>
            }
          />
          <Route
            path="/products"
            element={
              <PrivateRoute>
                <>
                  <Header />
                  <Products />
                  <Footer />
                </>
              </PrivateRoute>
            }
          />
          <Route
            path="/product/:id"
            element={
              <PrivateRoute>
                <>
                  <Header />
                  <ProductSinglePage />
                  <Footer />
                </>
              </PrivateRoute>
            }
          />

          {/* Public Routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/sign-up"
            element={
              <PublicRoute>
                <SignUpPage />
              </PublicRoute>
            }
          />

          {/* catch-all redirect */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </Stack>

  );
}

export default App;




