import { Suspense } from "react";
import { useSetRecoilState } from "recoil";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Header } from "../layouts/app";
import { Button, TimeZoneSelect } from "../components";
import api from "../utils/api";
import { forceAccountRefresh } from "../account/atoms";

const SettingsPage = () => {
	const {
		register,
		handleSubmit,
		formState: { isValid, isSubmitting },
	} = useForm({
		mode: "onChange",
		defaultValues: { timezone: "America/New_York" },
	});
	const navigate = useNavigate();
	const setForceAccountRefresh = useSetRecoilState(forceAccountRefresh);
	const onSubmit = async (data: any) => {
		await api.put("/auth/me", data);
		setForceAccountRefresh((n) => n + 1);
		navigate("/");
	};

	return (
		<>
			<Header>Settings</Header>
			<form className="p-2 mt-3" onSubmit={handleSubmit(onSubmit)}>
				<Suspense fallback={<p>loading...</p>}>
					<TimeZoneSelect
						label="Time Zone"
						name="timezone"
						register={register}
					/>
				</Suspense>

				<div className="flow-root mt-5">
					<Button
						className="float-right"
						disabled={!isValid}
						loading={isSubmitting}
						type="submit"
					>
						Save Settings
					</Button>
				</div>
			</form>
		</>
	);
};

export default SettingsPage;
