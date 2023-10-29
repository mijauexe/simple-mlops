import React, { useEffect, useState, useContext } from 'react'
import jwt_decode from 'jwt-decode'
import { useNavigate } from 'react-router-dom'
import axios from "axios";

const api = process.env.REACT_APP_API_URL;

const Dashboard = () => {

    useEffect(() => {
        try {
            axios
          .get(process.env.REACT_APP_API_URL + "/dashboard", { withCredentials: true })
          .then((response) => {
            console.log(response)
            //setMovies(response.data);
          });
        } catch(err) {
            console.log(err)
        }
      }, []);

    return (
        <div>
            gas
        </div>
    )
}

export default Dashboard