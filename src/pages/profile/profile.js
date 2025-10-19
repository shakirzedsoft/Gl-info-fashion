

import React, { startTransition } from "react";
import {
  Box,
  Container,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  Button,
  Badge
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
  Logout as LogoutIcon,
  ChevronRight as ChevronRightIcon
} from '@mui/icons-material';
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from 'react-router-dom';

export default function ProfileSection() {
   const navigate = useNavigate();
   const { logout, userData } = useAuth();

  const convertFirestoreTimestamp = (timestamp) => {
    if (
      !timestamp ||
      typeof timestamp.seconds !== "number" ||
      typeof timestamp.nanoseconds !== "number"
    ) {
      return "Invalid date";
    }

    const milliseconds = timestamp.seconds * 1000 + timestamp.nanoseconds / 1e6;
    const date = new Date(milliseconds);

    if (isNaN(date.getTime())) {
      return "Invalid date";
    }

    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

 const handleLogout = async () => {
    // navigate("/products");
    try {
      await logout();
      startTransition(() => {
        navigate("/login");
      });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        mt:10
      }}
    >
      <Container maxWidth="sm">
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6 }}>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 300 }}>
              Profile
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Personal Information
            </Typography>
          </Box>
          <IconButton onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Box>

        {/* Avatar */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 6 }}>
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={
              <Box sx={{ width: 24, height: 24, bgcolor: '#4ade80', borderRadius: '50%', border: '4px solid white' }} />
            }
          >
            <Avatar sx={{ width: 160, height: 160, background: 'linear-gradient(to top right, #fb923c, #fb7185)' }}>
              <PersonIcon sx={{ fontSize: 72 }} />
            </Avatar>
          </Badge>
        </Box>

        {/* Profile List */}
        <List>
          <ListItem>
            <ListItemIcon>
              <Avatar sx={{ bgcolor: '#dbeafe' }}>
                <PersonIcon sx={{ color: '#2563eb' }} />
              </Avatar>
            </ListItemIcon>
            <ListItemText 
              primary="NAME" 
              secondary={userData?.name}
              primaryTypographyProps={{ variant: 'caption', color: 'text.secondary' }}
              secondaryTypographyProps={{ variant: 'body1', fontWeight: 500 }}
            />
            <ChevronRightIcon color="disabled" />
          </ListItem>
          <Divider />
          
          <ListItem>
            <ListItemIcon>
              <Avatar sx={{ bgcolor: '#dcfce7' }}>
                <EmailIcon sx={{ color: '#16a34a' }} />
              </Avatar>
            </ListItemIcon>
            <ListItemText 
              primary="EMAIL" 
              secondary={userData?.email}
              primaryTypographyProps={{ variant: 'caption', color: 'text.secondary' }}
              secondaryTypographyProps={{ variant: 'body1', fontWeight: 500 }}
            />
            <ChevronRightIcon color="disabled" />
          </ListItem>
          <Divider />
          
          <ListItem>
            <ListItemIcon>
              <Avatar sx={{ bgcolor: '#f3e8ff' }}>
                <CalendarIcon sx={{ color: '#9333ea' }} />
              </Avatar>
            </ListItemIcon>
            <ListItemText 
              primary="JOINED" 
              secondary={convertFirestoreTimestamp(userData?.createdAt)}
              primaryTypographyProps={{ variant: 'caption', color: 'text.secondary' }}
              secondaryTypographyProps={{ variant: 'body1', fontWeight: 500 }}
            />
            <ChevronRightIcon color="disabled" />
          </ListItem>
        </List>

        {/* Edit Button */}
        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Button variant="contained" sx={{ bgcolor: '#111827', borderRadius: 2, px: 4 }}>
            Edit Profile
          </Button>
        </Box>
      </Container>
    </Box>
  );
}