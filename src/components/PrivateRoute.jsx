import { Navigate, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { logout } from "../state/authSlice";
import { isAuthenticated as checkAuthenticated, isTokenExpired, hasJWTCookie, validateAuthWithServer } from "../utils/auth";

const PrivateRoute = () => {
    const { userInfo } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const [isValidating, setIsValidating] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const validateAuth = async () => {
            console.log('PrivateRoute: Validating auth, userInfo:', userInfo);

            // Quick checks first
            if (!checkAuthenticated(userInfo)) {
                console.log('PrivateRoute: User not authenticated');
                setIsAuthenticated(false);
                setIsValidating(false);
                return;
            }

            // Check if token appears expired based on login time
            if (isTokenExpired(userInfo)) {
                console.log('PrivateRoute: Token appears expired based on timestamp');
                dispatch(logout());
                setIsAuthenticated(false);
                setIsValidating(false);
                return;
            }

            // Check if JWT cookie exists (temporarily disabled for debugging)
            // if (!hasJWTCookie()) {
            //     console.log('PrivateRoute: JWT cookie not found');
            //     dispatch(logout());
            //     setIsAuthenticated(false);
            //     setIsValidating(false);
            //     return;
            // }

            console.log('PrivateRoute: All checks passed, user is authenticated');
            // For now, trust the userInfo if other checks pass
            // Server validation can be added later if needed
            setIsAuthenticated(true);

            setIsValidating(false);
        };

        validateAuth();
    }, [userInfo, dispatch]);

    // Show loading state while validating
    if (isValidating) {
        return <div>Loading...</div>;
    }

    return isAuthenticated ? <Outlet /> : <Navigate to='/' replace />;
}

export default PrivateRoute