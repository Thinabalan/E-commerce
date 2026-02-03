import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Checkbox,
  Radio,
  FormControlLabel,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  Paper,
  Stack
} from "@mui/material";
import Grid from "@mui/material/Grid"; // Using standard Grid
import EcomCard from "../../components/newcomponents/EcomCard";
import EcomAccordion from "../../components/newcomponents/EcomAccordion";
import EcomButton from "../../components/newcomponents/EcomButton";
import useProduct from "../../hooks/useProduct";
import type { Product, Category } from "../../types/ProductTypes";

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
      return [...new Set(availableSubcategories.flatMap(s => s.brands || []))];
    }
    const selectedSubObjects = availableSubcategories.filter(s => urlSubcategories.includes(s.name));
    return [...new Set(selectedSubObjects.flatMap(s => s.brands || []))];
  }, [availableSubcategories, urlSubcategories]);

  // FILTER LOGIC
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const isInCategory =
        urlCategory === "All" ||
        product.category === urlCategory ||
        availableSubcategories.some(s => s.name === product.category);

      if (!isInCategory) return false;

      if (urlSubcategories.length > 0 && !urlSubcategories.includes(product.category)) {
        return false;
      }

      if (urlBrands.length > 0) {
        const matchesBrand = urlBrands.some(brand => {
          const productBrand = product.brand?.toLowerCase();
          const targetBrand = brand.toLowerCase();
          return (productBrand === targetBrand) ||
            (product.productName.toLowerCase().includes(targetBrand));
        });
        if (!matchesBrand) return false;
      }

      if (searchQuery && !product.productName.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

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
    params.delete("sub");
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
    <Box sx={{ minHeight: '100vh', py: 4, pt: { xs: '90px', md: '20px' }, pb: 4 }}>
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          {/* FILTER SIDEBAR */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Paper
              elevation={2}
              sx={{
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid',
                borderColor: 'divider',
                position: { md: 'sticky' },
                top: { md: '140px' ,lg: '80px'},
                maxHeight: 'calc(100vh - 120px)', 
                overflowY: 'auto',
              }}
            >
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem' }}>Filters</Typography>
                {(urlCategory !== "All" || urlSubcategories.length > 0 || urlBrands.length > 0 || rating) && (
                  <EcomButton
                    label="Clear All"
                    size="small"
                    onClick={() => {
                      setSearchParams({});
                      setRating(null);
                    }}
                    sx={{ textTransform: 'none', fontWeight: 600 }}
                  />

                )}
              </Box>

              {/* MAIN CATEGORIES */}
              <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Categories
                </Typography>
                <List disablePadding>
                  <ListItemButton
                    dense
                    selected={urlCategory === "All"}
                    onClick={() => handleCategoryChange("All")}
                    sx={{ borderRadius: '8px', mb: 0.5 }}
                  >
                    <ListItemText
                      primary="All Products"
                      slotProps={{
                        primary: {
                          fontWeight: urlCategory === "All" ? 700 : 500,
                          color: urlCategory === "All" ? 'primary.main' : 'text.primary'
                        }
                      }}
                    />
                  </ListItemButton>
                  {categories.filter(c => !c.parentId && c.name !== "Offers").map((cat) => (
                    <ListItemButton
                      key={cat.id}
                      dense
                      selected={urlCategory === cat.name}
                      onClick={() => handleCategoryChange(cat.name)}
                      sx={{ borderRadius: '8px', mb: 0.5 }}
                    >
                      <ListItemText
                        primary={cat.name}
                        slotProps={{
                          primary: {
                            fontWeight: urlCategory === cat.name ? 700 : 500,
                            color: urlCategory === cat.name ? 'primary.main' : 'text.primary'
                          }
                        }}
                      />
                    </ListItemButton>
                  ))}
                </List>
              </Box>

              {/* SUB-CATEGORIES */}
              {availableSubcategories.length > 0 && (
                <EcomAccordion
                  title="Subcategories"
                  isOpen={openFilter === "Subcategory"}
                  onToggle={() => setOpenFilter(openFilter === "Subcategory" ? null : "Subcategory")}
                >
                  <Stack spacing={0.5}>
                    {availableSubcategories.map((sub) => (
                      <FormControlLabel
                        key={sub.id}
                        control={
                          <Checkbox
                            size="small"
                            checked={urlSubcategories.includes(sub.name)}
                            onChange={() => handleFilterToggle("sub", sub.name)}
                          />
                        }
                        label={<Typography sx={{ fontSize: '0.9rem' }}>{sub.name}</Typography>}
                      />
                    ))}
                  </Stack>
                </EcomAccordion>
              )}

              {/* BRANDS */}
              {availableBrands.length > 0 && (
                <EcomAccordion
                  title="Brands"
                  isOpen={openFilter === "Brand"}
                  onToggle={() => setOpenFilter(openFilter === "Brand" ? null : "Brand")}
                >
                  <Stack spacing={0.5}>
                    {availableBrands.map((brand) => (
                      <FormControlLabel
                        key={brand}
                        control={
                          <Checkbox
                            size="small"
                            checked={urlBrands.includes(brand)}
                            onChange={() => handleFilterToggle("brand", brand)}
                          />
                        }
                        label={<Typography sx={{ fontSize: '0.9rem' }}>{brand}</Typography>}
                      />
                    ))}
                  </Stack>
                </EcomAccordion>
              )}

              {/* RATING FILTER */}
              <EcomAccordion
                title="Rating"
                isOpen={openFilter === "Rating"}
                onToggle={() => setOpenFilter(openFilter === "Rating" ? null : "Rating")}
              >
                <Stack spacing={0.5}>
                  {[4, 3, 2].map((r) => (
                    <FormControlLabel
                      key={r}
                      control={
                        <Radio
                          size="small"
                          checked={rating === r}
                          onChange={() => setRating(r)}
                        />
                      }
                      label={<Typography sx={{ fontSize: '0.9rem' }}>{r}★ & above</Typography>}
                    />
                  ))}
                </Stack>
              </EcomAccordion>
            </Paper>
          </Grid>

          {/* PRODUCTS GRID */}
          <Grid size={{ xs: 12, md: 9 }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                {urlCategory === "All" ? "All Products" : urlCategory}
                {urlSubcategories.length > 0 && (
                  <Typography component="span" variant="h5" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                    {` > ${urlSubcategories.join(", ")}`}
                  </Typography>
                )}
              </Typography>
              <Divider />
            </Box>

            {error && (
              <Box sx={{ py: 4, textAlign: 'center' }}>
                <Typography color="error">{error}</Typography>
              </Box>
            )}

            <Grid container spacing={3}>
              {filteredProducts.map((prod) => (
                <Grid size={{ xs: 6, sm: 6, md: 4 }} key={prod.id}>
                  <EcomCard
                    name={prod.productName}
                    price={prod.price}
                    image={prod.image}
                  />
                </Grid>
              ))}
            </Grid>

            {filteredProducts.length === 0 && !error && (
              <Box sx={{ py: 10, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">No products found.</Typography>
                <Typography variant="body2" color="text.secondary">Try adjusting your filters or search query.</Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

