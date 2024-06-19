/* eslint-disable react/prop-types */
import { useState } from "react";
import { AuthContext } from "./contexts";

export const authInitialValue = {
    userName: "",
    userId: "",
    role: "",
    accessToken: ""
}


const AuthProvider = ({children}) => {
    const [auth, setAuth] = useState(authInitialValue);
    const [persist, setPersist] = useState(JSON.parse(localStorage.getItem("persist") ?? "false"));
    return (
        <AuthContext.Provider value={{ auth, setAuth, persist, setPersist}}>
            { children }
        </AuthContext.Provider>
    );
};

export default AuthProvider;