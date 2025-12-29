import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

import useProduct from "../hooks/useProduct";
import type { Category } from "../types/types";

export default function CategoriesSection() {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const { getCategories } = useProduct();

  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        setError("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="category-wrapper">
      <div className={`category-card ${isDark ? "cat-wrapper-dark" : ""}`}>
        <div className="d-flex gap-3 overflow-auto pt-1 ps-3">
          {categories.filter(c => c.parentId).map(sub => {
            const parentName = categories.find(p => p.id === sub.parentId)?.name;

            if (!parentName) return null;

            return (
              <div
                key={sub.id}
                className={`category-box ${isDark ? "cat-dark" : "cat-light"}`}
                onClick={() =>
                  navigate(`/products?category=${parentName}&sub=${sub.name}`)
                }
                style={{ cursor: "pointer" }}
              >
                <i className={`fa-solid ${sub.icon || "fa-tag"} mx-1 `}></i>
                <span>{sub.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
