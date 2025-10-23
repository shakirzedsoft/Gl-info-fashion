import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    Box,
    Paper,
    IconButton,
    Button,
    Chip,
    Stack,
    Avatar,
    Snackbar,
    Alert,
    useTheme,
    useMediaQuery,
    Tooltip,
    Skeleton
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CartIcon from "../../assets/header/CartIcon.png";
import { useAuth } from '../../contexts/AuthContext';

export default function WishlistPage() {
    const { handleClick } = useAuth();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });


    const [allProducts, setAllProducts] = useState();
    const [productLoading, setProductLoading] = useState(true);
    const [favoriteProducts, setFavoriteProducts] = useState([]);
    const [cartIds, setCartIds] = useState(() => {
        const stored = localStorage.getItem("cartIds");
        return stored ? JSON.parse(stored) : [];
    });

    const handleDelete = (id) => {
        setFavoriteProducts(favoriteProducts?.filter(item => item.id !== id));

        // remove from localstorage
        const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
        const updatedStoredFavorites = storedFavorites.filter(favId => favId !== id);
        localStorage.setItem("favorites", JSON.stringify(updatedStoredFavorites));

        setSnackbar({
            open: true,
            message: 'Removed from wishlist',
            severity: 'error'
        });
        handleClick()
    };



    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const addToCartBtn = (id, category) => {

        if (!cartIds.includes(id)) {
            setCartIds((prev) => [...prev, id]);
            console.log(`Added to cart: ${id}`);
        } else {
            console.log(`Already in cart: ${id}`);
        }

        setSnackbar({
            open: true,
            message: `${category} added to cart!`,
            severity: 'success'
        });
        handleClick()

    };



    const totalPrice = favoriteProducts?.reduce((sum, item) => sum + item.price, 0);

    useEffect(() => {
        fetch("https://fakestoreapi.com/products")
            .then((response) => response.json())
            .then((data) => {
                setAllProducts(data);
                setProductLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching users:", error);
                setProductLoading(false);
            });
    }, []);


    //useEffect
    useEffect(() => {
        const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
        const filtered = allProducts?.filter((product) =>
            storedFavorites.includes(product.id)
        );
        setFavoriteProducts(filtered);

        localStorage.setItem("cartIds", JSON.stringify(cartIds));

    }, [allProducts, cartIds]);




    return (
        <Container maxWidth="md" sx={{ py: 3, mt: 20 }}
        >
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                    {/* <FavoriteBorderIcon sx={{ fontSize: 40, color: 'error.main' }} /> */}
                    <Typography variant="h4" component="h1" fontWeight="bold">
                        Wishlist
                    </Typography>
                </Stack>
                <Typography variant="body1" color="text.secondary">
                    {favoriteProducts?.length} items · Total: ${totalPrice?.toFixed(2)}
                </Typography>
            </Box>

            {favoriteProducts?.length === 0 ? (
                <Paper
                    elevation={0}
                    sx={{
                        p: 8,
                        textAlign: 'center',
                        bgcolor: 'grey.50',
                        borderRadius: 2
                    }}
                >
                    <FavoriteBorderIcon sx={{ fontSize: 80, color: 'grey.300', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                        Your wishlist is empty
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Start adding items you love!
                    </Typography>
                </Paper>
            ) : (
                <Stack spacing={2}>
                    {
                        favoriteProducts?.length > 0 ? (
                            favoriteProducts?.map((item) => (
                                <Paper
                                    key={item.id}
                                    elevation={0}
                                    sx={{
                                        p: 2,
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        borderRadius: 2,
                                        transition: 'all 0.2s',
                                        // '&:hover': {
                                        //     boxShadow: 2,
                                        //     borderColor: 'primary.main'
                                        // }
                                    }}
                                >
                                    <Stack direction="row" spacing={2}>
                                        {/* Product Image */}
                                        <Avatar
                                            src={item?.image}
                                            alt={item?.name}
                                            variant="rounded"
                                            sx={{
                                                width: 120,
                                                height: 120,
                                                border: '1px solid',
                                                borderColor: 'divider'
                                            }}
                                        />

                                        {/* Product Details */}
                                        <Box sx={{
                                            flex: 1, display: 'flex', flexDirection: 'column',
                                            // border: "2px solid orange"
                                        }}
                                        >
                                            <Stack
                                                direction="row"
                                                justifyContent="space-between"
                                                alignItems="flex-start"
                                            >
                                                <Box
                                                // border={'2px solid orange'}
                                                >
                                                    <Typography variant={isMobile ? "body" : "h6"} fontWeight="600" sx={{ mb: 0.5 }}>
                                                        {item?.title}
                                                    </Typography>
                                                    <Chip
                                                        label={item?.category}
                                                        size="small"
                                                        sx={{ mb: 1 }}
                                                    />
                                                    <Typography
                                                        variant={isMobile ? "h6" : "h5"}
                                                        // color="primary"
                                                        fontWeight="bold"
                                                    >
                                                        ${item?.price?.toFixed(2)}
                                                    </Typography>

                                                </Box>

                                                {/* Delete Button */}
                                                <Tooltip title="Delete Item">
                                                    <IconButton
                                                        onClick={() => handleDelete(item.id)}
                                                        size="small"
                                                        sx={{
                                                            // color: 'error.main',
                                                            // '&:hover': {
                                                            //     bgcolor: 'error.light',
                                                            //     color: 'white'
                                                            // }
                                                        }}
                                                    >
                                                        <DeleteOutlineIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </Stack>

                                            {/* Add to Cart Button */}

                                            <Stack
                                                direction="row"
                                                // border="2px solid orange"
                                                justifyContent="flex-end"
                                                p={0.5}
                                                onClick={() => addToCartBtn(item?.id, item?.category)}
                                            >
                                                <Tooltip title="Add to Cart" placement="bottom">
                                                    <img src={CartIcon} alt=""
                                                        style={{ cursor: "pointer" }}
                                                    />
                                                </Tooltip>
                                            </Stack>


                                        </Box>
                                    </Stack>
                                </Paper>
                            )
                            )) : (
                            <>


                                {/* <Skeleton
                                    variant="rectangular"
                                    height={200}
                                    width="100%"
                                    sx={{ borderRadius: 2, mb: 2 }}
                                /> */}

                                <Skeleton
                                    variant="rectangular"
                                    height={200}
                                    width="100%"
                                    sx={{ borderRadius: 2, mb: 2 }}
                                />
                            </>

                        )}

                    {/* Summary Section */}

                    {favoriteProducts?.length > 0 ? (
                        <Paper
                            elevation={0}
                            sx={{
                                p: isMobile ? 2 : 3,
                                bgcolor: 'primary.main',
                                //  backgroundColor: "#101010",
                                color: 'white',
                                borderRadius: 2
                            }}
                        >



                            <Stack
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                            // border={"2px solid orange"}
                            >
                                <Box>
                                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                        Total Wishlist Value
                                    </Typography>
                                    <Typography variant={isMobile ? "h5" : "h4"} fontWeight="bold">
                                        ${totalPrice?.toFixed(2)}
                                    </Typography>
                                </Box>
                                <Button
                                    variant="contained"
                                    size={isMobile ? "small" : "large"}
                                    sx={{
                                        bgcolor: 'white',
                                        color: 'primary.main',
                                        '&:hover': {
                                            bgcolor: 'grey.100'
                                        }
                                    }}
                                >
                                    Add All to Cart
                                </Button>
                            </Stack>


                        </Paper>
                    ) : (
                        <Skeleton
                            variant="rectangular"
                            height={200}
                            width="100%"
                            sx={{ borderRadius: 2, mb: 2 }}
                        />

                    )}
                </Stack>
            )}

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
}

