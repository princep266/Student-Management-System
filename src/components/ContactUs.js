import React from "react";
import "./ContactUs.css";

const ContactUs = () => {
  return (
    <div className="contact-page">

      <div className="main-content">
        <h1>How would you like to contact us?</h1>
        <div className="contact-options">
          <div className="request-call">
            <h2>Request a call.</h2>
            <p>Give us some info so the right person can get back to you.</p>
            <form>
              <div className="form-group">
                <input type="text" placeholder="First name" />
                <input type="text" placeholder="Last name" />
              </div>
              <div className="form-group">
                <input type="text" placeholder="Job title" />
                <input type="email" placeholder="Email" />
              </div>
              <div className="form-group">
                <input type="tel" placeholder="Phone" />
                <select>
                  <option>United States</option>
                  <option>Canada</option>
                  <option>India</option>
                </select>
              </div>
              <div className="form-group">
                
              </div>
              <p>
                By registering, you agree to the processing of your personal
                data as described in the Privacy Statement.
              </p>
              <button type="submit">CONTACT ME</button>
            </form>
          </div>

          <div className="other-options">
            <div className="option">
              <h2>Give us a call.</h2>
              <p>91-7208327881 <br></br> 91-9004023881</p>
              <h3>Fill free to contact us !!</h3>
              
            </div>
            <div className="option">
              <h2>Chat with us.</h2>
              <p>
                Get product info, login help, and live chat with an agent.
              </p>
              <button>LET'S CHAT</button>
            </div>
            <div className="option">
              <h2>Leave us some feedback.</h2>
              <p>Good or bad, we love to hear it all.</p>
              <button>SEND FEEDBACK</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
