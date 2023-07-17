import { Navigate } from "react-router-dom"

const PrivateRoute = (props) =>{
    const accessToken = window.sessionStorage.getItem("accessToken");
    return accessToken ? <>{props.children}</> : <Navigate to="/login" />;
}

export default PrivateRoute;