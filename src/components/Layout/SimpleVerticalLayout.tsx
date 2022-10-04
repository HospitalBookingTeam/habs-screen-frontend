import { Box, Container, Stack, useMantineTheme } from "@mantine/core";
import { ReactNode } from "react";
import SimpleHeader from "./Header";

type SimpleVerticalLayoutProps = {
	children: ReactNode;
};
const SimpleVerticalLayout = ({ children }: SimpleVerticalLayoutProps) => {
	const theme = useMantineTheme();
	return (
		<Box
			sx={{
				width: "100vw",
				height: "100vh",
				background: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[2],
			}}
		>
			<Stack sx={{ height: "100%" }}>
				<SimpleHeader />
				<Container size="xl" sx={{ width: "100%", height: "100%" }}>
					{children}
				</Container>
			</Stack>
		</Box>
	);
};
export default SimpleVerticalLayout;
