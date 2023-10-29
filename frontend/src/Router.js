import React, { useContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Image from "./pages/Image";
import Navbar from "./Topbar";
import AuthContext from "./context/AuthContext";
import Home from "./pages/Home";
import VerifyEmail from "./pages/VerifyEmail";

function Router() {
  const { loggedIn } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>

        <Route path="/" element={<Home />}></Route>

        {loggedIn === false && (
          <>
            <Route path="/register" element={<Register />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/verify" element={<VerifyEmail />}></Route>

          </>
        )}
        {loggedIn === true && (
          <>
            <Route path="/image" element={<Image />}></Route>
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
