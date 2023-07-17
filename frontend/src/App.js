import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import 'bootstrap/dist/css/bootstrap.min.css';
import HomePage from "./Pages/Home";
import PrivateRoute from "./routes/PrivateRoute";
import Layout from "./Pages/Layout";
import LoginForm from "./Pages/LoginForm";
import Submission from "./Pages/Submission";
import SubmittedCode from "./Pages/SubmittedCode";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" Component={HomePage} />
        <Route path="/login" Component={LoginForm} />
        <Route
          path="/code"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        ></Route>
        {/* <Route index Component={HomePage}></Route> */}
        <Route path="/view-submissions" Component={Submission}></Route>
        <Route path="/view-code/:code_id" Component={SubmittedCode}></Route>
      </Routes>
    </Router>
  );
}

export default App;
