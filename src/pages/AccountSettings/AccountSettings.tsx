import { Container, Tabs } from "@chakra-ui/react";
import Profile from "./Profile.tsx";
import Password from "./Password.tsx";

function AccountSettings() {
  return (
    <>
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
