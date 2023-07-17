import React, { useEffect, useState } from "react";
import {
  MDBBtn,
  MDBListGroup,
  MDBListGroupItem,
  MDBDropdown,
  MDBSpinner,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
} from "mdb-react-ui-kit";
import axios from "../Components/axiosConfig";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import "../Styles/Submission.css";

const Submission = (props) => {
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");

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
    axios.get("/view-submissions", { params: {} }).then((response) => {
      if (response?.status === 200) {
        setCodes(response?.data);
        setLoading(false);
      } else {
        navigate("/login");
      }
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
      <div style={{ marginBottom: "2%", marginTop: "-2%" }}>
        <u style={{ color: "burlywood" }}>
          <Link to={"/code"} className="back">
            Back to editor
          </Link>
        </u>
      </div>
      {loading ? (
        <MDBSpinner
          role="status"
          color="warning"
          style={{ marginLeft: "45%", padding: "1.5%" }}
        >
          <span className="visually-hidden">Loading...</span>
        </MDBSpinner>
      ) : (
        codes.map((code) => (
          <MDBListGroup
            style={{
              minWidth: "22rem",
              padding: "2%",
              backgroundColor: "grey",
            }}
            light
          >
            <MDBListGroupItem
              noBorders
              className="px-3"
              style={{ fontSize: "1.5rem", color: "black" }}
            >
              <b style={{ marginLeft: "3%" }}>
                {code.language} - {code.status} - {code.timestamp.split("T")[0]}
              </b>
              <MDBBtn className="btn-view">
                <Link to={`/view-code/${code._id}`} className="link">
                  View
                </Link>
              </MDBBtn>
            </MDBListGroupItem>
          </MDBListGroup>
        ))
      )}
    </div>
  );
};

export default Submission;
