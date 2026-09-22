import React, { useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";

import Login from "./components/Login";
import AdminDashboard from "./components/admin/AdminDashboard";
import UserDashboard from "./components/user/UserDashboard";

export default function App() {
  const navigate = useNavigate();

  /*
   * IMPORTANT:
   * sessionStorage use kiya gaya hai.
   *
   * localStorage mat use karna.
   *
   * sessionStorage har browser TAB ka separate storage hota hai.
   * Isliye:
   *
   * Tab 1 -> ADMIN
   * Tab 2 -> USER
   *
   * dono independent rahenge.
   */

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = sessionStorage.getItem("currentUser");

      if (!savedUser) {
        return null;
      }

      const parsedUser = JSON.parse(savedUser);

      // Basic validation
      if (!parsedUser || !parsedUser.role) {
        sessionStorage.removeItem("currentUser");
        return null;
      }

      return parsedUser;
    } catch (error) {
      console.error("Error restoring login session:", error);

      sessionStorage.removeItem("currentUser");

      return null;
    }
  });

  /*
   * ============================
   * LOGIN SUCCESS
   * ============================
   */
  const handleLoginSuccess = (userData) => {
    try {
      if (!userData) {
        console.error("Login successful but user data is missing.");
        return;
      }

      if (!userData.role) {
        console.error("User role is missing from login response.");
        return;
      }

      // React state update
      setCurrentUser(userData);

      // Current TAB mein user session save karo
      sessionStorage.setItem(
        "currentUser",
        JSON.stringify(userData)
      );

      // Role ke according redirect
      if (userData.role === "ADMIN") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/user/dashboard", { replace: true });
      }
    } catch (error) {
      console.error("Login session save error:", error);
    }
  };

  /*
   * ============================
   * LOGOUT
   * ============================
   */
  const handleLogout = () => {
    // Current tab ka React state clear
    setCurrentUser(null);

    // Sirf current TAB ka session clear hoga
    sessionStorage.removeItem("currentUser");

    // Login page
    navigate("/login", { replace: true });
  };

  /*
   * ============================
   * RENDER ROUTES
   * ============================
   */

  return (
    <Routes>

      {/* =========================
          NOT LOGGED IN
          ========================= */}
      {!currentUser ? (
        <>
          <Route
            path="/login"
            element={
              <Login
                onLoginSuccess={handleLoginSuccess}
              />
            }
          />

          <Route
            path="*"
            element={
              <Navigate
                to="/login"
                replace
              />
            }
          />
        </>
      ) : currentUser.role === "ADMIN" ? (

        /* =========================
           ADMIN ROUTES
           ========================= */
        <>
          <Route
            path="/admin"
            element={
              <Navigate
                to="/admin/dashboard"
                replace
              />
            }
          />

          <Route
            path="/admin/dashboard"
            element={
              <AdminDashboard
                user={currentUser}
                onLogout={handleLogout}
              />
            }
          />

          <Route
            path="/admin/stocks"
            element={
              <AdminDashboard
                user={currentUser}
                onLogout={handleLogout}
              />
            }
          />

          <Route
            path="/admin/users"
            element={
              <AdminDashboard
                user={currentUser}
                onLogout={handleLogout}
              />
            }
          />

          <Route
            path="/admin/reports"
            element={
              <AdminDashboard
                user={currentUser}
                onLogout={handleLogout}
              />
            }
          />

          {/* Agar Admin user route manually open kare */}
          <Route
            path="/user/*"
            element={
              <Navigate
                to="/admin/dashboard"
                replace
              />
            }
          />

          {/* Unknown admin route */}
          <Route
            path="*"
            element={
              <Navigate
                to="/admin/dashboard"
                replace
              />
            }
          />
        </>

      ) : (

        /* =========================
           USER ROUTES
           ========================= */
        <>
          <Route
            path="/user/dashboard"
            element={
              <UserDashboard
                user={currentUser}
                onLogout={handleLogout}
              />
            }
          />

          {/* Agar User admin route manually open kare */}
          <Route
            path="/admin/*"
            element={
              <Navigate
                to="/user/dashboard"
                replace
              />
            }
          />

          {/* Unknown user route */}
          <Route
            path="*"
            element={
              <Navigate
                to="/user/dashboard"
                replace
              />
            }
          />
        </>
      )}

    </Routes>
  );
}

