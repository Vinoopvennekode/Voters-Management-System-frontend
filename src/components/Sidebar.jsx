import React from "react";
import { Link } from "react-router-dom";

import "bootstrap-icons/font/bootstrap-icons.css";

const Sidebar = ({ isOpen, closeSidebar }) => {
    return (
        <>

            <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
                <ul className="list-unstyled p-3 mb-0">
                    <li className="nav-item mb-3">
                        <Link
                            to="/dashboard"
                            onClick={closeSidebar}
                            className={`nav-link text-white d-flex align-items-center ${isOpen ? "" : "justify-content-center"
                                }`}
                        >
                            <i className="bi bi-speedometer2 fs-5"></i>
                            {isOpen && <span className="ms-2">Dashboard</span>}
                        </Link>
                    </li>
                    
                    <li className="nav-item mb-3">
                        <Link
                            to="/markvoter"
                            onClick={closeSidebar}
                            className={`nav-link text-white d-flex align-items-center ${isOpen ? "" : "justify-content-center"
                                }`}
                        >
                            <i className="bi bi-gear fs-5"></i>
                            {isOpen && <span className="ms-2">Mark Voters</span>}
                        </Link>
                    </li>
                    <li className="nav-item mb-3">
                        <Link
                            to="/settings"
                            onClick={closeSidebar}
                            className={`nav-link text-white d-flex align-items-center ${isOpen ? "" : "justify-content-center"
                                }`}
                        >
                            <i className="bi bi-gear fs-5"></i>
                            {isOpen && <span className="ms-2">Settings</span>}
                        </Link>
                    </li>
                    <li className="nav-item mb-3">
                        <Link
                            to="/votingDay"
                            onClick={closeSidebar}
                            className={`nav-link text-white d-flex align-items-center ${isOpen ? "" : "justify-content-center"
                                }`}
                        >
                            <i className="bi bi-gear fs-5"></i>
                            {isOpen && <span className="ms-2">Voting Day</span>}
                        </Link>
                    </li>
                   
                </ul>
            </div>
        </>
    );
};

export default Sidebar;
