import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "./context/AuthContext";
import LogOutButton from "./LogOutButton";

function Topbar() {
  const { loggedIn } = useContext(AuthContext);

  return (
    <div>
      <Link to="/">Home</Link>
      {loggedIn === false && (
        <>
          <Link to="/register">Register</Link>
          <Link to="/login">Log in</Link>
        </>
      )}
      {loggedIn === true && (
        <>
          <Link to="/image">Image</Link>
          <LogOutButton />
        </>
      )}
    </div>
  );
}

export default Topbar;
