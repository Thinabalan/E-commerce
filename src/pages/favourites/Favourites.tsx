import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Box, Typography, Divider, CircularProgress } from "@mui/material";
import Grid from "@mui/material/Grid";
import type { RootState, AppDispatch } from "../../redux/store";
import { fetchFavourites } from "../../redux/slices/favouritesSlice";
import { useAuth } from "../../context/AuthContext";
import EcomCard from "../../components/newcomponents/EcomCard";

export default function Favourites() {
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useAuth();
    const { items: favourites, loading } = useSelector((state: RootState) => state.favourites);

    useEffect(() => {
        if (user?.id) {
            dispatch(fetchFavourites(user.id));
        }
    }, [dispatch, user?.id]);

    if (loading && favourites.length === 0) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', py: 4, pt: { xs: '90px', md: '20px' }, pb: 4 }}>
            <Container maxWidth="xl">
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                        My Favourites ({favourites.length})
                    </Typography>
                    <Divider />
                </Box>

                {!loading && favourites.length === 0 && (
                    <Box sx={{ py: 10, textAlign: 'center' }}>
                        <Typography variant="h6" color="text.secondary">
                            You haven't added any favourites yet.
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Start exploring and add products you love!
                        </Typography>
                    </Box>
                )}

                {favourites.length > 0 && (
                    <Grid container spacing={3}>
                        {favourites.map((entry) => (
                            <Grid size={{ xs: 6, sm: 6, md: 3 }} key={entry.id}>
                                {entry.product ? (
                                    <EcomCard product={entry.product} />
                                ) : (
                                    <Box sx={{
                                        height: '100%',
                                        p: 2,
                                        border: '1px dashed grey',
                                        borderRadius: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexDirection: 'column',
                                        gap: 1
                                    }}>
                                        <Typography variant="body2" color="text.secondary">Product information unavailable</Typography>
                                        <Typography variant="caption" color="text.secondary">ID: {entry.productId}</Typography>
                                    </Box>
                                )}
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>
        </Box>
    );
}
