import { Box, Flex, VStack } from "@chakra-ui/react";
import { Outlet, NavLink, type NavLinkRenderProps } from "react-router";

const loginPages = [
  { page: "ログイン", path: "/" },
  { page: "新規登録", path: "/signup" },
];

export default function LoginLayout() {
  const style = ({ isActive }: NavLinkRenderProps): React.CSSProperties => ({
    paddingBottom: "8px",
    height: "100%",
    width: "100%",
    borderBottom: isActive ? "3px solid #c5ecca" : "3px solid transparent",
    textAlign: "center" as const,
  });

  return (
    <>
      <Box
        width="100vw"
        height="100vh"
        bg="gray.100"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <VStack>
          <Box
            bg="white"
            w={{ base: "80vw", md: "40vw" }}
            h={{ base: "50vh", md: "65vh" }}
            boxShadow="lg"
          >
            <Box>
              <Flex
                justify="space-evenly"
                textAlign="center"
                alignItems="center"
                h="100%"
                p="4"
              >
                {loginPages.map((loginPage) => (
                  <NavLink
                    key={loginPage.path}
                    to={loginPage.path}
                    style={style}
                  >
                    {loginPage.page}
                  </NavLink>
                ))}
              </Flex>
            </Box>
            <Box>
              <Outlet />
            </Box>
          </Box>
          {/* <Link to="AccountSettings/Password">
            パスワードをお忘れの方はこちら
          </Link> */}
        </VStack>
      </Box>
    </>
  );
}
