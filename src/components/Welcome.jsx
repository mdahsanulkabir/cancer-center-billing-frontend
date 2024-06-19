import useAuth from "../hooks/useAuth";


const Welcome = () => {
    const {auth} = useAuth();
    return (
        <div className="welcome">
            <div>
                <h1>Hello <span>{auth?.userName} !</span></h1>
                <h1>Welcome to CMH Cancer Center</h1>
            </div>
        </div>
    );
};

export default Welcome;