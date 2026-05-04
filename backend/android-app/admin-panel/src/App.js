import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import LostItems from "./pages/LostItems";
import FoundItems from "./pages/FoundItems";
import MatchItems from "./pages/MatchItems";
import MatchedItems from "./pages/MatchedItems";
function App(){

  return(

    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Login/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/lost" element={<LostItems/>} />
        <Route path="/found" element={<FoundItems/>} />
        <Route path="/match" element={<MatchItems/>} />
        <Route path="/matched" element={<MatchedItems/>} />
      </Routes>

    </BrowserRouter>

  );

}

export default App;