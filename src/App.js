import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Home } from "./Pages/Home";
import { Courses } from "./Pages/Course";
import { MeetingRoom } from "./Pages/Meetings";
import "./App.css"; // Custom styles

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Navigation Bar */}
        <nav className="navbar">
          <div className="navbar-logo">CourseApp</div>
          <div className="navbar-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/courses" className="nav-link">Courses</Link>
            <Link to="/meeting" className="nav-link">Meeting Room</Link>
          </div>
        </nav>

        {/* Page Content */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/meeting" element={<MeetingRoom />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="footer">
          <p>&copy; {new Date().getFullYear()} CourseApp. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
