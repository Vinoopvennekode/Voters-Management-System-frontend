import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Header = ({ toggleSidebar, isSidebarOpen }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/", { replace: true });
  };

  return (
    <nav className="navbar navbar-dark bg-primary px-3 fixed-top d-flex justify-content-between">
      <div className="d-flex align-items-center">
        {!isSidebarOpen && < button className="btn btn-outline-light me-2" onClick={toggleSidebar}>
          <i className="bi bi-list"></i>
        </button>}
        {/* <span className="navbar-brand mb-0 h1">Dashboard</span> */}
      </div>

      {
        user && (
          <div className="text-white d-flex align-items-center gap-4">
            <div>
              <strong>Mobile:</strong> {user.mobile}
            </div>
            <div>
              <strong>Role:</strong> {user.role}
            </div>

            <button
              className="btn btn-danger btn-sm px-3 py-1 rounded-pill fw-semibold shadow-sm"
              onClick={logout}
            >
              Logout
            </button>

          </div>
        )
      }
    </nav >
  );
};

export default Header;
