import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const DefaultPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
			navigate('/');
		}, 2000);
  }, []);
    return <h1>Page not found. Redirecting...</h1>;
  };
  
  export default DefaultPage;