import { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const VerifyEmail = () => {
	const navigate = useNavigate();

	const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

	// Extract query parameters
	const id = queryParams.get('id');
	const token = queryParams.get('token');

	const [validUrl, setValidUrl] = useState(true);
	const param = useParams();

	useEffect(() => {
		const verifyEmailUrl = async () => {
			try {

				const url = process.env.REACT_APP_API_URL + `/auth/verify`;

				const data = {
					id,
					token,
				  };

				try {
					const response = await axios.post(url, data);
					// Handle the response data here
					console.log(response);

				} catch (error) {
					console.log(error)
				}
				setValidUrl(true);

				const delay = 3000;

				const navigateWithDelay = setTimeout(() => {
					//navigate(`/login?token=${param.token}`)
					//navigate("/login")
				}, delay);

			} catch (error) {
				console.log(error);
				setValidUrl(false);
			}
		};
		verifyEmailUrl();
	}, [param]);

	return (
		<div>
			{validUrl ? (
				<div>
					<h1>Email verified successfully. You can log in now.</h1>
					<Link to="/login">
						<button >Login</button>
					</Link>
				</div>
			) : (
				<h1>404 Not Found</h1>
			)}
		</div>
	);
};

export default VerifyEmail;