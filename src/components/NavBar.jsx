// import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { IconButton } from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { authInitialValue } from "../contextsAndProviders/AuthProvider";


const NavBar = () => {
    const { setAuth, setPersist } = useAuth();
    const navigate = useNavigate();
    const logOut = () => {
        setAuth(authInitialValue);
        setPersist(false); // Clear the persistence setting
        localStorage.removeItem('persist');
        localStorage.removeItem('auth'); // Clear any other persisted data if needed
        navigate('/'); // Navigate to the home page or login page
        window.location.reload(); // Force a reload to ensure state is reset
      }
    return (
        <nav>
            <div className="search-bar">
                <input className="search-text" type="text" name="" id="" />
                <IconButton type="button" sx={{ p: 1 }}>
                    <SearchIcon />
                </IconButton>
            </div>
            <div className="icon-group">
                <IconButton>
                    <DarkModeOutlinedIcon />
                </IconButton>
                <IconButton>
                    <NotificationsOutlinedIcon />
                </IconButton>
                <IconButton>
                    <SettingsOutlinedIcon />
                </IconButton>
                <IconButton onClick={logOut}>
                    <ExitToAppIcon />
                </IconButton>
            </div>
        </nav>
    );
};

export default NavBar;