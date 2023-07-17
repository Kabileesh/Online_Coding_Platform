import React from "react";
import { Input } from "reactstrap";
import {
  MDBBtn,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
} from "mdb-react-ui-kit";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../Styles/CodeNavbar.css";

toast.configure()

const CodeNavBar = (props) => {
  const languages = ["c", "cpp", "rust", "python", "Go", "ruby"];
  const themes = ["vs-dark", "light"];

  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  const submissionHandler = async () => {
    props.saveCode();
  };

  const loginForwarder = () => {
    toast.warning('Login to save code', {autoClose:3000})
    navigate("/login");
  };

  return (
    <div className="navbar">
      <div style={{ textAlign: "left", display: "-webkit-inline-flex" }}>
        <Input
          className="code-select"
          type="select"
          onChange={(e) => props.onLanguageSelect(e.target.value)}
          defaultValue={languages[0]}
        >
          {languages.map((lang) => (
            <option value={lang}>{lang}</option>
          ))}
        </Input>
        <Input
          className="code-select"
          type="select"
          onChange={(e) => props.onThemeSelect(e.target.value)}
          defaultValue={themes[0]}
        >
          {themes.map((theme) => (
            <option value={theme}>{theme}</option>
          ))}
        </Input>
        <MDBBtn
          className="me-1"
          style={{ marginLeft: "2%", height: "30px" }}
          color="success"
          onClick={props.user ? submissionHandler : loginForwarder}
        >
          Save
        </MDBBtn>
      </div>
      {!props.user ? (
        <div style={{ marginRight: "5%", marginTop: "0.2%" }}>
          <Link to="/login">
            <u style={{ color: "yellow" }}>
              <p style={{ color: "yellow", fontSize: "larger" }}>Log in</p>
            </u>
          </Link>
        </div>
      ) : (
        <div style={{ marginRight: "2%"}}>
          <MDBDropdown dropleft group>
            <MDBDropdownToggle>
              <FontAwesomeIcon
                link
                icon={faUser}
                style={{ fontSize: "16px", paddingRight: "2rem" }}
              />
            </MDBDropdownToggle>
            <MDBDropdownMenu>
              <MDBDropdownItem link disabled>
                <h6>{props.user}</h6>
              </MDBDropdownItem>
              <MDBDropdownItem divider />
              <MDBDropdownItem link>
                <Link style={{ color: "black" }} to={"/view-submissions"}>
                  My Submissions
                </Link>
              </MDBDropdownItem>
              <MDBDropdownItem
                link
                style={{ color: "black" }}
                onClick={handleLogout}
              >
                Log Out
              </MDBDropdownItem>
            </MDBDropdownMenu>
          </MDBDropdown>
        </div>
      )}
    </div>
  );
};

export default CodeNavBar;
