import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '../../types/ProductTypes';
import { apiService } from '../../services/apiService';

export interface FavouriteEntry {
    id: string | number;
    userId: string | number;
    productId: string | number;
    product?: Product;
}

interface FavouritesState {
    items: FavouriteEntry[];
    loading: boolean;
    error: string | null;
}

const initialState: FavouritesState = {
    items: [],
    loading: false,
    error: null,
};

// Async Thunks
export const fetchFavourites = createAsyncThunk(
    'favourites/fetchFavourites',
    async (userId: string | number) => {
        return await apiService.get<FavouriteEntry[]>('/favourites', {
            userId,
            _embed: 'product'
        });
    }
);

export const addFavouriteAsync = createAsyncThunk(
    'favourites/addFavourite',
    async ({ userId, productId }: { userId: string | number; productId: string | number }) => {
        // We fetch expanding product even on add to keep the state consistent
        const response = await apiService.post<FavouriteEntry>('/favourites', { userId, productId });
        const fullEntry = await apiService.get<FavouriteEntry>(`/favourites/${response.id}`, { _embed: 'product' });
        return fullEntry;
    }
);

export const removeFavouriteAsync = createAsyncThunk(
    'favourites/removeFavourite',
    async (favId: string | number) => {
        await apiService.delete(`/favourites/${favId}`);
        return favId;
    }
);

const favouritesSlice = createSlice({
    name: 'favourites',
    initialState,
    reducers: {
        clearFavourites: (state) => {
            state.items = [];
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchFavourites.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchFavourites.fulfilled, (state, action: PayloadAction<FavouriteEntry[]>) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchFavourites.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch favourites';
            })
            // Add
            .addCase(addFavouriteAsync.fulfilled, (state, action: PayloadAction<FavouriteEntry>) => {
                state.items.push(action.payload);
            })
            // Remove
            .addCase(removeFavouriteAsync.fulfilled, (state, action: PayloadAction<string | number>) => {
                state.items = state.items.filter(item => item.id !== action.payload);
            });
    },
});

export const { clearFavourites } = favouritesSlice.actions;
export default favouritesSlice.reducer;
