import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ReviewManager from "./ReviewManager";
import Dashboard from "./Dashboard";
import PlaceManage from "./PlaceManage";
import Navbar from "./Navbar";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<ReviewManager />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/placemanage" element={<PlaceManage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
