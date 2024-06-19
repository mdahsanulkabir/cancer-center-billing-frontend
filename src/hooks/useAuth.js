import { useContext } from "react"
import { AuthContext } from "../contextsAndProviders/contexts";

const useAuth = () => {
    return useContext(AuthContext)
}

export default useAuth;