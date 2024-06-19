
// import MainContent from "../components/MainContent";
// import Welcome from "../components/Welcome";
import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";
import { Outlet } from "react-router-dom";

const Home = () => {
    return (
        <main>
            <div className="app-wrapper">
                <SideBar />
                <div className="content-side">
                    <NavBar />
                    <Outlet />
                </div>
            </div>
            <footer>
                CMHCC
            </footer>
        </main>
    );
};

export default Home;