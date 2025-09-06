import { Outlet } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import MyHeader from "./MyHeader";

export default function MainLayout() {
  return (
    <>
      <Box bg="gray.200" minH="100vh">
        <MyHeader />
        <Outlet />
      </Box>
    </>
  );
}
