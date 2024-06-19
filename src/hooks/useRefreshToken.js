import axios from "../config/axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = async () => {
        const response = await axios.get('/refresh',
        {
            withCredentials: true
        });

        setAuth(prev => ({...prev,
                accessToken: response.data.accessToken,
                role: response.data.role,
                userName: response.data.userName,
                userId: response.data.userId
            })
        )
        return response.data.accessToken;
    }

    return refresh;
}

export default useRefreshToken;