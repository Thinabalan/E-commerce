import { useEffect, useState } from "react";
import { Container, Grid, Typography, Box, CircularProgress } from "@mui/material";
import useProduct from "../../hooks/useProduct";
import StockStatusChart from "./StockStatusChart";
import type { Product } from "../../types/ProductTypes";
import CategoryPieChart from "./CategoryPieChart";
import StockBarChart from "./StockBarChart";
import BrandBarChart from "./BrandBarChart";
import ProductLineChart from "./ProductLineChart";

const ProductDashboard = () => {
    const { getProducts } = useProduct();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            const data = await getProducts();
            setProducts(data);
            setLoading(false);
        };
        fetchProducts();
    }, [getProducts]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress size={60} thickness={4} sx={{ color: '#1a1a1a' }} />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 800, color: '#1a1a1a', mb: 1 }}>
                    Product Insights
                </Typography>
                <Typography variant="body1" color="textSecondary">
                    Visualize your product stock status at a glance.
                </Typography>
            </Box>

            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <CategoryPieChart products={products} />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <StockBarChart products={products} />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <StockStatusChart products={products} />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <BrandBarChart products={products} />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <ProductLineChart products={products} />
                </Grid>
            </Grid>
        </Container>
    );
};

export default ProductDashboard;
