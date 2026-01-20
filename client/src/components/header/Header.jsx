import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MentorSidebar from '../sidebar/MentorSidebar';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useContext } from "react";
import { DataContext } from '../../context/DataProvider';
import { useEffect } from 'react';
import StudentSidebar from '../sidebar/StudentSidebar';
const drawerWidth = 240;
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));


const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const {account}=useContext(DataContext);
  const {setAccount} = useContext(DataContext);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  useEffect(() => {
    if(account.loggedIn === false){
      navigate('/login');
    }
  }, [])
  


  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={() => {account.role === 'mentor'?navigate(`/mentor/profile/`):navigate('/student/profile')}}>Profile</MenuItem>
      <MenuItem onClick={() => { if(location.pathname.includes('login') === false) setAccount({username :'', loggedIn:false, id:'', role:''}); navigate('/login')}}>Logout</MenuItem>
      {
        account.role === 'mentor'?
        <MenuItem onClick={() => {navigate(`/mentor/public/`)}}>Public Profile</MenuItem>
        :
        ''
      }
      
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem >
        <IconButton size="large" aria-label="show 4 new mails" color="inherit" onClick={() => { if(location.pathname.includes('messaging') === false) navigate('/messaging')}} >
          <Badge badgeContent={4} color="error">
            <MailIcon  />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem >
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
          
        >
          <Badge badgeContent={17} color="error" >
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  

  return (
   
<>

    <div>
    {
      location.pathname.includes('login') === true?
      account && account.loggedIn === true ?
      <Box sx={{ display: "flex", flexDirection:'column' }}>
    <Box sx={{ flexGrow: 1 }}>
      <AppBar  position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }} style={{backgroundColor:"#131c30"}}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
          >
            
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: 'none', sm: 'block' } }}
          >
           
          </Typography>
          <Search>
            <SearchIconWrapper>
              <SearchIcon style={{ color: '#00ecff' }} />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <IconButton size="large" aria-label="show 4 new mails" color="inherit" style={{marginLeft:'10px'}} onClick={() => { if(location.pathname.includes('messaging') === false) navigate('/messaging')}}>
              <Badge badgeContent={4} color="error">
                <MailIcon style={{ color: '#00ecff' , fontSize:'30px'}} />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              aria-label="show 17 new notifications"
              color="inherit"
              style={{ color: '#00ecff' ,marginLeft:'10px'}}
              onClick={() => { if(location.pathname.includes('notifications') === false) navigate('/notifications')}}
            >
              <Badge badgeContent={17} color="error">
                <NotificationsIcon style={{ color: '#00ecff', fontSize:'30px'}} />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
              style={{ color: '#00ecff',marginLeft:'10px'}}
            >
              <AccountCircle style={{fontSize:'30px'}} />
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
              style={{ color: '#00ecff' }}
            >
              <MoreIcon style={{ color: '#00ecff' }}/>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>
    
    
    </Box>
    
    :
    <div></div>
    :
    <Box sx={{ display: "flex" }}>
    <Box sx={{ flexGrow: 1}}>
      <AppBar  position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }} style={{backgroundColor:"#131c30"}}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
          >
            
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: 'none', sm: 'block' } }}
          >
           
          </Typography>
         
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            
            
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
              style={{ color: '#00ecff',marginLeft:'10px'}}
            >
              <AccountCircle style={{fontSize:'30px'}} />
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
              style={{ color: '#00ecff' }}
            >
              <MoreIcon style={{ color: '#00ecff' }}/>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>
    {/* {
      account.role === 'student'?<StudentSidebar/>:<MentorSidebar/>
    } */}
    
    </Box>
      
    }
    
    </div>
    </>
    );
   }
    