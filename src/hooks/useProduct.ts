import { useCallback, useState } from "react";
import { productService } from "../services/productService"
import type { Product, Category, CreateProduct } from "../types/ProductTypes";
import { useUI } from "../context/UIContext";
import { useErrorBoundary } from "react-error-boundary";
import { handleError } from "../components/error/HandleError";

export default function useProduct() {
  const { showSnackbar } = useUI();
  const { showBoundary } = useErrorBoundary();
  const [isLoading, setIsLoading] = useState(false);

  // Get all products
  const getProducts = useCallback(async (): Promise<Product[]> => {
    setIsLoading(true);
    try {
      return (await productService.getProducts()) || [];
    } catch (error: any) {
      handleError({
        error,
        showBoundary,
        showSnackbar,
        fallbackMessage: "Failed to fetch products",
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [showBoundary, showSnackbar]);

  // Get all categories
  const getCategories = useCallback(async (): Promise<Category[]> => {
    setIsLoading(true);
    try {
      return (await productService.getCategories()) || [];
    } catch (error: any) {
      handleError({
        error,
        showBoundary,
        showSnackbar,
        fallbackMessage: "Failed to fetch categories",
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [showBoundary, showSnackbar]);

  // Add product
  const addProduct = useCallback(async (productData: CreateProduct): Promise<Product | null> => {
    setIsLoading(true);
    try {
      return await productService.createProduct(productData);
    } catch (error: any) {
      handleError({
        error,
        showSnackbar,
        fallbackMessage: "Failed to add product",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [showSnackbar]);

  /* UPDATE */
  const updateProduct = useCallback(async (id: string | number, productData: Partial<Product>) => {
    setIsLoading(true);
    try {
      return await productService.updateProduct(id, productData);
    } catch (error: any) {
      handleError({
        error,
        showSnackbar,
        fallbackMessage: "Failed to update product",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [showSnackbar]);

  /* DELETE */
  const deleteProduct = useCallback(async (id: string | number) => {
    setIsLoading(true);
    try {
      await productService.deleteProduct(id);
      return true;
    } catch (error: any) {
      handleError({
        error,
        showSnackbar,
        fallbackMessage: "Failed to delete product",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [showSnackbar]);

  /* TOGGLE STATUS (Soft Delete / Reactivate) */
  const toggleProductStatus = useCallback(async (id: string | number, currentStatus: "active" | "inactive") => {
    setIsLoading(true);
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active";
      return await productService.updateProductStatus(id, newStatus);
    } catch (error: any) {
      handleError({
        error,
        showSnackbar,
        fallbackMessage: "Failed to toggle product status",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [showSnackbar]);

  return {
    getProducts,
    getCategories,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductStatus,
    isLoading,
  };
}
