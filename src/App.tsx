import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { Box } from "@mui/material";
import Footer from './layouts/Footer'
import Header from './layouts/Header'
import Sidebar from "./layouts/Sidebar";
import Home from "./pages/dashboard/Home";
import ProductsPage from "./pages/product/ProductsPage";
import SellProductTable from "./pages/sellproductform/SellProductTable";
import RegistrationForm from "./pages/registrationform/RegistrationForm";
import RegistrationList from "./pages/registrationform/RegistrationList";
import SellProductForm from "./pages/sellproductform/SellProductForm";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import { useSnackbar } from "./context/SnackbarContext";


function App() {

  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showSellModal, setShowSellModal] = useState(false);
  const { showSnackbar } = useSnackbar();
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleSellClick = () => {
    if (isAuthenticated) {
      setShowSellModal(true);
    } else {
      navigate(location.pathname, { state: { showAuth: true } });
      showSnackbar("Login to access Become a seller", "error")
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header onMenuClick={toggleSidebar} />
      <Box sx={{ display: 'flex', flex: 1 }}>
        <Sidebar
          open={isSidebarOpen}
          onSellClick={handleSellClick}
          onClose={() => setIsSidebarOpen(false)}
        />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 0,
            marginTop: { xs: '60px', md: '120px', lg: '60px' },
            marginLeft: { xs: 0, lg: '0px' },
            width: { xs: '100%', lg: 'calc(100% - 65px)' },
            minHeight: 'calc(100vh - 80px)',
          }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route
              path="/producttable"
              element={
                <ProtectedRoute allowedRoles={['seller', 'admin']}>
                  <SellProductTable />
                </ProtectedRoute>
              }
            />
            <Route
              path="/form/:id?"
              element={
                <ProtectedRoute allowedRoles={['seller', 'admin']}>
                  <RegistrationForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/registrations"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <RegistrationList />
                </ProtectedRoute>
              }
            />
          </Routes>
          <Footer />
        </Box>
      </Box>

      <SellProductForm open={showSellModal} onClose={() => setShowSellModal(false)} />
    </Box>
  )
}

export default App
