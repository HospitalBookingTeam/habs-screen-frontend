import { TestDetail } from "@/entities/queue";
import { CheckupRecordStatus, translateTestRecordStatus } from "@/utils/renderEnums";
import { Badge, Text, Center, ScrollArea, useMantineTheme, Grid, Loader, Stack } from "@mantine/core";

interface QueueTableProps {
	data?: TestDetail[];
	isLoading?: boolean;
}

const statusColors: Record<number, string> = {
	[CheckupRecordStatus.CHECKED_IN]: "green",
	[CheckupRecordStatus.DANG_KHAM]: "cyan",
	[CheckupRecordStatus.CHECKED_IN_SAU_XN]: "pink",
};

const TestQueueTable = ({ data, isLoading }: QueueTableProps) => {
	const theme = useMantineTheme();

	const rows = data?.map((item, index) => {
		const isEven = index % 2 === 0;

		return (
			<Grid key={item.id} sx={{ backgroundColor: isEven ? "white" : theme.colors.gray[0], width: "100%" }} py="sm">
				<Grid.Col span={2} sx={{ textAlign: "center" }}>
					{item.numericalOrder}
				</Grid.Col>
				<Grid.Col span={4}>
					<Text size="sm" weight={500}>
						{item.patientName}
					</Text>
				</Grid.Col>
				<Grid.Col span={4}>
					<Text>{item.operationName}</Text>
				</Grid.Col>

				<Grid.Col span={2} sx={{ textAlign: "center" }}>
					<Badge color={statusColors[item.status]} variant={theme.colorScheme === "dark" ? "light" : "outline"}>
						{translateTestRecordStatus(item.status)}
					</Badge>
				</Grid.Col>
			</Grid>
		);
	});

	return (
		<>
			<Grid color="gray.1" pb="md" sx={{ width: "100%" }}>
				<Grid.Col span={2} sx={{ textAlign: "center" }}>
					Số khám bệnh
				</Grid.Col>
				<Grid.Col span={4}>Tên người bệnh</Grid.Col>
				<Grid.Col span={4}>
					<Text>Tên xét nghiệm</Text>
				</Grid.Col>
				<Grid.Col span={2} sx={{ textAlign: "center" }}>
					Trạng thái
				</Grid.Col>
			</Grid>
			<ScrollArea.Autosize maxHeight={"calc(100vh - 160px)"}>
				<Center
					sx={{
						height: 100,
						width: "100%",
						display: isLoading ? "flex" : "none",
					}}
				>
					<Loader size="lg" />
				</Center>
				<Stack sx={{ width: "100%" }} mt="sm">
					{rows}
				</Stack>
			</ScrollArea.Autosize>
		</>
	);
};

export default TestQueueTable;
