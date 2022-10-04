import { selectAuth } from "@/store/auth/selectors";
import { useAppSelector } from "@/store/hooks";
import { useCheckinMutation } from "@/store/queue/api";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { Text } from "@mantine/core";

const Checkin = ({ refetch }: { refetch?: () => void }) => {
	const authData = useAppSelector(selectAuth);
	const isNotTestType = authData?.information?.roomType === "Phòng khám";

	const [checkinMutation] = useCheckinMutation();

	const form = useForm({
		initialValues: {
			qrCode: "",
		},
	});

	const onSubmit = async (values: { qrCode: string }) => {
		const { qrCode } = values;
		await checkinMutation({ qrCode, isCheckupRecord: isNotTestType })
			.unwrap()
			.then(() => {
				refetch?.();
			})
			.catch(() => {
				showNotification({
					title: "Lỗi",
					message: <Text>Không tìm thấy QR. Vui lòng thử lại</Text>,
					color: "red",
				});
			})
			.finally(() => {
				form.reset();
			});
	};

	return (
		<form style={{ opacity: 0, position: "fixed" }} onSubmit={form.onSubmit(onSubmit)}>
			<input
				{...form.getInputProps("qrCode")}
				onBlur={(e) => e.currentTarget.focus()}
				autoFocus={true}
				autoComplete="off"
			/>
			<button hidden type="submit" />
		</form>
	);
};
export default Checkin;
