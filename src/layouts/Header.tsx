import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useEffect, useState } from "react";
import AuthModal from "../pages/authentication/AuthModal";
import SellProductForm from "../pages/sellproductform/SellProductForm";
import { useToast } from "../context/ToastContext";
import * as bootstrap from "bootstrap";


interface User {
  name: string;
  email: string;
}

export default function Header() {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [showAuth, setShowAuth] = useState(false);

  const [showSellModal, setShowSellModal] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = () => {
      setDropdownOpen(false);
    };

    if (dropdownOpen) {
      window.addEventListener("click", handleClickOutside);
    }

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [dropdownOpen]);

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent immediate closing by the window listener
    setDropdownOpen(!dropdownOpen);
  };


  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem("user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };

    // initial load
    loadUser();

    // listen for login/logout changes
    window.addEventListener("auth-change", loadUser);

    return () => {
      window.removeEventListener("auth-change", loadUser);
    };
  }, []);

  const isLoggedIn = Boolean(user);
  const { showToast } = useToast();
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
    showToast({
      message: "Logged out Successfully",
      type: "error"
    });

  };

  const handleClose = () => {
    const offcanvasElement = document.getElementById("sideMenu");
    if (offcanvasElement) {
      const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasElement);
      bsOffcanvas?.hide();

      // Force cleanup of backdrop after transition
      setTimeout(() => {
        const backdrops = document.querySelectorAll('.offcanvas-backdrop');
        backdrops.forEach(backdrop => backdrop.remove());
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
      }, 150);
    }
  };

  return (
    <>
      <nav
        className={`navbar fixed-top shadow-sm py-3 ${isDark ? "header-dark" : "header-light"
          }`}
      >
        <div className="container-fluid d-flex align-items-center">

          {/* HAMBURGER — Main Offcanvas Toggle */}
          <button
            className="btn p-0 me-3"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#sideMenu"
          >
            <i className="fa-solid fa-bars fs-3"></i>
          </button>

          {/* LOGO */}
          <Link className="navbar-brand fw-bold" to="/">
            Sellee
          </Link>

          {/* DESKTOP SEARCH BAR */}
          <div className="d-none d-lg-flex ms-4 flex-grow-1 position-relative">
            <i className="fa-solid fa-magnifying-glass search-icon"></i>
            <input
              type="text"
              className="form-control search-bar"
              placeholder="Search for products..."
              aria-label="Search"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const value = (e.target as HTMLInputElement).value;
                  navigate(`/products?q=${value}`);
                }
              }}
            />
          </div>

          <div className="d-flex align-items-center ms-auto gap-3 gap-lg-4">

            {/* FAVOURITES (Desktop Only) */}
            <Link className="nav-link d-none d-lg-flex" to="/favourites">
              <i className="fa-solid fa-heart me-1 my-1"></i> Favourites
            </Link>

            {/* CART */}
            <Link className="nav-link d-flex align-items-center" to="/cart">
              <i className="fa-solid fa-cart-shopping me-1"></i> Cart
            </Link>

            {/* THEME SWITCHER (Desktop Only) */}
            <div className="nav-link d-none d-lg-flex align-items-center">
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={isDark}
                  onChange={toggleTheme}
                />
                <label className="form-check-label ms-1">
                  {isDark ? "Dark" : "Light"}
                </label>
              </div>
            </div>

            {/* PROFILE / LOGIN */}
            {!isLoggedIn ? (
              /* LOGIN BUTTON */
              <button
                className={`btn ${isDark ? "btn-dark-mode" : "btn-light-mode"}`}
                onClick={() => setShowAuth(true)}
              >
                <i className="fa-solid fa-user me-1"></i> Login
              </button>
            ) : (
              /* PROFILE DROPDOWN */
              <div className="dropdown">
                <button
                  className={`btn dropdown-toggle ${isDark ? "btn-dark-mode" : "btn-light-mode"} ${dropdownOpen ? "show" : ""
                    }`}
                  type="button"
                  id="profileDropdown"
                  onClick={toggleDropdown}
                  aria-expanded={dropdownOpen}
                >
                  <i className="fa-solid fa-user me-1"></i> {user?.name}
                </button>

                <ul
                  className={`dropdown-menu dropdown-menu-end ${dropdownOpen ? "show" : ""}`}
                  aria-labelledby="profileDropdown"
                  style={{
                    position: "absolute",
                    inset: "0px 0px auto auto",
                    margin: "0px",
                    transform: "translate(0px, 42px)",
                  }}
                >
                  <li>
                    <Link className="dropdown-item" to="/profile">
                      My Profile
                    </Link>
                  </li>
                  <li>
                    <button
                      className="dropdown-item text-danger"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}

          </div>
        </div>
      </nav>

      {/* MOBILE SEARCH BAR */}
      <div className="d-flex d-lg-none px-3 pb-2 mobile-search-wrapper">
        <div className="w-100 position-relative">
          <i className="fa-solid fa-magnifying-glass search-icon-mobile"></i>
          <input
            type="text"
            className="form-control mobile-search"
            placeholder="Search for products..."
            aria-label="Search"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const value = (e.target as HTMLInputElement).value;
                navigate(`/products?q=${value}`);
              }
            }}
          />
        </div>
      </div>

      {/* OFFCANVAS SIDEBAR */}
      <div
        className={`offcanvas offcanvas-start sidebar-small ${isDark ? "header-dark" : "header-light"
          }`}
        id="sideMenu"
        data-bs-backdrop="true"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title fw-bold">Menu</h5>
          <button className="btn-close" data-bs-dismiss="offcanvas"></button>
        </div>

        <div className="offcanvas-body">

          {/* HOME */}
          <Link
            className="sidebar-link"
            to="/"
            onClick={handleClose}
          >
            <i className="sidebar-icon fa-solid fa-house"></i>
            <span>Home</span>
          </Link>

          {/* ALL PRODUCTS */}
          <Link
            className="sidebar-link"
            to="/products"
            onClick={handleClose}
          >
            <i className="sidebar-icon fa-solid fa-box"></i>
            <span>All Products</span>
          </Link>

          {/* SELLER (ADD PRODUCTS) */}
          <div
            className="sidebar-link"
            style={{ cursor: "pointer" }}
            data-bs-dismiss="offcanvas"
            onClick={() => {
              setTimeout(() => setShowSellModal(true), 300);
            }}
          >
            <i className="sidebar-icon fa-solid fa-store"></i>
            <span>Become a Seller</span>
          </div>
          {/* Product Table */}
          <Link
            className="sidebar-link"
            to="/producttable"
            onClick={handleClose}
          >
            <i className="sidebar-icon fa-solid fa-table"></i>
            <span>Product Table</span>
          </Link>

          {/* FAVOURITES – mobile only */}
          <Link
            className="sidebar-link d-lg-none"
            to="/favourites"
            onClick={handleClose}
          >
            <i className="sidebar-icon fa-solid fa-heart "></i>
            <span>Favourites</span>
          </Link>

          {/* TOGGLE THEME – mobile only */}
          <div className="sidebar-link d-lg-none">
            <div
              className="form-check form-switch m-0 ms-1"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                className="form-check-input"
                type="checkbox"
                checked={isDark}
                onChange={() => {
                  toggleTheme();
                  handleClose();
                }}
              />
            </div>

            <span
              className="ms-1"
              onClick={() => {
                toggleTheme();
                handleClose();
              }}
            >
              {isDark ? "Dark" : "Light"}
            </span>
          </div>
        </div>
      </div>
      {showAuth && <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />}
      <SellProductForm open={showSellModal} onClose={() => setShowSellModal(false)} />
    </>
  );
}
