import React from "react";
import { Route, Routes } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import Profile from "./components/Profile";
import AudioRecorder from "./components/AudioRecorder";

function App() {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/audiorecorder" element={<AudioRecorder />} />
      <Route path="/" element={<Home />} />
    </Routes>
  );
}

export default App;
