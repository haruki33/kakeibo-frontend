import { Outlet } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import MyHeader from "./MyHeader";

export default function Layout() {
  return (
    <Box bg="gray.200" minH="110vh">
      <MyHeader />
      <Outlet />
    </Box>
  );
}
