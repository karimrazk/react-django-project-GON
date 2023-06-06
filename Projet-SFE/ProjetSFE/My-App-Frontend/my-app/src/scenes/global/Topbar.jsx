import { Box, IconButton, useTheme, CircularProgress, List, ListItem, ListItemText, Badge, ListItemIcon, Popover, Fade, Typography } from "@mui/material";
import { ColorModeContext, tokens } from "../../theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import { Email, Work, Group, LocationOn, Business } from '@mui/icons-material';
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { useContext, useEffect, useState } from "react";
import { getUpComingReunion, getUserById } from "../../utils/api";
import AuthContext from "../../context/AuthContext";



const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const [upcomingReunions, setUpcomingReunions] = useState([]);
  const { user } = useContext(AuthContext);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [dataUser, setDataUser] = useState([]);


  useEffect(() => {
    getUserById(user.user_id)
      .then(data => setDataUser(data))
      .catch(error => console.log(error));
  }, []);



  const handleToggleNotifications = async (event) => {
    setAnchorEl(event.currentTarget);
    setShowNotifications(!showNotifications);

    if (!showNotifications) {
      setLoading(true);
      try {
        const response = await getUpComingReunion(user.user_id);
        setUpcomingReunions(response);
      } catch (error) {
        console.error("Error fetching upcoming reunions:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCloseNotifications = () => {
    setAnchorEl(null);
    setShowNotifications(false);
  };

  const handleProfileClick = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileAnchorEl(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getUpComingReunion(user.user_id);
        setUpcomingReunions(response);
      } catch (error) {
        console.error("Error fetching upcoming reunions:", error);
      } finally {
        setLoading(false);
      }
    };

    if (showNotifications) {
      fetchData();
    }
  }, [showNotifications, user.user_id]);

  const open = Boolean(anchorEl);
  const id = open ? 'notifications-popover' : undefined;


  const openProfile = Boolean(profileAnchorEl);
  const profileId = openProfile ? 'profile-popover' : undefined;


  return (
    <Box display="flex" justifyContent="space-between" p={2} >
      {/* SEARCH BAR */}
      <Box display="flex" backgroundColor={colors.primary[400]} borderRadius="3px">
        <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
        <IconButton type="button" sx={{ p: 1 }}>
          <SearchIcon />
        </IconButton>
      </Box>

      {/* ICONS */}
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />}
        </IconButton>
        <IconButton onClick={handleToggleNotifications}>
          <Badge badgeContent={upcomingReunions.length} color="error">
            <NotificationsOutlinedIcon />
          </Badge>
        </IconButton>
        <IconButton onClick={handleProfileClick}>
          <PersonOutlinedIcon />
        </IconButton>
      </Box>

      {/* Profile Popover */}
      <Popover
        id={profileId}
        open={openProfile}
        anchorEl={profileAnchorEl}
        onClose={handleProfileClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Fade in={openProfile} sx={{ backgroundColor: colors.primary[400] }}>
          <Box p={1} minWidth="250px">
            {dataUser ? (
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Group />
                  </ListItemIcon>
                  <ListItemText primary={`${dataUser.first_name} ${dataUser.last_name}`} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Email />
                  </ListItemIcon>
                  <ListItemText primary={dataUser.email} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Work />
                  </ListItemIcon>
                  <ListItemText primary={`${dataUser.role}`} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <LocationOn />
                  </ListItemIcon>
                  <ListItemText primary={`${dataUser.division}`} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Business />
                  </ListItemIcon>
                  <ListItemText primary={`${dataUser.service}`} />
                </ListItem>
              </List>
            ) : (
              <Typography variant="body1">Loading...</Typography>
            )}
          </Box>
        </Fade>
      </Popover>

      {/* Upcoming Reunions Popover */}
      <Popover
        open={showNotifications}
        anchorEl={anchorEl}
        onClose={handleCloseNotifications}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Fade in={open} sx={{ backgroundColor: colors.primary[400] }}>
          <Box p={1} minWidth="250px">
            {loading ? (
              <Box display="flex" justifyContent="center" alignItems="center" height="100px">
                <CircularProgress color="primary" />
              </Box>
            ) : upcomingReunions.length === 0 ? (
              <Typography>Vous n'avez aucune réunion à venir.</Typography>
            ) : (
              <List >
                {upcomingReunions.map((reunion) => (
                  <ListItem key={reunion.id}>
                    <ListItemIcon>
                      <EventOutlinedIcon />
                    </ListItemIcon>
                    <ListItemText primary={reunion.title} secondary={`Début: ${reunion.start}, Fin: ${reunion.end}`} />
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        </Fade>
      </Popover>
    </Box>
  );
};
export default Topbar;

