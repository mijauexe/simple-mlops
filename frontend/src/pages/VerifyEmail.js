import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const VerifyEmail = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);

	// Extract query parameters
	const id = queryParams.get('id');
	const token = queryParams.get('token');

	const [validUrl, setValidUrl] = useState(false);

	const [errMsg, setErrMsg] = useState("")
	const [err, setErr] = useState(false)

	const navigateToLogin = async () => {
		setTimeout(() => {
			navigate('/login');
		}, 2000);
	}

	const navigateToImage = async (response) => {
		setTimeout(() => {
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
				if (response.status === 200) {
					setValidUrl(true)
					navigateToImage(response)
				} else {
					setErrMsg(response.data.message)
					navigateToLogin()
				}

			} catch (error) {
				try {
					setErrMsg(error.response.data.message)
				} catch(error) {
					setErr(true)
					setErrMsg("You have entered an invalid link. Redirecting to login.")
				}
				navigateToLogin()
			}
		} catch (error) {
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
					{err ? <h1>{errMsg}</h1> : <h1>Error.</h1>}
				</div>
			)}
		</div>
	);
};

export default VerifyEmail;