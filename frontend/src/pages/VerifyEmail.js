import { useEffect, useState, useContext } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Image from "./Image";
import AuthContext from "../context/AuthContext";

const VerifyEmail = () => {
	const navigate = useNavigate();

	const { getLoggedIn } = useContext(AuthContext);
	const { loggedIn } = useContext(AuthContext);

	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);

	// Extract query parameters
	const id = queryParams.get('id');
	const token = queryParams.get('token');

	const [validUrl, setValidUrl] = useState(false);
	
	const [errMsg, setErrMsg] = useState("")
	const [err, setErr] = useState(false)

	const navigateToLogin = async () => {
		setTimeout(()=> {
			navigate('/login');
		   }, 2000);
	}

	const navigateToImage = async (response) => {
		setTimeout(()=> {
			navigate('/', response);
		   }, 2000);
	}

	const verifyEmailUrl = async () => {
		try {
			const url = process.env.REACT_APP_API_URL + `/auth/verify`;
			const data = {
				id,
				token,
			};
			try {
				const response = await axios.post(url, data);
				console.log("123")
				console.log(response);

				if (response.status === 200) {
					setValidUrl(true)
					console.log(response.cookie)
					navigateToImage(response)
				} else {
					setErrMsg(response.data.message)
					navigateToLogin()
				}

			} catch (error) {
				console.log("sven")
				setErrMsg(error.response.data.message)
				navigateToLogin()
				console.log(error.response.data.message)
			}
		} catch (error) {
			console.log("rotim")
			console.log(error);
			setErrMsg(error)
			navigateToLogin()
		}
	};

	useEffect(() => {
		verifyEmailUrl();
	}, []);

	return (
		<div>
			{(validUrl === true) ? (
				<div>
					<h1>Email verified successfully. Redirecting to login.</h1>
				</div>
			) : (
				<div>
					<h1>{errMsg}</h1>
				</div>
			)}

			

		</div>
	);
};

export default VerifyEmail;