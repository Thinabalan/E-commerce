import { useEffect, useState } from "react";
import { Container, Grid, Typography, Box, CircularProgress } from "@mui/material";
import { Inventory, Category, Storage, CheckCircle } from "@mui/icons-material";
import useProduct from "../../hooks/useProduct";
import StockStatusChart from "./StockPieChart";
import type { Product } from "../../types/ProductTypes";
import CategoryPieChart from "./CategoryPieChart";
import StockBarChart from "./StockBarChart";
import BrandBarChart from "./BrandBarChart";
import ProductLineChart from "./ProductLineChart";
import EcomKPICard from "../../components/newcomponents/EcomKPICard";
import EcomTab, { type TabItem } from "../../components/newcomponents/EcomTab";
import ProductPieChart from "./ProductPieChart";

const ProductDashboard = () => {
    const { getProducts } = useProduct();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("stock");

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

    const totalProducts = products.length;
    const totalCategories = new Set(products.map(p => p.category)).size;
    const totalStock = products.reduce((sum, p) => sum + Number(p.stock ?? 0), 0);
    const activeProducts = products.filter(p => p.status === "active").length;

    const tabs: TabItem[] = [
        { label: "Stock Health", value: "stock" },
        { label: "Market Analysis", value: "market" },
        { label: "Performance", value: "performance" },
    ];

    return (
        <Container maxWidth="lg" sx={{p:2, mt: { xs: '50px', md: '10px' }}} >
            <Box sx={{ mb: 2 }}>
                <Typography variant="h5" component="h1" sx={{ fontWeight: 800, color: '#1a1a1a', mb: 0.5 }}>
                    Product Insights
                </Typography>
                <Typography variant="body1" color="textSecondary">
                    Visualize your product data and key metrics at a glance.
                </Typography>
            </Box>

            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                    <EcomKPICard
                        title="Total Products"
                        value={totalProducts}
                        icon={<Inventory />}
                        color="#3f51b5"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                    <EcomKPICard
                        title="Total Categories"
                        value={totalCategories}
                        icon={<Category />}
                        color="#4caf50"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                    <EcomKPICard
                        title="Total Stock Units"
                        value={totalStock}
                        icon={<Storage />}
                        color="#ff9800"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                    <EcomKPICard
                        title="Active Products"
                        value={activeProducts}
                        icon={<CheckCircle />}
                        color="#2e7d32"
                    />
                </Grid>
            </Grid>

            <EcomTab value={activeTab} tabs={tabs} onChange={setActiveTab} />

            <Grid container spacing={3}>
                {activeTab === "stock" && (
                    <>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <StockStatusChart products={products} />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <StockBarChart products={products} />
                        </Grid>
                    </>
                )}

                {activeTab === "market" && (
                    <>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <CategoryPieChart products={products} />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <ProductPieChart products={products} />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <BrandBarChart products={products} />
                        </Grid>
                    </>
                )}

                {activeTab === "performance" && (
                    <Grid size={{ xs: 12 }}>
                        <ProductLineChart products={products} />
                    </Grid>
                )}
            </Grid>
        </Container>
    );
};

export default ProductDashboard;
