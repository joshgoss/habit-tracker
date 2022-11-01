import Header from "../layouts/login/Header";
import { Button } from "../components";

function LoginPage() {
	return (
		<>
			<Header>Login</Header>
			<div className="flex flex-col items-center content-start">
				<Button
					className="w-64 mb-4"
					centered
					icon="fa-brands fa-google"
					onClick={() => {
						window.location.href = `${process.env.REACT_APP_API_URL}/auth/google`;
					}}
				>
					Login with Google
				</Button>
			</div>
		</>
	);
}

export default LoginPage;
