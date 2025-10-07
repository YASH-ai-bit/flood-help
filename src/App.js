import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage";
import FloodPredictionPage from "./components/FloodPredictionPage";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/flood_prediction" element={<FloodPredictionPage />} />
      </Routes>
    </Router>
  );
}

export default App;
