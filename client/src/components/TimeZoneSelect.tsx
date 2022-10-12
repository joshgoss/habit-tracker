import { selector, useRecoilValue } from "recoil";
import SelectInput from "./SelectInput";
import api from "../utils/api";

const fetchTimeZones = selector({
	key: "fetchTimeZones",
	get: async ({ get }): Promise<string[]> => {
		const response = await api.get("/timezones");
		return response.data;
	},
});

interface Props {
	label: string;
	name: string;
	register: Function;
}
const TimeZoneSelect = ({ label, name, register }: Props) => {
	const timezones = useRecoilValue(fetchTimeZones);

	return (
		<SelectInput label={label} name={name} register={register}>
			{timezones.map((t) => (
				<SelectInput.Option key={t} value={t}>
					{t}
				</SelectInput.Option>
			))}
		</SelectInput>
	);
};

export default TimeZoneSelect;
