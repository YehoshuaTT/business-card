import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import DropDownMenu from "./DropDownMenu";
import GoogleButton from "./GoogleButton";
import { useLocation } from "react-router-dom";

function Header({ authorized, setAuthorized }) {
  const [showGoogleButton, setShowGoogleButton] = useState(true);
  const location = useLocation();
  useEffect(() => {
    const currentPath = location.pathname;
    if (currentPath === "/login/register" || currentPath === "/login")
      setShowGoogleButton(false);
  }, [location]);

  return (
    <div className="header">
      <DropDownMenu setAuthorized={setAuthorized} authorized={authorized} />
      <Typography
        align="center"
        width="99%"
        marginLeft={showGoogleButton ? "8%" : "-10%"}
        variant="h1"
      >
        Business Cards
      </Typography>
      {showGoogleButton && (
        <GoogleButton authorized={authorized} setAuthorized={setAuthorized} />
      )}
    </div>
  );
}

export default Header;
