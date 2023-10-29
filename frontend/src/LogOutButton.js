import axios from "axios";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "./context/AuthContext";

function LogOutButton() {
  const { getLoggedIn } = useContext(AuthContext);

  const navigate = useNavigate();

  async function logOut() {
    await axios.get(process.env.REACT_APP_API_URL + "/auth/logout/");

    await getLoggedIn();
    navigate("/");
  }

  return <button onClick={logOut}>Log out</button>;
}

export default LogOutButton;
