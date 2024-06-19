import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import useRefreshToken from "../hooks/useRefreshToken";
import { Outlet } from "react-router-dom";


const PersistLogin = () => {
    const { auth, persist } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const refresh = useRefreshToken();

    useEffect(() => {
        let isMounted = true;

        const verifyRefreshToken = async () => {
            try {
                await refresh();
            }
            catch (err) {
                console.error(err);
            }
            finally {
                isMounted && setIsLoading(false);
            }
        }

        // persist avoids unwanted call to verifyRefreshToken
        if (!auth?.accessToken && persist) {
            verifyRefreshToken();
        } else {
            setIsLoading(false);
        }

        return () => {
            isMounted = false
        };
    }, [auth?.accessToken, persist, refresh])

    // useEffect(() => {
    //     console.log(`isLoading: ${isLoading}`)
    //     console.log(`auth Token: ${JSON.stringify(auth?.accessToken)}`)
    // }, [auth?.accessToken, isLoading])
    return (
        <>
            {!persist
                ? <Outlet />
                : isLoading
                    ? <p>Loading...</p>
                    : <Outlet />
            }
        </>
    );
};

export default PersistLogin;