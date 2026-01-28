import { Routes, Route } from "react-router-dom";
import Footer from './layouts/Footer'
import Header from './layouts/Header'
import Home from "./pages/dashboard/Home";
import ProductsPage from "./pages/product/ProductsPage";
import Signup from "./pages/authentication/Signup";
import Login from "./pages/authentication/Login";
import AddProductForm from "./pages/Rough/AddProductForm";
import SellProductTable from "./pages/sellproductform/SellProductTable";
import RegistrationForm from "./pages/registrationform/RegistrationForm";
import RegistrationList from "./pages/registrationform/RegistrationList";

function App() {

  return (
    <div>
      <Header />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/newproduct" element={<AddProductForm />} />
          <Route path="/producttable" element={<SellProductTable />} />
          <Route path="/form/:id?" element={<RegistrationForm />} />
          <Route path="/registrations" element={<RegistrationList />} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}

export default App
