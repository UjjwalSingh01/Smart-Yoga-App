"use client";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useState } from "react";
import { useMediaQuery, useTheme } from "@mui/material";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";


function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("md")); // Large screens (md and above)

  const isAdmin = pathname.startsWith("/admin");

  const handleLogout = () => {
    localStorage.removeItem("token");
    
    router.push("/sign-in");
  };

  const handleLogIn = () => {    
    router.push("/");
  };

  // const token = localStorage.getItem("token");

  const pages = isAdmin
    ? ["Dashboard", "Product", "Blog", "Social"]
    : ["Blogs", "Social", "Orders"];

  const rightEndOptions = isAdmin
    ? [
        { label: "Profile", icon: <AccountCircleIcon />, action: () => console.log("Profile clicked") },
        // token ?
        { label: "Logout", icon: <ExitToAppIcon />, action: () => handleLogout() }
        // : { label: "Login", icon: <ExitToAppIcon />, action: () => handleLogIn() }
      ]
    : [
        { label: "Profile", icon: <AccountCircleIcon />, action: () => console.log("Profile clicked") },
        { label: "Cart", icon: <ShoppingCartIcon />, action: () => router.push("/cart"), },
        // token ?
        { label: "Logout", icon: <ExitToAppIcon />, action: () => handleLogout() }
        // : { label: "Login", icon: <ExitToAppIcon />, action: () => handleLogIn() }
      ];

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo Section */}
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            YOGA SHOP
          </Typography>

          {/* Hamburger Menu for Small Screens */}
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Logo for Small Screens */}
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            YOGA SHOP
          </Typography>

          {/* Pages for Large Screens */}
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page}
                href={isAdmin ? `/admin/${page.toLowerCase()}` : `/${page.toLowerCase()}`}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                {page}
              </Button>
            ))}
          </Box>

          {/* Right-End Section */}
          <Box sx={{ flexGrow: 0 }}>
            {isLargeScreen ? (
              // Display Options Inline for Large Screens
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {rightEndOptions.map(({ label, icon, action }) => (
                  <Button
                    key={label}
                    startIcon={icon}
                    onClick={action}
                    sx={{ color: "white", textTransform: "none", ml: 2 }}
                  >
                    {label}
                  </Button>
                ))}
              </Box>
            ) : (
              // Show Dropdown for Small Screens
              <>
                <Tooltip title="Open menu">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt="User Avatar" src="/static/images/avatar/2.jpg" />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {rightEndOptions.map(({ label, icon, action }) => (
                    <MenuItem key={label} onClick={() => { action(); handleCloseUserMenu(); }}>
                      {icon}
                      <Typography textAlign="center" sx={{ ml: 1 }}>
                        {label}
                      </Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;
