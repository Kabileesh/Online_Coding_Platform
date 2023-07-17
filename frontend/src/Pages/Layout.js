import { useNavigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../Components/axiosConfig";
import { Spinner } from "reactstrap";
import HomePage from "./Home";

const Layout = () => {
  const [loading, setLoading] = useState("idle");
  const [username, setUsername] = useState("");

  const navigate = useNavigate();
  const logoutHandler = () => {
    sessionStorage.clear();
    navigate("/login");
  };
  useEffect(() => {
    const verifyUser = async () => {
      try {
        const accessToken = window.sessionStorage.getItem("accessToken");
        setLoading("loading");
        const response = await axios.post("/verify-token", {
          token: accessToken,
        });
        if (!response.data?.username) {
          logoutHandler();
        }
        setUsername(response.data?.username);
      } catch (err) {
        logoutHandler();
      } finally {
        setLoading("succeeded");
      }
    };
    if (loading === "idle") verifyUser();
  }, []);
  if (loading === "loading")
    return (
      <Spinner
        color="primary"
        style={{ textAlign: "center", marginTop: "10%" }}
      />
    );
  if (loading === "succeeded")
    return (
      <div>
        <HomePage user={username} />
        <Outlet />
      </div>
    );
};
export default Layout;
