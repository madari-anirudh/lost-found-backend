import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import LostItems from "./pages/LostItems";
import FoundItems from "./pages/FoundItems";
import MatchItems from "./pages/MatchItems";
import MatchedItems from "./pages/MatchedItems";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* PUBLIC */}
        <Route path="/" element={<Login />} />

        {/* PROTECTED ROUTES */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/lost"
          element={
            <ProtectedRoute>
              <LostItems />
            </ProtectedRoute>
          }
        />

        <Route
          path="/found"
          element={
            <ProtectedRoute>
              <FoundItems />
            </ProtectedRoute>
          }
        />

        <Route
          path="/match"
          element={
            <ProtectedRoute>
              <MatchItems />
            </ProtectedRoute>
          }
        />

        <Route
          path="/matched"
          element={
            <ProtectedRoute>
              <MatchedItems />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>

  );
}

export default App;