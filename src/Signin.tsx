import { Button, Card, Field, Input, Stack } from "@chakra-ui/react";
import { useAuth } from "./useAuth";
export default function Signin() {
  const { email, password, setEmail, setPassword, onLogin } = useAuth();

  return (
    <>
      <Card.Root h="100%" w="100%" variant="subtle" bg="white">
        <Card.Header>
          <Card.Title>ログイン</Card.Title>
        </Card.Header>
        <Card.Body>
          <Stack gap="4" w="full">
            <Field.Root required>
              <Field.Label>
                メールアドレス
                <Field.RequiredIndicator />
              </Field.Label>
              <Input
                placeholder="me@example.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Field.Root>

            <Field.Root required>
              <Field.Label>
                パスワード
                <Field.RequiredIndicator />
              </Field.Label>
              <Input
                placeholder="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Field.Root>
          </Stack>
        </Card.Body>
        <Card.Footer justifyContent="flex-end">
          <Button variant="solid" onClick={onLogin}>
            ログイン
          </Button>
        </Card.Footer>
      </Card.Root>
    </>
  );
}
