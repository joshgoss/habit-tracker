import { useRecoilValue, useSetRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import { fetchAccount } from "../../auth/selectors";
import { authState } from "../../auth/atoms";
import Dropdown from "../../components/Dropdown";
import { clearAccessToken } from "../../utils/session";

function TopBar() {
	const account = useRecoilValue(fetchAccount);
	const navigate = useNavigate();
	const setRecoilState = useSetRecoilState(authState);
	return (
		<div className="flow-root py-3 mt-2 mb-3">
			<span className="float-left font-bold leading-8 text-sky-500 text-lg">
				Habit Tracker
			</span>
			<span className="float-right">
				<Dropdown className="" title={account.firstName}>
					<Dropdown.Item
						onClick={(e) => {
							e.preventDefault();
							clearAccessToken();
							setRecoilState((state) => ({
								...state,
								accessToken: null,
								expiresAt: null,
							}));
							navigate("/login");
						}}
					>
						Logout
					</Dropdown.Item>
				</Dropdown>
			</span>
		</div>
	);
}

export default TopBar;
