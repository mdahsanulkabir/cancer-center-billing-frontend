import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import logo from "../assets/logo-full.png"
import { IconButton, Paper } from "@mui/material";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const SideBar = () => {
    const { auth } = useAuth()
    const navigate = useNavigate();
    return (
        <div className="panel-side">
            <div className="role-wrapper">
                <h3 className="role-text">ADMIN</h3>
                <div className="menu-show-hide">
                    <IconButton>
                        <MenuOutlinedIcon />
                    </IconButton>
                </div>
            </div>
            <div className="logo-container" onClick={() => navigate('/')}>
                <img className="logo" src={logo} alt="logo" />
            </div>
            <h2 className="user-name">{auth?.userName}</h2>
            <br />
            <br />
            <Paper className="menus" elevation={9}>
                <div>
                    <DashboardIcon />
                    <p>Dashboard</p>
                </div>
                <p>Data</p>
                <div onClick={() => navigate('/team')}>
                    <DashboardIcon />
                    <p>Manage Team</p>
                </div>
                <div>
                    <DashboardIcon />
                    <p>Modify Invoice</p>
                </div>
                <div onClick={() => navigate('/show-invoice')}>
                    <DashboardIcon />
                    <p>Show Invoice</p>
                </div>
                <p>Operation Structure</p>
                <div onClick={() => navigate('/department')}>
                    <DashboardIcon />
                    <p>Create Department</p>
                </div>
                <div onClick={() => navigate('/discount')}>
                    <DashboardIcon />
                    <p>Discounts</p>
                </div>
                <div onClick={() => navigate('/service')}>
                    <DashboardIcon />
                    <p>Services</p>
                </div>
                <p>Reports</p>
                <div>
                    <DashboardIcon />
                    <p>Revenue</p>
                </div>
                <div>
                    <DashboardIcon />
                    <p>Revenue Distribution</p>
                </div>
                <p>Operation</p>
                <div>
                    <DashboardIcon />
                    <p>Service Booth</p>
                </div>
                <div onClick={() => navigate('/search-patient')}>
                    <PersonOutlinedIcon />
                    <p>Search Patient</p>
                </div>
                <div onClick={() => navigate('/create-patient')}>
                    <PersonOutlinedIcon />
                    <p>Create Patient</p>
                </div>
                <div onClick={() => navigate('/create-invoice')}>
                    <DashboardIcon />
                    <p>Create Invoice</p>
                </div>
            </Paper>
        </div>
    );
};

export default SideBar;