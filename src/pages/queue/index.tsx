import { QueueTable, TestQueueTable } from "@/components/Table";
import { selectAuth } from "@/store/auth/selectors";
import { useAppSelector } from "@/store/hooks";
import { useGetQueueQuery, useGetTestQueueQuery } from "@/store/queue/api";
import { Stack, Paper } from "@mantine/core";
import Checkin from "./Checkin";

const Queue = () => {
	const authData = useAppSelector(selectAuth);
	const isNotTestType = authData?.information?.roomType === "Phòng khám";

	const { data, isLoading, refetch } = useGetQueueQuery(undefined, {
		refetchOnFocus: true,
		skip: !isNotTestType,
	});
	const { data: testData, isLoading: isLoadingTest, refetch: refetchTest } = useGetTestQueueQuery(undefined, {
		refetchOnFocus: true,
		skip: isNotTestType,
	});

	return (
		<Stack sx={{ height: "100%" }}>
			<Paper p="md" sx={{ height: "100%" }}>
				{isNotTestType ? (
					<QueueTable data={data} isLoading={isLoading} />
				) : (
					<TestQueueTable data={testData} isLoading={isLoadingTest} />
				)}
			</Paper>
			<Checkin refetch={isNotTestType ? refetch : refetchTest} />
		</Stack>
	);
};
export default Queue;
