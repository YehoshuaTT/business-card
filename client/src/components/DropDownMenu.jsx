import * as React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export default function DropDownMenu({ authorized, setAuthorized }) {
  const navigate = useNavigate();
  return (
    <PopupState variant="popover" popupId="demo-popup-menu">
      {(popupState) => (
        <>
          <AccountCircleIcon
            className="user-icon"
            style={{ marginLeft: "10%" }}
            fontSize="large"
            color="primary"
            {...bindTrigger(popupState)}
          />
          <Menu {...bindMenu(popupState)}>
            <MenuItem
              onClick={() => {
                popupState.close();
                navigate("/login");
              }}
            >
              Login
            </MenuItem>
            <MenuItem
              onClick={() => {
                popupState.close();
                Cookies.set("userId", "bla");
                setAuthorized(false);
                navigate("/");
              }}
            >
              Logout
            </MenuItem>
            {authorized && (
              <MenuItem
                onClick={() => {
                  popupState.close();
                  navigate("/create");
                }}
              >
                Creat card
              </MenuItem>
            )}
          </Menu>
        </>
      )}
    </PopupState>
  );
}
