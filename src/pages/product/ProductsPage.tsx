import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import EcomCard from "../../components/card/EcomCard";
import useProduct from "../../hooks/useProduct";
import type { Product, Category } from "../../types/types";
import "./ProductsPage.css";
import EcomFilter from "../../components/filter/EcomFilter";

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { getProducts, getCategories } = useProduct();

  // DATA STATE
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);

  // UI STATE
  const [rating, setRating] = useState<number | null>(null);
  const [openFilter, setOpenFilter] = useState<string | null>("Category");

  // URL PARAMS
  const urlCategory = searchParams.get("category") || "All";
  const urlSubcategories = searchParams.get("sub") ? searchParams.get("sub")!.split(",") : [];
  const urlBrands = searchParams.get("brand") ? searchParams.get("brand")!.split(",") : [];
  const searchQuery = searchParams.get("q") || "";

  // FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodData, catData] = await Promise.all([
          getProducts(),
          getCategories()
        ]);
        setProducts(prodData);
        setCategories(catData);
      } catch (err) {
        setError("Failed to load data");
      }
    };
    fetchData();
  }, []);

  // HIERARCHY HELPERS
  const activeMainCategory = useMemo(() => {
    return categories.find(c => c.name === urlCategory && !c.parentId) || null;
  }, [categories, urlCategory]);

  const availableSubcategories = useMemo(() => {
    if (urlCategory === "All") return [];
    const parentId = activeMainCategory?.id;
    return categories.filter(c => c.parentId === String(parentId));
  }, [categories, urlCategory, activeMainCategory]);

  const availableBrands = useMemo(() => {
    if (urlSubcategories.length === 0) {
      // If no subcategories selected, show all brands for the main category's subcategories
      return [
        ...new Set(availableSubcategories.flatMap(s => s.brands || []))
      ];
    }
    // Show brands for selected subcategories
    const selectedSubObjects = availableSubcategories.filter(s => urlSubcategories.includes(s.name));
    return [
      ...new Set(selectedSubObjects.flatMap(s => s.brands || []))
    ];
  }, [availableSubcategories, urlSubcategories]);

  // FILTER LOGIC
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // 1. Category Filter (Matches either main category or its subcategories)
      const isInCategory =
        urlCategory === "All" ||
        product.category === urlCategory ||
        availableSubcategories.some(s => s.name === product.category);

      if (!isInCategory) return false;

      // 2. Subcategory Filter (Multi-select)
      if (urlSubcategories.length > 0 && !urlSubcategories.includes(product.category)) {
        // if main category is "Electronics" and sub "Mobile" is picked, 
        // product.category will be "Mobile".
        return false;
      }

      // 3. Brand Filter (Matches explicitly by brand OR falls back to name search)
      if (urlBrands.length > 0) {
        const matchesBrand = urlBrands.some(brand => {
          const productBrand = product.brand?.toLowerCase();
          const targetBrand = brand.toLowerCase();

          return (productBrand === targetBrand) ||
            (product.productName.toLowerCase().includes(targetBrand));
        });

        if (!matchesBrand) return false;
      }

      // 4. Search Query
      if (searchQuery && !product.productName.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // 5. Rating
      if (rating && product.rating < rating) {
        return false;
      }

      return true;
    });
  }, [products, urlCategory, urlSubcategories, urlBrands, searchQuery, rating, availableSubcategories]);

  // HANDLERS
  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams);
    if (category === "All") {
      params.delete("category");
    } else {
      params.set("category", category);
    }
    params.delete("sub"); // Reset tiered filters
    params.delete("brand");
    setSearchParams(params);
  };

  const handleFilterToggle = (key: "sub" | "brand", value: string) => {
    const params = new URLSearchParams(searchParams);
    const current = params.get(key) ? params.get(key)!.split(",") : [];

    let updated;
    if (current.includes(value)) {
      updated = current.filter(v => v !== value);
    } else {
      updated = [...current, value];
    }

    if (updated.length > 0) {
      params.set(key, updated.join(","));
    } else {
      params.delete(key);
    }

    setSearchParams(params);
  };

  return (
    <div className="container-fluid bg-light min-vh-100 pt-3 pb-5">
      <div className="row">
        {/* FILTER SIDEBAR */}
        <div className="col-md-3 border-end border-2">
          <div className="bg-white shadow-sm rounded-1 overflow-hidden">
            <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fs-5 fw-bold">Filters</h5>
              {(urlCategory !== "All" || urlSubcategories.length > 0 || urlBrands.length > 0 || rating) && (
                <button
                  className="btn btn-sm text-primary p-0 border-0"
                  onClick={() => setSearchParams({})}
                >
                  Clear All
                </button>
              )}
            </div>

            {/* MAIN CATEGORIES */}
            <div className="p-3 border-bottom">
              <h6 className="filter-title-text mb-3">Categories</h6>
              <div
                className={`py-1 cursor-pointer ${urlCategory === "All" ? "text-primary fw-bold" : "text-muted"}`}
                onClick={() => handleCategoryChange("All")}
              >
                All Products
              </div>
              {categories.filter(c => !c.parentId && c.name !== "Offers").map((cat) => (
                <div
                  key={cat.id}
                  className={`py-1 cursor-pointer ${urlCategory === cat.name ? "text-primary fw-bold" : "text-muted"}`}
                  onClick={() => handleCategoryChange(cat.name)}
                >
                  {cat.name}
                </div>
              ))}
            </div>

            {/* SUB-CATEGORIES */}
            {availableSubcategories.length > 0 && (
              <EcomFilter
                title="Subcategories"
                isOpen={openFilter === "Subcategory"}
                onToggle={() =>
                  setOpenFilter(openFilter === "Subcategory" ? null : "Subcategory")
                }
              >
                {availableSubcategories.map((sub) => (
                  <div key={sub.id} className="d-flex align-items-center mb-2">
                    <input
                      type="checkbox"
                      id={`sub-${sub.id}`}
                      checked={urlSubcategories.includes(sub.name)}
                      onChange={() => handleFilterToggle("sub", sub.name)}
                      className="form-check-input mt-0 cursor-pointer"
                    />
                    <label
                      htmlFor={`sub-${sub.id}`}
                      className="ms-2 filter-label"
                    >
                      {sub.name}
                    </label>
                  </div>
                ))}
              </EcomFilter>
            )}

            {/* BRANDS */}
            {availableBrands.length > 0 && (
              <EcomFilter
                title="Brands"
                isOpen={openFilter === "Brand"}
                onToggle={() =>
                  setOpenFilter(openFilter === "Brand" ? null : "Brand")
                }
              >
                {availableBrands.map((brand) => (
                  <div key={brand} className="d-flex align-items-center mb-2">
                    <input
                      type="checkbox"
                      id={`brand-${brand}`}
                      checked={urlBrands.includes(brand)}
                      onChange={() => handleFilterToggle("brand", brand)}
                      className="form-check-input mt-0 cursor-pointer"
                    />
                    <label
                      htmlFor={`brand-${brand}`}
                      className="ms-2 filter-label"
                    >
                      {brand}
                    </label>
                  </div>
                ))}
              </EcomFilter>
            )}

            {/* RATING FILTER */}
            <EcomFilter
              title="Rating"
              isOpen={openFilter === "Rating"}
              onToggle={() =>
                setOpenFilter(openFilter === "Rating" ? null : "Rating")
              }
            >
              {[4, 3, 2].map((r) => (
                <div key={r} className="d-flex align-items-center mb-2">
                  <input
                    type="radio"
                    id={`rating-${r}`}
                    checked={rating === r}
                    onChange={() => setRating(r)}
                    className="form-check-input mt-0 cursor-pointer"
                  />
                  <label
                    htmlFor={`rating-${r}`}
                    className="ms-2 filter-label"
                  >
                    {r}★ & above
                  </label>
                </div>
              ))}

              {rating && (
                <button
                  className="clear-btn mt-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    setRating(null);
                  }}
                >
                  Clear Rating
                </button>
              )}
            </EcomFilter>
          </div>
        </div>

        {/* PRODUCTS GRID */}
        <div className="col-md-9">
          <h4 className="mb-3">
            {urlCategory === "All" ? "All Products" : urlCategory}
            {urlSubcategories.length > 0 && ` > ${urlSubcategories.join(", ")}`}
          </h4>

          {error && <p className="text-danger text-center">{error}</p>}

          <div className="row g-4">
            {filteredProducts.map((prod) => (
              <div className="col-6 col-md-4" key={prod.id}>
                <EcomCard
                  name={prod.productName}
                  price={prod.price}
                  image={prod.image}
                />
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && !error && (
            <p className="text-center mt-4">No products found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

