import { Routes, Route } from "react-router-dom";
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

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showSellModal, setShowSellModal] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header onMenuClick={toggleSidebar} />
      <Box sx={{ display: 'flex', flex: 1 }}>
        <Sidebar
          open={isSidebarOpen}
          onSellClick={() => setShowSellModal(true)}
          onClose={() => setIsSidebarOpen(false)}
        />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 0,
            marginTop: '70px',
            marginLeft: { xs: 0, md: '0px' },
            width: { xs: '100%', md: 'calc(100% - 65px)' },
            minHeight: 'calc(100vh - 80px)',
          }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/producttable" element={<SellProductTable />} />
            <Route path="/form/:id?" element={<RegistrationForm />} />
            <Route path="/registrations" element={<RegistrationList />} />
          </Routes>
          <Footer />
        </Box>
      </Box>
      
      <SellProductForm open={showSellModal} onClose={() => setShowSellModal(false)} />
    </Box>
  )
}

export default App
