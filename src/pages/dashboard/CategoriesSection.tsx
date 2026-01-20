import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Paper, Typography, Stack, useTheme } from "@mui/material";
import useProduct from "../../hooks/useProduct";
import type { Category } from "../../types/types";

export default function CategoriesSection() {
  const theme = useTheme();
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

  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ px: { xs: 2, md: 3 } }}>
      <Paper
        elevation={0}
        sx={{
          p: 2,
          borderRadius: 3,
          bgcolor: theme.palette.mode === 'dark' ? 'background.paper' : 'white',
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          sx={{
            overflowX: 'auto',
            p: 2,
            '&::-webkit-scrollbar': { height: '6px' },
            '&::-webkit-scrollbar-track': { borderRadius: '10px', bgcolor: 'transparent' },
            '&::-webkit-scrollbar-thumb': { borderRadius: '10px', bgcolor: 'action.hover' },
          }}
        >
          {categories.filter(c => c.parentId).map(sub => {
            const parentName = categories.find(p => p.id === sub.parentId)?.name;

            if (!parentName) return null;

            return (
              <Box
                key={sub.id}
                onClick={() => navigate(`/products?category=${parentName}&sub=${sub.name}`)}
                sx={{
                  minWidth: 123,
                  p: 2,
                  borderRadius: 3,
                  textAlign: 'center',
                  cursor: 'pointer',
                  bgcolor: theme.palette.mode === 'dark' ? 'action.hover' : '#ffe4e4',
                  color: theme.palette.mode === 'dark' ? 'text.primary' : 'inherit',
                  transition: 'transform 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    bgcolor: theme.palette.mode === 'dark' ? 'action.selected' : '#ffcfcf',
                  }
                }}
              >
                <i className={`fa-solid ${sub.icon || "fa-tag"} fa-lg `}></i>
                <Typography variant="body2" fontWeight={600} noWrap>
                  {sub.name}
                </Typography>
              </Box>
            );
          })}
        </Stack>
      </Paper>
    </Box>
  );
}
