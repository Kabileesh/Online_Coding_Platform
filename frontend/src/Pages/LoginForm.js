import React, { useState } from "react";
import {
  MDBInput,
  MDBBtn,
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane,
} from "mdb-react-ui-kit";
import axios from "../Components/axiosConfig";
import { Navigate, useNavigate } from "react-router-dom";
import "../Styles/LoginForm.css";

const LoginForm = () => {
  const [loginRegisterActive, setLoginRegister] = useState("login");

  const handleLoginRegisterClick = (value) => {
    setLoginRegister(value);
  };

  //login
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [authorizer, setAuthorizer] = useState(true);

  const navigate = useNavigate();

  const mailHandler = (event) => {
    setMail(event.target.value);
  };

  const passwordHandler = (event) => {
    setPassword(event.target.value);
  };

  const LoginHandler = async (event) => {
    event.preventDefault();
    const userData = {
      username: mail,
      password: password,
    };
    try {
      const response = await axios.post("/login", userData);
      if (response.status === 200) {
        setAuthorizer(false);
        const accessToken = response?.data.accessToken;
        if (accessToken) sessionStorage.setItem("accessToken", accessToken);
        navigate("/code");
      } else if (response?.status === 401) {
        setAuthorizer(true);
      } else {
        console.log(response.status);
      }
    } catch (err) {
      console.log(err);
    }
  };

  //register or sign up

  const [name, setName] = useState("");
  const [registerMail, setRegisterMail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  const nameHandler = (event) => {
    setName(event.target.value);
  };

  const registerMailHandler = (event) => {
    setRegisterMail(event.target.value);
  };

  const registerPasswordHandler = (event) => {
    setRegisterPassword(event.target.value);
  };

  const registerHandler = async (event) => {
    event.preventDefault();
    const userData = {
      name: name,
      username: registerMail,
      password: registerPassword,
    };
    try {
      const response = await axios.post("/register", userData);
      if (response.status === 200) {
        const accessToken = response?.data.accessToken;
        sessionStorage.setItem("accessToken", accessToken);
        navigate("/code");
      } else {
        console.error(response.status);
      }
    } catch (err) {
      console.log(err);
    }
  };

  if (window.sessionStorage.getItem("accessToken")) return <Navigate to="/code" />;
  return (
    <div className="dark-theme">
      <div className="login-form-container">
        <h3>Judge0 Online IDE</h3>
        <MDBTabs pills justify className="mb-3">
          <MDBTabsItem>
            <MDBTabsLink
              style={{
                backgroundColor: "rgb(231, 74, 74)",
                color: "black",
                fontSize: "1rem",
              }}
              onClick={() => handleLoginRegisterClick("login")}
              active={loginRegisterActive === "login"}
            >
              Login
            </MDBTabsLink>
          </MDBTabsItem>
          <MDBTabsItem>
            <MDBTabsLink
              style={{
                backgroundColor: "rgb(95, 233, 104)",
                color: "black",
                fontSize: "1rem",
              }}
              onClick={() => handleLoginRegisterClick("register")}
              active={loginRegisterActive === "register"}
            >
              Register
            </MDBTabsLink>
          </MDBTabsItem>
        </MDBTabs>

        <MDBTabsContent>
          <MDBTabsPane show={loginRegisterActive === "login"}>
            <form>
              <MDBInput
                className="mb-4"
                type="email"
                label="Email"
                onChange={mailHandler}
                autoComplete="off"
                contrast
              />
              <MDBInput
                className="mb-4"
                type="password"
                label="Password"
                onChange={passwordHandler}
                autoComplete="off"
                contrast
              />

              <MDBBtn
                type="submit"
                className="mb-4 btn"
                block
                onClick={LoginHandler}
              >
                Sign in
              </MDBBtn>

              {authorizer ? (
                ""
              ) : (
                <p style={{ textAlign: "center", color: "red" }}>
                  Invalid Credentials
                </p>
              )}    
            </form>
          </MDBTabsPane>
          <MDBTabsPane show={loginRegisterActive === "register"}>
            <form>
              <MDBInput
                className="mb-4"
                label="Name"
                onChange={nameHandler}
                autoComplete="off"
                contrast
              />
              <MDBInput
                className="mb-4"
                type="email"
                label="Email"
                onChange={registerMailHandler}
                autoComplete="off"
                contrast
              />
              <MDBInput
                className="mb-4"
                type="password"
                label="Password"
                onChange={registerPasswordHandler}
                autoComplete="off"
                contrast
              />

              <MDBBtn
                type="submit"
                className="mb-4 btn"
                block
                onClick={registerHandler}
              >
                Register
              </MDBBtn>
            </form>
          </MDBTabsPane>
        </MDBTabsContent>
      </div>
    </div>
  );
};

export default LoginForm;
