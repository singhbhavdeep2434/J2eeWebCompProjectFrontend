import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/DashboardPage.css";
import NavBar from "../NavBars/NavBar";

const DashboardPage = () => {
  const navigate = useNavigate();

  const parseJwt = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Error parsing JWT:", error);
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return;
    }

    const decodedToken = parseJwt(token);
    if (!decodedToken || Date.now() >= decodedToken.exp * 1000) {
      localStorage.removeItem("authToken");
      navigate("/login");
    }
  }, [navigate]);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <div>
      <NavBar handleLogout={handleLogout} />

      <div className="container mt-5">
        <div className="text-center">
          <p className="lead text-secondary">
            Simplify your tasks and manage the system effortlessly. Select an option below to get started.
          </p>
        </div>

        <div className="row mt-4">
          <div className="col-md-4 mb-3">
            <button
              onClick={() => handleNavigation("/signup")}
              className="btn btn-primary w-100 py-3"
            >
              <i className="bi bi-person-plus"></i> Create User
            </button>
          </div>
          <div className="col-md-4 mb-3">
            <button
              onClick={() => handleNavigation("/show-users")}
              className="btn btn-success w-100 py-3"
            >
              <i className="bi bi-people"></i> Show All Users
            </button>
          </div>
          <div className="col-md-4 mb-3">
            <button
              onClick={() => handleNavigation("/create-course")}
              className="btn btn-warning w-100 py-3"
            >
              <i className="bi bi-journal-plus"></i> Create Course
            </button>
          </div>
          <div className="col-md-4 mb-3">
            <button
              onClick={() => handleNavigation("/courses")}
              className="btn btn-info w-100 py-3"
            >
              <i className="bi bi-journal-text"></i> Show All Courses
            </button>
          </div>
          <div className="col-md-4 mb-3">
            <button
              onClick={() => handleNavigation("/show-enrollments")}
              className="btn btn-danger w-100 py-3"
            >
              <i className="bi bi-card-list"></i> Show All Enrollments
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
