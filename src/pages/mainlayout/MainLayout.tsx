import { Box, Center, Flex, Heading } from "@chakra-ui/react";
import { type NavLinkRenderProps, NavLink, Outlet } from "react-router";
import {
  AiOutlineCalendar,
  AiOutlineTable,
  AiOutlineUser,
} from "react-icons/ai";

const pages = [
  {
    page: "登録",
    path: "/MyRegister",
    icon: <AiOutlineCalendar size={25} />,
  },
  {
    page: "テーブル",
    path: "/MyTable",
    icon: <AiOutlineTable size={25} />,
  },
  {
    page: "アカウント",
    path: "/AccountSettings",
    icon: <AiOutlineUser size={25} />,
  },
];

const style = ({ isActive }: NavLinkRenderProps): React.CSSProperties => ({
  padding: "5px",
  flex: 1,
  borderTop: isActive ? "3px solid #c5ecca" : "3px solid transparent",
});

export default function MainLayout() {
  return (
    <Box bg="gray.200" minH="100vh" minW="100vw">
      <Box as="header" bg="white" boxShadow="sm">
        <Heading p="4">My Money</Heading>
      </Box>
      <Box as="main" minH="calc(100vh - 64px - 5vh)">
        <Outlet />
      </Box>
      <Flex
        justify="space-evenly"
        bg="white"
        boxShadow="sm"
        position="fixed"
        bottom="0"
        width="100vw"
        height="5vh"
        zIndex="100"
      >
        {pages.map((page) => (
          <NavLink key={page.page} to={page.path} style={style}>
            <Center>{page.icon}</Center>
          </NavLink>
        ))}
      </Flex>
    </Box>
  );
}
