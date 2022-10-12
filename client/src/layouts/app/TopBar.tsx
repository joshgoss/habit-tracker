import { useRecoilValue, useSetRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import { fetchAccount } from "../../account/selectors";
import { authState } from "../../auth/atoms";
import { Dropdown } from "../../components";
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
				<Dropdown className="">
					<Dropdown.Button>{account.firstName}</Dropdown.Button>
					<Dropdown.Items>
						<Dropdown.Item
							onClick={(e) => {
								e.preventDefault();
								navigate("/settings");
							}}
						>
							Settings
						</Dropdown.Item>
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
					</Dropdown.Items>
				</Dropdown>
			</span>
		</div>
	);
}

export default TopBar;
