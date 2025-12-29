import { Routes, Route } from "react-router-dom";
import Footer from './layouts/Footer'
import Header from './layouts/Header'
import Home from "./pages/Home";
import ProductsPage from "./pages/ProductsPage";
import Signup from "./pages/authentication/Signup";
import Login from "./pages/authentication/Login";
import AddProductForm from "./pages/Rough/AddProductForm";

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
        </Routes>
      </div>
      <Footer />
    </div>
  )
}

export default App
