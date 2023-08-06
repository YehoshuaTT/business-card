import Cookies from "js-cookie";
import React from "react";
import { GoogleLoginButton } from "react-social-login-buttons";

function GoogleButton({ authorized, setAuthorized }) {
  const googleButtonBehavier = async () => {
    if (authorized) {
      Cookies.remove("userId");
      setAuthorized(false);
    } else {
      window.location.href = "http://localhost:4000/auth/google";
      if (Cookies.get("userId")) setAuthorized(true);
    }
  };
  return (
    <div style={{ width: authorized ? "300px" : "450px", marginRight: "10%" }}>
      <GoogleLoginButton
        align="center"
        iconSize="50px"
        text={authorized ? "Logout" : "Continue with Google"}
        id={authorized ? "google-header-login" : "google-header"}
        onClick={googleButtonBehavier}
      ></GoogleLoginButton>
    </div>
  );
}

export default GoogleButton;
