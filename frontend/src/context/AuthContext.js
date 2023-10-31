import axios from "axios";
import React, { createContext, useEffect, useState } from "react";

const AuthContext = createContext();

function AuthContextProvider(props) {
  const [loggedIn, setLoggedIn] = useState(false);

  async function getLoggedIn() {
    const loggedInRes = await axios.get(process.env.REACT_APP_API_URL + "/auth/loggedIn");
    console.log(loggedInRes.data)
    setLoggedIn(loggedInRes.data);
    return loggedInRes.data
  }

  useEffect(() => {
    getLoggedIn();
  }, []);

  return (
    <AuthContext.Provider value={{ loggedIn, getLoggedIn }}>
      {props.children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
export { AuthContextProvider };