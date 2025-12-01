import React, { useState, useRef, useEffect } from "react";
import Header from "./components/Header";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/DashBoard";
import AdminList from "./pages/AdminList";
import AddAdmin from "./pages/AddAdmin";
import MasterList from "./pages/MasterList";
import AddDistrict from "./pages/AddDistrict";
import AddLocalBody from "./pages/AddLocalBody";
import AddWard from "./pages/AddWard";
import AddPollingStation from "./pages/AddPollingStation";
import DistrictList from "./pages/DistrictList";
import LocalBodyList from "./pages/LocalBodyList";
import WardList from "./pages/WardList";
import PollingStationList from "./pages/PollingStationList";
import ResponsiveTable from "./components/ResponsiveTable";
import NewAdminList from './pages/AdminList1'
import VotersList from "./pages/VotersList";
import AddVoters from "./pages/addVoters";
import MarkVotersMobile from "./pages/markVoter/MarkVoter";

import Login from "./Login";
import "./App.css";
import AddParty from "./pages/Party";
import PartyList from "./pages/partyList";
import VotingDay from "./pages/VotingDay";
import VotingTabs from "./pages/VotingTabs";
import Report from "./pages/report";

import { verifyToken } from "../src/api/auth";

const ProtectedRoute = ({ children }) => {
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    async function validate() {
      const isValid = await verifyToken();
      setAllowed(isValid);
      setChecking(false);
    }
    validate();
  }, []);

  if (checking) return <div>Checking session...</div>;

  if (!allowed) return <Navigate to="/" replace />;

  return children;
};


const App = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state
  const sidebarRef = useRef(null);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };
  const closeSidebar = () => setSidebarOpen(false);
  console.log('isLoggedIn', isLoggedIn);

  // ✅ Close sidebar on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) && // click not inside sidebar
        !event.target.closest(".toggle-button") // exclude toggle button
      ) {
        setSidebarOpen(false);
      }
    };

    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);


  return (
    <Router>
      <Routes>
        {/* ✅ Login route outside the layout */}
        <Route path="/" element={<Login setIsLoggedIn={setIsLoggedIn} />} />

        {/* ✅ All routes with layout */}
        <Route
          path="/*"
          element={
            <div className="app-container">
                <>
                  <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen}/>
                  <div ref={sidebarRef}>

                    <Sidebar isOpen={isSidebarOpen} closeSidebar={closeSidebar} />
                  </div>
                </>
              <div className={`content ${isSidebarOpen ? "shift" : ""}`}>
                <Routes>
                  {/* <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute isLoggedIn={isLoggedIn}>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  /> */}
                  <Route
                    path="/table"
                    element={
                      <ProtectedRoute isLoggedIn={isLoggedIn}>
                        <ResponsiveTable />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/settings"
                    element={
                      <ProtectedRoute isLoggedIn={isLoggedIn}>
                        <MasterList />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admins"
                    element={
                      <ProtectedRoute isLoggedIn={isLoggedIn}>
                        <AdminList />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/addAdmin/:id?"
                    element={
                      <ProtectedRoute isLoggedIn={isLoggedIn}>
                        <AddAdmin />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/districts"
                    element={
                      <ProtectedRoute isLoggedIn={isLoggedIn}>
                        <DistrictList />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/localBodies"
                    element={
                      <ProtectedRoute isLoggedIn={isLoggedIn}>
                        <LocalBodyList />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/addLocalBody/:id?"
                    element={
                      <ProtectedRoute isLoggedIn={isLoggedIn}>
                        <AddLocalBody />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/wards"
                    element={
                      <ProtectedRoute isLoggedIn={isLoggedIn}>
                        <WardList />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/addWard/:id?"
                    element={
                      <ProtectedRoute isLoggedIn={isLoggedIn}>
                        <AddWard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/pollingStations"
                    element={
                      <ProtectedRoute isLoggedIn={isLoggedIn}>
                        <PollingStationList />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/addPollingStation/:id?"
                    element={
                      <ProtectedRoute isLoggedIn={isLoggedIn}>
                        <AddPollingStation />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/voters"
                    element={
                      <ProtectedRoute isLoggedIn={isLoggedIn}>
                        <VotersList />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/addVoters"
                    element={
                      <ProtectedRoute isLoggedIn={isLoggedIn}>
                        <AddVoters />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/markvoter"
                    element={
                      <ProtectedRoute isLoggedIn={isLoggedIn}>
                        <MarkVotersMobile />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/addDistrict/:id?"
                    element={
                      <ProtectedRoute isLoggedIn={isLoggedIn}>
                        <AddDistrict />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/addParties/:id?"
                    element={
                      <ProtectedRoute isLoggedIn={isLoggedIn}>
                        <AddParty />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/parties"
                    element={
                      <ProtectedRoute isLoggedIn={isLoggedIn}>
                        <PartyList />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/votingDay"
                    element={
                      <ProtectedRoute isLoggedIn={isLoggedIn}>
                        <VotingTabs />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute isLoggedIn={isLoggedIn}>
                        <Report />
                      </ProtectedRoute>
                    }
                  />

                </Routes>

              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
