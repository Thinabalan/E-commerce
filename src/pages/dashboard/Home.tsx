import CategoriesSection from "./CategoriesSection";
import EcomCard from "../../components/card/EcomCard";

import { useEffect, useState } from "react";

import useProduct from "../../hooks/useProduct";
import type { Product } from "../../types/types";

export default function Home() {
  const { getProducts } = useProduct();
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        setError("Failed to load products");
      }
    };

    fetchProducts();
  }, []);

  // Derived data 
  const topPicks = products.filter(p => p.rating >= 4).slice(0, 10);
  const latestTrends = products.slice(-3);

  return (
    <div className="home-container">

      {/* CATEGORIES */}
      <CategoriesSection />

      {/* HERO SECTION */}
      <section className="hero-section bg-pink py-4 text-center mt-4">
        <div className="hero-text">
          <h1>Shop the Latest Trends</h1>
          <p>Best deals • Fast delivery • Quality you’ll love</p>
          <button
            className="hero-btn"
            onClick={() =>
              document
                .getElementById("latest-trends")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Shop Now
          </button>
        </div>
      </section>

      {/* TOP PICKS */}
      <section className="container mt-5">
        <h2 className="section-title mb-4">Top Picks for You</h2>

        {error && <p className="text-danger text-center mt-3">{error}</p>}

        <div className="row g-4">
          {topPicks.map((prod: Product) => (
            <div className="col-6 col-md-3" key={prod.id}>
              <EcomCard
                name={prod.productName}
                price={prod.price}
                image={prod.image}
              />
            </div>
          ))}
        </div>
      </section>

      {/* LATEST TRENDS */}
      <section className="container mt-5" id="latest-trends">
        <h2 className="section-title mb-4">Latest Trends</h2>

        <div className="row g-4">
          {latestTrends.map((prod: Product) => (
            <div className="col-6 col-md-3" key={prod.id}>
              <EcomCard
                name={prod.productName}
                price={prod.price}
                image={prod.image}
              />
            </div>
          ))}

          {latestTrends.length === 0 && !error && (
            <p className="text-center mt-3">No trending products.</p>
          )}
        </div>
      </section>

    </div>
  );
}
