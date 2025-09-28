import { Card, Field, Input, Stack } from "@chakra-ui/react";
import { useState } from "react";
import { useAuth } from "../../utils/useAuth";
import PositiveButton from "@/components/PositiveButton";

export default function Signin() {
  const { email, password, setEmail, setPassword, onLogin } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async () => {
    setLoading(true);
    await onLogin();
    setLoading(false);
  };

  return (
    <>
      <Card.Root h="100%" w="100%" variant="subtle" bg="white">
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
          <PositiveButton
            loading={loading}
            onClick={handleLogin}
            loadingText="ログイン中..."
            buttonText="ログイン"
          />
        </Card.Footer>
      </Card.Root>
    </>
  );
}
