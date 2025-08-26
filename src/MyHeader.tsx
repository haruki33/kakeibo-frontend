import { Box, Flex, Heading, Link } from "@chakra-ui/react";

const pageRoutes = {
  登録: "/",
  統計: "/MyTable",
  設定: "/MySetting",
};

type PageKey = keyof typeof pageRoutes;
const pages: PageKey[] = ["登録", "統計", "設定"];

export default function MyHeader() {
  return (
    <Box as="header" bg="white" boxShadow="sm">
      <Flex
        justify="center"
        position="fixed"
        top="0"
        left="0"
        right="0"
        bg="white"
        zIndex="1"
      >
        <Heading size="md" p="4">
          My Money
        </Heading>
      </Flex>
      <Box pt="16" zIndex="1">
        <Flex justify="space-evenly">
          {pages.map((page) => (
            <Link key={page} textStyle="sm" p="3" href={pageRoutes[page]}>
              {page}
            </Link>
          ))}
        </Flex>
      </Box>
    </Box>
  );
}
