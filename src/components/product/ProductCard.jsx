import { useTheme } from "@emotion/react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useAuth } from "../../contexts/AuthContext";

function ProdCard({ allProducts }) {

  const { handleClick } = useAuth();

  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const handleTextLength = isMobile ? 25 : 35;

  const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
  const [favorites, setFavorites] = useState(storedFavorites);

  const [cartIds, setCartIds] = useState(() => {
    const stored = localStorage.getItem("cartIds");
    return stored ? JSON.parse(stored) : [];
  });

  const navigateTo = (id) => {
    navigate(`/product/${id}`);
  };


  // favoriteBtn
  const favoriteBtn = (id) => {
    setFavorites((prev) =>
      prev.includes(id)
        ? prev.filter((favId) => favId !== id)
        : [...prev, id]
    );
    handleClick()
  }



  //addToCartBtn
  const addToCartBtn = (id) => {

    if (!cartIds.includes(id)) {
      setCartIds((prev) => [...prev, id]);
      console.log(`Added to cart: ${id}`);
    } else {
      console.log(`Already in cart: ${id}`);
    }
    handleClick()

  }



  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
    localStorage.setItem("cartIds", JSON.stringify(cartIds));
  }, [favorites, cartIds]);



  return (
    <Box sx={{ p: isMobile ? 0 : 3 }}>
      <Grid container spacing={isMobile ? 3 : 0}>
        {allProducts?.map((product) => {
          const isFav = favorites.includes(product.id);
          return (
            <Grid
              pl={isMobile ? 0.5 : 0}
              key={product.id}
              display="flex"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
            >
              <Card
                // onClick={() => navigateTo(product?.id)}
                sx={{
                  cursor: "pointer",
                  width: isMobile ? 150 : 260,
                  height: "100%",
                  position: "relative",
                  boxShadow: "none",
                  borderRadius: 1,
                  "&:hover .hover-actions": {
                    opacity: 1,
                  },
                }}
              >
                {/* Image Container */}
                <Box
                  sx={{
                    position: "relative",
                    paddingTop: "83%",
                  }}
                >
                  <CardMedia
                    component="img"
                    image={product?.image}
                    alt={product?.title}
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: isMobile ? "136px" : "220px",
                      objectFit: "contain",
                    }}
                    onClick={() => navigateTo(product?.id)}
                  />

                  {/* Favorite Icon */}
                  <IconButton
                    sx={{
                      position: "absolute",
                      top: 15,
                      right: 8,
                      bgcolor: "white",
                      width: 32,
                      height: 32,
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      "&:hover": {
                        bgcolor: "white",
                      },
                    }}
                    onClick={() => favoriteBtn(product?.id)}
                  >
                    {/* <FavoriteBorderIcon sx={{ fontSize: 18, color: "#666" }} /> */}

                    {isFav ? (
                      <FavoriteIcon sx={{ fontSize: 18, color: "red" }} />
                    ) : (
                      <FavoriteBorderIcon sx={{ fontSize: 18, color: "#666" }} />
                    )}

                  </IconButton>

                  {/* Hover Actions */}
                  {!isMobile && (
                    <Box
                      className="hover-actions"
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        left: 12,
                        right: 12,
                        display: "flex",
                        gap: 1,
                        opacity: 0,
                        transition: "opacity 0.3s ease",
                      }}
                    >
                      <Button
                        startIcon={<RemoveRedEyeIcon sx={{ fontSize: 16 }} />}
                        variant="contained"
                        sx={{
                          flex: 1,
                          bgcolor: "#FFFFFF",
                          color: "#333",
                          fontSize: "10px",
                          textTransform: "none",
                          py: 0.75,
                          minWidth: "auto",
                          fontWeight: 500,
                          borderRadius: "0px",
                          "&:hover": {
                            bgcolor: "#f5f5f5",
                          },
                        }}
                        onClick={() => navigateTo(product?.id)}
                      >
                        Quick View
                      </Button>
                      <Button
                        startIcon={
                          <ShoppingCartOutlinedIcon sx={{ fontSize: 16 }} />
                        }
                        variant="contained"
                        sx={{
                          flex: 1,
                          bgcolor: "#FFFFFF",
                          color: "#333",
                          fontSize: "10px",
                          textTransform: "none",
                          py: 0.75,
                          minWidth: "auto",
                          fontWeight: 500,
                          borderRadius: "0px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          "&:hover": {
                            bgcolor: "#f5f5f5",
                          },
                        }}
                        onClick={() => addToCartBtn(product?.id)}
                      >
                        Add to Cart
                      </Button>
                    </Box>
                  )}
                </Box>

                {/* Product Info */}
                <CardContent>
                  <Stack
                    direction="row"
                    alignItems="start"
                    justifyContent="space-between"
                    pt={isMobile ? 2 : 1}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: isMobile ? "11px" : "16px",
                        fontWeight: 400,
                        color: "#868686",
                        mb: 0.5,
                        lineHeight: 1.4,
                        textAlign: "start",
                        maxWidth: isMobile ? "70px" : "160px",
                        whiteSpace:
                          product?.title && product.title.length > 100
                            ? "nowrap"
                            : "normal",
                        overflow:
                          product?.title && product.title.length > 100
                            ? "hidden"
                            : "visible",
                        textOverflow:
                          product?.title && product.title.length > 100
                            ? "ellipsis"
                            : "unset",
                      }}
                    >
                      {product?.title && product.title.length > handleTextLength
                        ? `${product.title.substring(0, handleTextLength)}...`
                        : product?.title}
                    </Typography>

                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: isMobile ? "11px" : "16px",
                        fontWeight: 500,
                        color: "#3C3C3C",
                      }}
                    >
                      $ {product?.price}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          )
        })}
      </Grid>
    </Box>
  );
}

export default ProdCard;

ProdCard.propTypes = {
  allProducts: PropTypes.any,
};
