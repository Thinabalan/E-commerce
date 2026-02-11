import { useEffect, useState } from "react";
import { Box, Container, Typography, Paper } from "@mui/material";
import Grid from "@mui/material/Grid";
import CategoriesSection from "./CategoriesSection";
import EcomCard from "../../components/newcomponents/EcomCard";
import EcomButton from "../../components/newcomponents/EcomButton";
import useProduct from "../../hooks/useProduct";
import type { Product } from "../../types/ProductTypes";

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

  const scrollToTrends = () => {
    document.getElementById("latest-trends")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Box sx={{ pt: { xs: 7, md: 1 }, pb: 8, minHeight: '100vh' }}>

      {/* CATEGORIES */}
      <CategoriesSection />

      {/* HERO SECTION */}
      <Box sx={{ mt: 2 }}>
        <Paper
          elevation={0}
          sx={{
            py: 3,
            textAlign: 'center',
            bgcolor: (theme) => theme.palette.mode === 'dark' ? 'grey.900' : '#ffbebe',
            color: (theme) => theme.palette.mode === 'dark' ? 'white' : 'black',
            borderRadius: 0,
          }}
        >
          <Container maxWidth="md">
            <Typography variant="h4" component="h1" fontWeight={700} gutterBottom sx={{ fontSize: '30px', mb: 1 }}>
              Shop the Latest Trends
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, fontSize: '15px' }}>
              Best deals • Fast delivery • Quality you’ll love
            </Typography>

            <EcomButton
              label="Shop Now"
              onClick={scrollToTrends}
              variant="contained"
              sx={{
                bgcolor: (theme) => theme.palette.mode === 'dark' ? 'black' : 'white',
                color: (theme) => theme.palette.mode === 'dark' ? 'white' : 'black',
                borderRadius: '8px',
                px: 3
              }}
            />
          </Container>
        </Paper>
      </Box>

      {/* TOP PICKS */}
      <Container sx={{ mt: 5 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom sx={{ mb: 4, fontSize: 'calc(1.3rem + .6vw)' }}>
          Top Picks for You
        </Typography>

        {error && <Typography color="error" align="center">{error}</Typography>}

        <Grid container spacing={4}>
          {topPicks.map((prod: Product) => (
            <Grid size={{ xs: 6, sm: 6, md: 3 }} key={prod.id}>
              <EcomCard product={prod} />
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* LATEST TRENDS */}
      <Container sx={{ mt: 5 }} id="latest-trends">
        <Typography variant="h4" fontWeight={700} gutterBottom sx={{ mb: 4, fontSize: 'calc(1.3rem + .6vw)' }}>
          Latest Trends
        </Typography>

        <Grid container spacing={4}>
          {latestTrends.map((prod: Product) => (
            <Grid size={{ xs: 6, sm: 6, md: 3 }} key={prod.id}>
              <EcomCard product={prod} />
            </Grid>
          ))}

          {latestTrends.length === 0 && !error && (
            <Grid size={{ xs: 12 }}>
              <Typography align="center" color="text.secondary">No trending products.</Typography>
            </Grid>
          )}
        </Grid>
      </Container>

    </Box>
  );
}
