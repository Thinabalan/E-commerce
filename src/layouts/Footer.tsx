import { useTheme } from "../context/ThemeContext";

export default function Footer() {
  const { isDark } = useTheme();

  return (
    <footer
      className={`shadow-lg py-3 mt-5 ${
        isDark ? "header-dark" : "bg-white text-dark"
      }`}
    >
      <div className="container">
        <div className="row align-items-center text-center text-md-start">

          <div className="col-12 col-md-4 mb-3 mb-md-0">
            <h4 className="mb-1 fw-bold">Sellee</h4>
            <h5 className="mb-0 small">
              Your one-stop ecommerce destination
            </h5>
          </div>

          <div className="col-12 col-md-4 text-center mb-3 mb-md-0">
            <h6 className="fw-semibold me-5 ms-0 mb-1">Contact Us</h6>
            <p className="mb-0">Email: sellee@gmail.com</p>
            <p className="mb-0">Phone: +91 98765 43210</p>
          </div>

          <div className="col-12 col-md-4 text-center text-md-end">
            <div className="d-flex justify-content-center justify-content-md-end gap-4 mb-1">
              <a href="#" className="social-icon">
                <i className="fab fa-facebook fa-lg"></i>
              </a>
              <a href="#" className="social-icon">
                <i className="fab fa-instagram fa-lg"></i>
              </a>
              <a href="#" className="social-icon">
                <i className="fab fa-x-twitter fa-lg"></i>
              </a>
            </div>

            <p className="mb-0 small">
              © {new Date().getFullYear()} Sellee. All rights reserved.
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
}
