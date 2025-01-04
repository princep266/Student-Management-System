// File: src/App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom"; 
import "./App.css";
import Login from "./login"; 
import Admin from "./Admin";
import StudentDashboard from "./components/StudentDashboard"; 
import StudentAssignment from './components/StudentAssignment';
import AssignmentsSection from "./components/AssignmentsSection";

const App = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  return (
    <Router>
      <header>
        <nav className="navbar">
          <div className="navbar-logo">Prince</div>
          <ul className={`nav-links ${isMobileMenuOpen ? "open" : ""}`}>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li className="dropdown" onMouseEnter={toggleDropdown} onMouseLeave={toggleDropdown}>
              <a href="#programs">Programs</a>
              {isDropdownOpen && (
                <ul className="dropdown-menu">
                  <li><a href="#corporate">Corporate</a></li>
                  <li><a href="#one-to-one">One to One</a></li>
                  <li><a href="#consulting">Consulting</a></li>
                </ul>
              )}
            </li>
            <li><a href="#service">Service</a></li>
            <li><a href="#contact">Contact</a></li>
            <li>
              <Link to="/login">
                <button className="cta-button">Login / Sign Up</button>
              </Link>
            </li>
          </ul>
          <div className="hamburger" onClick={toggleMobileMenu}>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={
          <>
            <div className="hero-section">
              <div className="hero-image">
                <img src="https://cdn.pixabay.com/photo/2022/09/14/01/42/girl-7453178_1280.png" alt="Hero" />
              </div>
              <div className="hero-container">
                <h1>Student Management System</h1>
                <p>Your complete solution for managing students effectively and efficiently.</p>
                <ul className="feature-list">
                  <li>📚 Student Registration and Enrollment</li>
                  <li>📝 Attendance Tracking</li>
                  <li>📊 Grades and Report Generation</li>
                  <li>📅 Scheduling and Timetable Management</li>
                  <li>🔒 Secure Data Management</li>
                </ul>
                <Link to="/login">
                  <button className="cta-button">Get Started Now</button>
                </Link>
              </div>
            </div>

            {/* About Section */}
            <section className="about-section">
              <h2>About Us</h2>
              <p>Our system is designed to provide a comprehensive solution for managing students efficiently, streamlining administrative tasks, and enhancing educational outcomes.</p>
            </section>

            {/* Features Section */}
            <section className="features-section">
              <h2>Key Features</h2>
              <div className="feature-grid">
                <div className="feature-item">
                  <h3>📚 Comprehensive Student Profiles</h3>
                  <p>Manage student information, enrollment, and academic progress with ease.</p>
                </div>
                <div className="feature-item">
                  <h3>📝 Attendance and Reporting</h3>
                  <p>Track student attendance and generate real-time reports.</p>
                </div>
                <div className="feature-item">
                  <h3>🔒 Secure Data Handling</h3>
                  <p>Your data is safe and secured with state-of-the-art encryption.</p>
                </div>
              </div>
            </section>

            {/* Testimonials Section */}
            <section className="testimonials-section">
              <h2>What Our Users Say</h2>
              <div className="testimonials-container">
                <div className="testimonial">
                  <p>"This system has revolutionized our school management!"</p>
                  <span>- John Doe, Principal</span>
                </div>
                <div className="testimonial">
                  <p>"Easy to use and manage, highly recommended for educational institutions."</p>
                  <span>- Jane Smith, Teacher</span>
                </div>
                <div className="testimonial">
                  <p>"Easy to use and manage, highly recommended for educational institutions."</p>
                  <span>- Jane Smith, Teacher</span>
                </div>
              </div>
            </section>

            { }
            <section className="team-section">
              <h2>Meet the Team</h2>
              <p>Our team of experts is here to support you at every step of your journey.</p>
              <div className="team-grid">
                <div className="team-member">
                  <h3>Prince Prajapati</h3>
                  <p>Founder & CEO</p>
                </div>
                
              </div>
            </section>

            { }
            <section className="cta-section">
              <h2>Ready to Get Started?</h2>
              <p>Join thousands of schools and institutions already using our system to streamline their processes.</p>
              <Link to="/login">
                <button className="cta-button">Create an Account</button>
              </Link>
            </section>

            <footer>
              <div className="footer-container">
                <div className="footer-column">
                  <h4>Programs</h4>
                  <ul>
                    <li>Corporate</li>
                    <li>One to One</li>
                    <li>Consulting</li>
                  </ul>
                </div>
                <div className="footer-column">
                  <h4>Service</h4>
                  <ul>
                    <li>Training</li>
                    <li>Coaching</li>
                    <li>Consulting</li>
                  </ul>
                </div>
                <div className="footer-column">
                  <h4>Contact</h4>
                  <ul>
                    <li>Home</li>
                    <li>About</li>
                    <li>Contact</li>
                  </ul>
                </div>
                <div className="footer-column newsletter">
                  <h4>Newsletter</h4>
                  <form>
                    <input type="email" placeholder="Email Address" />
                    <button type="submit">Subscribe</button>
                  </form>
                </div>
              </div>
              <div className="footer-bottom">
                <p>&copy; 2024 Prince Prajapati. All rights reserved.</p>
              </div>
            </footer>
          </>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/assignments" element={<AssignmentsSection />} /> {  }
        <Route path="/admin/*" element={<Admin />} /> { }
      </Routes>
    </Router>
  );
};

export default App;
