import { Card, CardContent, CardMedia, Typography, Box, IconButton } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import { addFavouriteAsync, removeFavouriteAsync } from "../../redux/slices/favouritesSlice";
import type { RootState, AppDispatch } from "../../redux/store";
import type { Product } from "../../types/ProductTypes";
import { useAuth } from "../../context/AuthContext";
import { useUI } from "../../context/UIContext";
import EcomButton from "./EcomButton";

interface EcomCardProps {
    product: Product;
}

const EcomCard = ({ product }: EcomCardProps) => {
    const { productName: name, price, image, id } = product;
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, user } = useAuth();
    const { showSnackbar } = useUI();

    const favourites = useSelector((state: RootState) => state.favourites.items);
    const favEntry = favourites.find(item => String(item.productId) === String(id));
    const isFavourite = !!favEntry;

    const handleFavouriteClick = () => {
        if (!isAuthenticated) {
            showSnackbar("Login to continue", "error");
            navigate(location.pathname, { state: { showAuth: true } });
            return;
        }

        if (isFavourite && favEntry) {
            dispatch(removeFavouriteAsync(favEntry.id));
        } else {
            if (!user) return;
            dispatch(addFavouriteAsync({
                userId: user.id,
                productId: id
            }));

        }
    };

    return (
        <Card
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                }
            }}
        >
            <CardMedia
                component="img"
                height="200"
                image={image}
                alt={name}
                sx={{ objectFit: 'contain', p: 1 }}
            />
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography
                    variant="subtitle1"
                    component="h2"
                    sx={{
                        fontWeight: 600,
                        lineHeight: 1.2,
                    }}
                >
                    {name}
                </Typography>
                <Typography variant="h6" color="#FF6B6B" sx={{ fontWeight: 700 }}>
                    ₹{price}
                </Typography>

                <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton
                        size="small"
                        onClick={handleFavouriteClick}
                        sx={{
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: '8px',
                            color: isFavourite ? "red" : "inherit",
                            flexShrink: 0
                        }}
                    >
                        {isFavourite ? <Favorite fontSize="small" /> : <FavoriteBorder fontSize="small" />}
                    </IconButton>
                    <EcomButton
                        variant="contained"
                        label="Add to Cart"
                        size="small"
                        sx={{
                            borderRadius: '8px',
                            textTransform: 'none',
                            fontWeight: 600,
                            whiteSpace: 'nowrap',
                            px: 1,
                            fontSize: { xs: '0.75rem', sm: '0.875rem' }
                        }}
                    />
                </Box>
            </CardContent>
        </Card>
    );
};

export default EcomCard;
