import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import AuthContext from "./context/AuthContext";
import LogOutButton from "./LogOutButton";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import AccountCircle from '@mui/icons-material/AccountCircle';
import GitHubIcon from '@mui/icons-material/GitHub';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';

import axios from "axios";
import { useNavigate } from "react-router-dom";
const pages = ['Sven']//'Products', 'Pricing', 'Blog'];
const settings = ['Logout'];

function Topbar() {
  const { getLoggedIn } = useContext(AuthContext);
  const { loggedIn } = useContext(AuthContext);

  const [auth, setAuth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const navigate = useNavigate();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  async function logOut() {
    await axios.get(process.env.REACT_APP_API_URL + "/auth/logout/");
    await getLoggedIn();
    navigate("/");
  }

  async function openSource() {
    window.open('https://github.com/mijauexe/simple-mlops', '_blank', 'noreferrer');
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" >
        <Toolbar >
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <GitHubIcon onClick={openSource} />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Cool webpage
          </Typography>
          {loggedIn &&
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>
                  <DirectionsRunIcon/>
                  <Typography onClick={logOut} textAlign="center">Log out

                </Typography></MenuItem>
              </Menu>
            </div>}
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Topbar;
