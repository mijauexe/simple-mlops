import React, { useContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Forgot from "./pages/Forgot";
import Image from "./pages/Image";
import DefaultPage from "./pages/DefaultPage";
import Navbar from "./Topbar";
import AuthContext from "./context/AuthContext";
import VerifyEmail from "./pages/VerifyEmail";

function Router() {
  const { loggedIn } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>

        {loggedIn === false && (
          <>
            <Route path="/register" element={<Register />}></Route>
            <Route path="/forgot" element={<Forgot />}></Route>
            <Route path="/" element={<Login />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/verify" element={<VerifyEmail />}></Route>
          </>
        )}
        {loggedIn === true && (
          <>
            <Route path="/" element={<Image />}></Route>
          </>
        )}
        <Route path="*" element={<DefaultPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
