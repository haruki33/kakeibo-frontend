import { Box, Flex, Heading, Link } from "@chakra-ui/react";
import MyDrawer from "./MyDrawer";
import { useNavigate } from "react-router-dom";

const pageRoutes = {
  登録: "/",
  統計: "/MyTable",
};

type PageKey = keyof typeof pageRoutes;
const pages: PageKey[] = ["登録", "統計"];

export default function MyHeader() {
  const navigate = useNavigate();

  return (
    <Box as="header" bg="white" boxShadow="sm">
      <Flex
        justify="space-between"
        align="center"
        position="fixed"
        top="0"
        left="0"
        right="0"
        bg="white"
        zIndex="1"
      >
        <Box flex="1" />
        <Heading size="md" p="4">
          My Money
        </Heading>
        <Flex flex="1" justifyContent="flex-end">
          <MyDrawer />
        </Flex>
      </Flex>
      <Box pt="16" zIndex="1">
        <Flex justify="space-evenly">
          {pages.map((page) => (
            <Link
              key={page}
              textStyle="sm"
              p="3"
              onClick={() => navigate(pageRoutes[page])}
            >
              {page}
            </Link>
          ))}
        </Flex>
      </Box>
    </Box>
  );
}
