import { Box, Flex, Heading } from "@chakra-ui/react";
import MyDrawer from "./MyDrawer";
import { type NavLinkRenderProps, NavLink } from "react-router";

const pages = [
  {
    page: "登録",
    path: "/",
  },
  {
    page: "統計",
    path: "/MyTable",
  },
];

export default function MyHeader() {
  const style = ({ isActive }: NavLinkRenderProps): React.CSSProperties => ({
    paddingBottom: "8px",
    height: "100%",
    width: "100%",
    borderBottom: isActive ? "3px solid #60A5FA" : "3px solid transparent",
    textAlign: "center" as const,
  });

  return (
    <Box as="header" bg="white" boxShadow="sm">
      <Box>
        <Flex
          justify="space-between"
          align="center"
          position="fixed"
          top="0"
          left="0"
          right="0"
          bg="white"
          zIndex="100"
        >
          <Box flex="1" />
          <Heading size="xl" p="4">
            My Money
          </Heading>
          <Flex flex="1" justifyContent="flex-end">
            <MyDrawer />
          </Flex>
        </Flex>
      </Box>

      <Box pt="16">
        <Flex justify="space-evenly">
          {pages.map((page) => (
            <NavLink key={page.page} to={page.path} style={style}>
              {page.page}
            </NavLink>
          ))}
        </Flex>
      </Box>
    </Box>
  );
}
