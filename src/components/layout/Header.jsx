import {
  AppBar,
  Badge,
  Box,
  CardMedia,
  Drawer,
  Link,
  List,
  ListItem,
  ListItemText,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import wishlistImg from "../../assets/header/WishlistIcon.png";
import cartImg from "../../assets/header/CartIcon.png";
import userImg from "../../assets/header/UserIcon.png";
import location from "../../assets/header/locationIcon.png";

import logo from "../../assets/header/logoIcon.png";
import logoMob from "../../assets/header/logo-mobIcon.png";
import downArrow from "../../assets/header/down-arrowIcon.png";
import searchIcon from "../../assets/header/searchIcon.png";
import moreIcon from "../../assets/header/moreIcon.png";
import React, { startTransition, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Close } from "@mui/icons-material";

function Header() {

  const navigate = useNavigate();
  const [scrollValue, setScrollValue] = useState();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { badgeUpdate, logout, userData, loading } = useAuth();

  const [favorites, setFavorites] = useState(() => {
    return JSON.parse(localStorage.getItem("favorites") || "[]");
  });

  const [cart, setCart] = useState(() => {
    return JSON.parse(localStorage.getItem("cartIds") || "[]");
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const handleMobileMenuClose = () => setMobileMenuOpen(false);
  const handleMobileMenuOpen = () => setMobileMenuOpen(true);

  const headerIcons = [
    { image: wishlistImg, isLink: true, link: "/wishlist", name: 'wishlist', length: favorites?.length },
    { image: cartImg, isLink: true, link: "/cart", name: "cart", length: cart?.length },
    { image: userImg, isLink: true, link: "/profile", name: "profile" },
    isMobile && { image: moreIcon, isMobile: true },
  ].filter(Boolean);
  // const subHeaderData = ["Sale", "Womens", "Mens", "Girls", "Christmas"];
   
  const subHeaderData =  ["Categories",
  "Men's",
  "Jewelry",
  "Electronics",
  "Women's",
]

  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    setScrollValue(scrollY);
  });

  const navigateToProducts = () => {
    navigate("/products");
  };

  const handleClick = (link) => {
    navigate(link);
  };

  const handleLogout = async () => {
    try {
      await logout();
      startTransition(() => {
        navigate("/login");
      });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };


  useEffect(() => {
    const timer = setTimeout(() => {
      const updatedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]");
      setFavorites(updatedFavorites);

      const updatedCarts = JSON.parse(localStorage.getItem("cartIds") || "[]");
      setCart(updatedCarts)

    }, 0);

    return () => clearTimeout(timer);
  }, [badgeUpdate]);


  return (
    <>
      {isMobile ? (
        <>
          <AppBar
            position="fixed"
            elevation={0}
            sx={{
              backgroundColor: "white",
              color: "#2B0000",
              px: { xs: 2, md: 6 },
              pt: 0,
              minHeight: 40,
              textAlign: "center",
              borderBottom: "1px solid #00000020",
              zIndex: 1300,
            }}
          >
            <Toolbar
              disableGutters
              sx={{
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {/* Left side */}
              <Stack direction="row" alignItems="center" spacing={1}>
                <CardMedia
                  component="img"
                  src={location}
                  height={25}
                  //   width={10}
                  sx={{
                    objectFit: "contain",
                    width: "25px",
                  }}
                />

                <Link href="#" underline="none">
                  <Typography
                    sx={{
                      color: "#3C3C3C",
                      fontSize: 14,
                      fontWeight: 500,
                      textDecoration: "none",
                    }}
                  >
                    Find a store
                  </Typography>
                </Link>
              </Stack>
            </Toolbar>
          </AppBar>

          <AppBar
            position="fixed"
            elevation={0}
            sx={{
              top: 40, // offset below the first AppBar
              backgroundColor: "white",
              boxShadow: "0px 4px 8px -2px rgba(0, 0, 0, 0.1)",
              color: "#2B0000",
              px: { xs: 2, md: 6 },
              py: 2,
              minHeight: 48,
              zIndex: 1299,
              mt: 2,
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <CardMedia
                component="img"
                src={logoMob}
                height="auto"
                //   width={10}
                sx={{
                  objectFit: "contain",
                  width: "auto",
                  //  border:"2px solid orange",
                }}
                onClick={() => navigateToProducts()}
              />

              {/* Right side icons */}
              <Stack direction="row" spacing={2} alignItems="center">
                {headerIcons?.map((image, index) => (
                  <Stack spacing={2}
                    key={index}
                  >
                    {image?.isLink ? (
                      // <Link
                      //   href={image?.link}
                      //   sx={{
                      //     cursor: "pointer",
                      //   }}
                      // >
                      <Badge badgeContent={image?.length} color="secondary"
                        onClick={() => handleClick(image?.link)}
                      >
                        <CardMedia
                          component="img"
                          src={image?.image}
                          height={25}
                          width={25}
                        />
                      </Badge>

                      // </Link>
                    ) : (
                      <CardMedia
                        component="img"
                        src={image?.image}
                        height={25}
                        width={25}
                        onClick={handleMobileMenuOpen}
                      />
                    )}
                  </Stack>
                ))}
              </Stack>
            </Stack>
          </AppBar>

          {/* Mobile Menu Drawer */}

          <Drawer
            anchor="right"
            open={mobileMenuOpen}
            onClose={handleMobileMenuClose}
            sx={{
              "& .MuiDrawer-paper": {
                width: 250,
                boxSizing: "border-box",
                // border:"2px solid orange"
              },
            }}
          >
            {/* <Box sx={{ p: 2, display: "flex", justifyContent: "flex-end",}}>
              <IconButton
                onClick={handleMobileMenuClose}
              >
                <Close />
              </IconButton>
            </Box> */}

            <List sx={{ mt: "50%" }}>
              {["Shop", "Collections", "Offers", "Support"]?.map((link) => (
                <ListItem
                  button
                  key={link}
                  onClick={() => handleMobileMenuClose()}
                >
                  <ListItemText primary={link} />
                </ListItem>
              ))}
              <ListItem
                button
                onClick={() => {
                  handleMobileMenuClose();
                  handleLogout();
                }}
              >
                <ListItemText primary="Logout" />
              </ListItem>
            </List>
          </Drawer>
        </>
      ) : (
        <>
          <AppBar
            position="fixed"
            elevation={0}
            sx={{
              backgroundColor: scrollValue > 20 ? "white" : "transparent",
              borderBottom: "1px solid #00000020",

              color: "#2B0000",
              px: { xs: 2, md: 6 },
              pt: 2,
              minHeight: 96,
              textAlign: "center",
              // border:"2px solid orange"
            }}
          >
            <Toolbar
              disableGutters
              sx={{
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {/* Left side */}
              <Stack direction="row" alignItems="center" spacing={1}>
                <CardMedia
                  component="img"
                  src={location}
                  height={25}
                  //   width={10}
                  sx={{
                    objectFit: "contain",
                    width: "25px",
                  }}
                />

                <Link
                  href="#"
                  underline="none"
                  sx={{ color: "inherit", fontSize: 14, fontWeight: 500 }}
                >
                  Find a store
                </Link>
              </Stack>

              {/* Center Brand Name */}
              <CardMedia
                component="img"
                src={logo}
                height={48}
                //   width={10}
                sx={{
                  objectFit: "contain",
                  width: "230px",
                  // border:"2px solid orange",
                  cursor: "pointer"
                }}
                onClick={() => navigateToProducts()}
              />

              {/* Right side icons */}
              <Stack direction="row" spacing={3} alignItems="center">
                {headerIcons?.map((image, k) => (
                  <Stack spacing={2} key={k}>
                    {image?.isLink ? (
                      <Tooltip title={image?.name} arrow
                        sx={{
                          cursor: "pointer",
                        }}
                      >

                        {/* <Link
                          href={image?.link}
                          sx={{
                            cursor: "pointer",
                          }}
                        > */}

                        <Badge badgeContent={image?.length} color="secondary"
                          onClick={() => handleClick(image?.link)}
                        >
                          <CardMedia
                            component="img"
                            src={image?.image}
                            height={25}
                            width={25}
                          />
                        </Badge>

                        {/* </Link> */}
                      </Tooltip>
                    ) : (
                      <CardMedia
                        component="img"
                        src={image?.image}
                        height={25}
                        width={25}
                      />
                    )}
                  </Stack>
                ))}
              </Stack>
            </Toolbar>
          </AppBar>
          {/* <Divider /> */}


          <AppBar
            position="fixed"
            elevation={0}
            sx={{
              backgroundColor: scrollValue > 20 ? "white" : "transparent",
              borderBottom: "1px solid #00000020",
              top: 80,
              color: "#2B0000",
              px: { xs: 2, md: 6 },
              pt: 1.5,
              minHeight: 80,
              textAlign: "center",
            }}
          >
            <Toolbar
              disableGutters
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 5,
              }}
            >
              {subHeaderData?.map((name, k) => (
                <Box key={k}>
                  <Typography
                    color="#3C3C3C"
                    fontSize={16}
                    display="flex"
                    alignItems="center"
                    // border={"2px solid orange"}
                  >
                    {name}
                    <CardMedia
                      component="img"
                      src={downArrow}
                      height={16}
                      width={16}
                      sx={{
                        pl: 0.3,
                      }}
                    />
                  </Typography>
                </Box>
              ))}
              <Stack>
                <CardMedia
                  component="img"
                  src={searchIcon}
                  height={24}
                  width={24}
                  sx={{
                    pl: 0.3,
                  }}
                />
              </Stack>
            </Toolbar>
          </AppBar>
          
        </>
      )}
    </>
  );
}

export default Header;
