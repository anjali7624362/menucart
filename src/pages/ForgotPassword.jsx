import React, { useState } from "react";
import { Link } from "react-router-dom";
import { async } from "@firebase/util";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const handleChange = (e) => {
    setEmail(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      console.log("Email Sent");
    } catch (error) {
      console.log("Email Not sent");
    }
  };
  return (
    <div className="pageContainer">
      <header>
        <p className="pageHeader">Forgot Password</p>
      </header>
      <main>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="emailInput"
            placeholder="Email"
            value={email}
            onChange={handleChange}
          />
          <Link className="forgotPasswordLink" to="/sign-in">
            SignIn
          </Link>
          <div className="signInBar">
            <div className="signInText">Send Reset Link</div>
            <button type="submit" className="signInButton">
            
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};
export default ForgotPassword;