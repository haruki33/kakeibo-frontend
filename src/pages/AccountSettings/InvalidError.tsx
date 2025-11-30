import { Alert } from "@chakra-ui/react";

export default function InvalidAlert() {
  return (
    <Alert.Root status="error" mb={4}>
      <Alert.Indicator />
      <Alert.Content>
        <Alert.Title>パスワードが違います</Alert.Title>
      </Alert.Content>
    </Alert.Root>
  );
}
