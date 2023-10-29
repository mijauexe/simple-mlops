import axios from "axios";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordVerify, setPasswordVerify] = useState("");

    const { getLoggedIn } = useContext(AuthContext);
    const navigate = useNavigate();

    async function register(e) {
        e.preventDefault();

        try {
            const registerData = {
                email: email,
                password: password,
                passwordVerify: passwordVerify,
            };

            await axios.post(process.env.REACT_APP_API_URL + "/auth/", registerData);

            //await getLoggedIn();
            //navigate("/");
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div>
            <h1>Register a new account</h1>
            <form onSubmit={register}>
                <input
                    type="email"
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                />
                <input
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                />
                <input
                    type="password"
                    placeholder="Verify your password"
                    onChange={(e) => setPasswordVerify(e.target.value)}
                    value={passwordVerify}
                />
                <button type="submit">Register</button>
            </form>
        </div>
    );
}

export default Register;
