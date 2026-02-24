import { Box, Container, Heading, Tabs, VStack } from "@chakra-ui/react";
import { Link } from "react-router";
import { useAuth } from "../../utils/useAuth";
import Profile from "./Profile.tsx";
import Password from "./Password.tsx";

function AccountSettings() {
  const { onLogout } = useAuth();

  const menu = [
    {
      title: "管理",
      children: [{ label: "カテゴリー", path: "/MySetting" }],
    },
  ];
  return (
    <>
      <Container>
        <VStack pt="24" pl="16" align="flex-start" gap="8">
          {menu.map((item, index) => (
            <Box key={index}>
              <Heading size={{ base: "lg", md: "xl" }}>{item.title}</Heading>
              {item.children && (
                <VStack pt="1">
                  {item.children.map((child, idx) => (
                    <Link key={idx} to={child.path}>
                      {child.label}
                    </Link>
                  ))}
                </VStack>
              )}
            </Box>
          ))}
          <Box>
            <Link to="/" onClick={onLogout}>
              <Heading size={{ base: "lg", md: "xl" }}>ログアウト</Heading>
            </Link>
          </Box>
        </VStack>
      </Container>
      <Container p={8}>
        <Tabs.Root defaultValue="Profile">
          <Tabs.List>
            <Tabs.Trigger value="Profile">Profile</Tabs.Trigger>
            <Tabs.Trigger value="Password">Password</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="Profile">
            <Profile />
          </Tabs.Content>
          <Tabs.Content value="Password">
            <Password />
          </Tabs.Content>
        </Tabs.Root>
      </Container>
    </>
  );
}
export default AccountSettings;
