

import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    Box,
    Paper,
    IconButton,
    Button,
    Divider,
    Stack,
    Card,
    CardMedia,
    Grid,
    Chip,
    TextField,
    InputAdornment,
    Snackbar,
    Alert,
    Rating,
    useTheme,
    useMediaQuery,
    Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import DiscountIcon from '@mui/icons-material/Discount';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useAuth } from '../../contexts/AuthContext';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

export default function CartPage() {
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
    const [cartItems, setCartItems] = useState([]);

    const [coupon, setCoupon] = useState('');

    const handleQuantityChange = (id, change) => {
        setCartItems(cartItems.map(item => {
            if (item.id === id) {
                const newQuantity = Math.max(1, item.quantity + change);
                return { ...item, quantity: newQuantity };
            }
            return item;
        }));
    };

    const handleDelete = (id, name) => {
        setCartItems(cartItems.filter(item => item.id !== id));

        // remove from local storage
        const storedItem = JSON.parse(localStorage.getItem("cartIds")) || [];
        const updatedStoredItems = storedItem.filter(itemId => itemId !== id);
        localStorage.setItem("cartIds", JSON.stringify(updatedStoredItems));

        setSnackbar({
            open: true,
            message: `${name} removed from cart`,
            severity: 'info'
        });

        handleClick()

    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const subtotal = cartItems?.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = 0;
    const deliveryFee = subtotal > 100 ? 0 : 15;
    const total = subtotal - discount + deliveryFee;

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




    useEffect(() => {
        const storedFavorites = JSON.parse(localStorage.getItem("cartIds")) || [];

        const filtered = allProducts
            ?.filter((product) => storedFavorites.includes(product.id))
            ?.map((item) => ({
                ...item,
                quantity: 1,
            }));

        setCartItems(filtered || []);
    }, [allProducts]);




    return (
        <Box sx={{ py: 3, mt: 20 }}>
            <Container maxWidth="lg">
                {/* Page Header */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" fontWeight="700" gutterBottom>
                        Shopping Cart
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        {cartItems?.length} items in your cart
                    </Typography>
                </Box>


                {cartItems?.length === 0 ? (
                    <Paper
                        elevation={0}
                        sx={{
                            p: 8,
                            textAlign: 'center',
                            bgcolor: 'grey.50',
                            borderRadius: 2
                        }}
                    >

                        <ShoppingCartIcon sx={{ fontSize: 80, color: 'grey.300', mb: 2 }} />

                        <Typography variant="h6" color="text.secondary">
                            Your Cart is empty
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Start adding items you love!
                        </Typography>
                    </Paper>
                ) :
                    (
                        <Grid container spacing={0} sx={{
                            // border: "2px solid red",
                            // direction:"row",
                            // alignItems:"center",
                            justifyContent: "space-between"

                        }}>
                            {/* Left Section - Cart Items */}
                            <Grid item xs={12} lg={8}>
                                {/* Cart Items List */}
                                <Paper sx={{ mb: 3, borderRadius: 2 }}>

                                    {cartItems?.map((item) => (
                                        <Box key={item?.id}>
                                            <Box sx={{ p: 2 }}>
                                                <Grid container spacing={2}

                                                >
                                                    {/* Product Image */}
                                                    <Grid item xs={12} sm={3}>
                                                        <Card sx={{ borderRadius: 2, overflow: 'hidden' }}>
                                                            <CardMedia
                                                                component="img"
                                                                image={item?.image}
                                                                alt={item?.name}
                                                                sx={{ height: isMobile ? "100%" : 160, width: isMobile ? "100%" : 155, objectFit: 'contain', p: 1 }}
                                                            />
                                                        </Card>
                                                    </Grid>

                                                    {/* Product Details */}
                                                    <Grid item xs={12} sm={9}

                                                        sx={{
                                                            width: isMobile ? "100%" : 520
                                                        }}
                                                    >
                                                        <Stack spacing={2}>
                                                            <Box width={"100%"}>
                                                                <Stack direction="row" justifyContent="space-between" alignItems="start" width={"100%"}>
                                                                    <Box>
                                                                        <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                                                                            {item?.category}
                                                                        </Typography>

                                                                        <Typography variant="h6" fontWeight="600"

                                                                        >
                                                                            {item?.title}
                                                                            {/* {item?.title.length > 23 ? `${item?.title.slice(0, 32)}...` : item?.title} */}
                                                                        </Typography>


                                                                        <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.5 }}>
                                                                            <Rating value={item?.rating?.rate} precision={0.5} size="small" readOnly />
                                                                            <Typography variant="caption" color="text.secondary">
                                                                                ({item?.rating?.count} reviews)
                                                                            </Typography>
                                                                        </Stack>
                                                                    </Box>

                                                                    {/* <IconButton
                                                                        size="small"
                                                                        onClick={() => handleDelete(item.id, item.name)}
                                                                        sx={{
                                                                            color: 'text.secondary',
                                                                            textAlign: "end"
                                                                        }}
                                                                    >
                                                                        <DeleteIcon />
                                                                    </IconButton> */}
                                                                </Stack>
                                                            </Box>

                                                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                                {/* Quantity Selector */}
                                                                <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid #e0e0e0', borderRadius: 1 }}>
                                                                    <IconButton
                                                                        size="small"
                                                                        onClick={() => handleQuantityChange(item.id, -1)}
                                                                        sx={{ borderRadius: 0 }}
                                                                    >
                                                                        <RemoveIcon fontSize="small" />
                                                                    </IconButton>
                                                                    <Typography
                                                                        sx={{
                                                                            px: 3,
                                                                            py: 0.5,
                                                                            minWidth: 50,
                                                                            textAlign: 'center',
                                                                            fontWeight: 600,
                                                                            borderLeft: '1px solid #e0e0e0',
                                                                            borderRight: '1px solid #e0e0e0'
                                                                        }}
                                                                    >
                                                                        {item?.quantity}
                                                                    </Typography>
                                                                    <IconButton
                                                                        size="small"
                                                                        onClick={() => handleQuantityChange(item.id, 1)}
                                                                        sx={{ borderRadius: 0 }}
                                                                    >
                                                                        <AddIcon fontSize="small" />
                                                                    </IconButton>
                                                                </Box>

                                                                {/* Price */}
                                                                <Typography variant="h6" fontWeight="700" >
                                                                    ${(item?.price * item?.quantity)?.toFixed(2)}
                                                                </Typography>

                                                                <Tooltip title="Delete Item">
                                                                    <IconButton
                                                                        size="small"
                                                                        onClick={() => handleDelete(item?.id, item?.category)}
                                                                        sx={{
                                                                            color: 'text.secondary',
                                                                            textAlign: "end"
                                                                        }}
                                                                    >

                                                                        <DeleteOutlineIcon />
                                                                    </IconButton>
                                                                </Tooltip>

                                                            </Stack>
                                                        </Stack>
                                                    </Grid>
                                                </Grid>

                                            </Box>
                                            <Divider />
                                        </Box>
                                    ))}
                                </Paper>

                                {/* Delivery Info Card */}
                                <Paper sx={{ p: 2, borderRadius: 2, bgcolor: '#e8f5e9', mb: isMobile ? 1 : "" }}>
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <Box
                                            sx={{
                                                bgcolor: 'success.main',
                                                borderRadius: '50%',
                                                width: 48,
                                                height: 48,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <CheckCircleIcon sx={{ color: 'white' }} />
                                        </Box>
                                        <Box>
                                            <Typography variant="h6" fontWeight="600" color="success.dark">
                                                {deliveryFee === 0 ? 'Free Delivery Applied!' : `Add $${(100 - subtotal)?.toFixed(2)} for Free Delivery`}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Free delivery on orders above $100
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </Paper>
                            </Grid>

                            {/* Right Section - Order Summary */}
                            <Grid item xs={12} lg={4} sx={{
                                // border:"2px solid orange"
                            }}>
                                <Stack spacing={3}>
                                    {/* Coupon Card */}
                                    <Paper sx={{ p: 3, borderRadius: 2 }}>
                                        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                                            <DiscountIcon />
                                            <Typography variant="h6" fontWeight="600">
                                                Apply Coupon
                                            </Typography>
                                        </Stack>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            placeholder="Enter coupon code"
                                            value={coupon}
                                            onChange={(e) => setCoupon(e.target.value)}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <Button variant="contained" size="small"
                                                            sx={{
                                                                backgroundColor: "#101010",
                                                            }}
                                                        >
                                                            Apply
                                                        </Button>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Paper>

                                    {/* Price Summary */}
                                    <Paper sx={{ p: 3, borderRadius: 2 }}>
                                        <Typography variant="h6" fontWeight="600" sx={{ mb: 3 }}>
                                            Order Summary
                                        </Typography>

                                        <Stack spacing={2} sx={{ mb: 3 }}>
                                            <Stack direction="row" justifyContent="space-between">
                                                <Typography variant="body1" color="text.secondary">
                                                    Subtotal ({cartItems?.reduce((sum, item) => sum + item.quantity, 0)} items)
                                                </Typography>
                                                <Typography variant="body1" fontWeight="600">
                                                    ${subtotal?.toFixed(2)}
                                                </Typography>
                                            </Stack>

                                            <Stack direction="row" justifyContent="space-between">
                                                <Typography variant="body1" color="text.secondary">
                                                    Delivery Fee
                                                </Typography>
                                                <Typography variant="body1" fontWeight="600" color={deliveryFee === 0 ? 'success.main' : 'text.primary'}>
                                                    {deliveryFee === 0 ? 'FREE' : `$${deliveryFee?.toFixed(2)}`}
                                                </Typography>
                                            </Stack>

                                            {discount > 0 && (
                                                <Stack direction="row" justifyContent="space-between">
                                                    <Typography variant="body1" color="success.main">
                                                        Discount
                                                    </Typography>
                                                    <Typography variant="body1" fontWeight="600" color="success.main">
                                                        -${discount?.toFixed(2)}
                                                    </Typography>
                                                </Stack>
                                            )}
                                        </Stack>

                                        <Divider sx={{ mb: 3 }} />

                                        <Stack direction="row" justifyContent="space-between" sx={{ mb: 3 }}>
                                            <Typography variant="h6" fontWeight="700">
                                                Total Amount
                                            </Typography>
                                            <Typography variant="h5" fontWeight="700" >
                                                ${total?.toFixed(2)}
                                            </Typography>
                                        </Stack>

                                        <Button
                                            variant="contained"
                                            fullWidth
                                            size="large"
                                            sx={{
                                                py: 1.5,
                                                fontWeight: 600,
                                                fontSize: '1rem',
                                                textTransform: 'none',
                                                mb: 2,
                                                backgroundColor: "#101010",
                                            }}
                                        >
                                            Proceed to Checkout
                                        </Button>

                                        <Button
                                            variant="outlined"
                                            fullWidth
                                            sx={{
                                                textTransform: 'none',
                                                fontWeight: 600
                                            }}
                                        >
                                            Continue Shopping
                                        </Button>
                                    </Paper>

                                    {/* Payment Methods */}
                                    <Paper sx={{ p: 3, borderRadius: 2 }}>
                                        <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 2 }}>
                                            We Accept
                                        </Typography>
                                        <Stack direction="row" spacing={1} flexWrap="wrap">
                                            <Chip icon={<CreditCardIcon />} label="Credit Card" size="small" />
                                            <Chip icon={<CreditCardIcon />} label="Debit Card" size="small" />
                                            <Chip label="PayPal" size="small" />
                                            <Box sx={{ mt: isMobile ? 1 : 0 }}>
                                                <Chip label="UPI" size="small" />
                                            </Box>
                                        </Stack>
                                    </Paper>

                                    {/* Security Badge */}
                                    <Paper sx={{ p: 2, borderRadius: 2, bgcolor: 'grey.50' }}>
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <LockOutlinedIcon fontSize="small" color="success" />
                                            <Typography variant="caption" color="text.secondary">
                                                Your payment information is secure and encrypted
                                            </Typography>
                                        </Stack>
                                    </Paper>
                                </Stack>
                            </Grid>
                        </Grid>
                    )
                }

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
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Container>
        </Box>
    );
}