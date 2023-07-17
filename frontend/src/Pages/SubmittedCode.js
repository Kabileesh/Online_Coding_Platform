import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../Components/axiosConfig";
import {
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
} from "mdb-react-ui-kit";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import {
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  ListGroupItemText,
} from "reactstrap";
import "../Styles/Submission.css";

const SubmittedCode = () => {
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("");
  const [output, setOutput] = useState("");
  const [timestamp, setTimestamp] = useState("");
  const [codeStatus, setCodeStatus] = useState("");
  const [username, setUsername] = useState("");

  const { code_id } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const accessToken = window.sessionStorage.getItem("accessToken");
    axios
      .post("/verify-token", {
        token: accessToken,
      })
      .then((response) => {
        if (response?.data.username) {
          setUsername(response?.data.username);
        } else {
          handleLogout();
        }
      });
    axios.get("/view-code", { params: { code_id } }).then((response) => {
      if (response?.status === 200) {
        setCode(response?.data.code);
        setLanguage(response?.data.language);
        setOutput(response?.data.output);
        setTimestamp(response?.data.timestamp);
        setCodeStatus(response?.data.status);
      } else {
        navigate("/login");
      }
      setLoading(false);
    }).catch((err) => {
      console.log(err);
    });
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <div className="dark-theme">
      <div className="icon">
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
              <h6>{username}</h6>
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
      <div style={{marginBottom:"1%", marginTop:"-2%"}}>
        <u style={{ color: "burlywood" }}>
          <Link to={"/code"} className="back">
            Back to editor
          </Link>
        </u>
      </div>
      <div className="main">
        <div className="left-container">
          <Editor
            height="calc(100vh - 50px)"
            width="100%"
            theme="vs-dark"
            language={language}
            value={code}
            readOnly={true}
          />
        </div>
        <div className="right-container">
          {/* <h4>Input:</h4> */}
          <div className="input-box">
            <ListGroup>
              <ListGroupItem>
                <ListGroupItemHeading className="title">Language</ListGroupItemHeading>
                <ListGroupItemText>{language}</ListGroupItemText>
              </ListGroupItem>
              <ListGroupItem>
                <ListGroupItemHeading className="title">Submitted On</ListGroupItemHeading>
                <ListGroupItemText>{timestamp.split("T")[0]}</ListGroupItemText>
              </ListGroupItem>
              <ListGroupItem>
                <ListGroupItemHeading className="title">Status</ListGroupItemHeading>
                <ListGroupItemText>{codeStatus}</ListGroupItemText>
              </ListGroupItem>
            </ListGroup>
          </div>
          <h4>Output:</h4>
          {loading ? (
            "Loading..."
          ) : (
            <div className="output-box">
              <pre>{output}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubmittedCode;
