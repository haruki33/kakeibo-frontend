import { Button, Card, Field, Input, Stack } from "@chakra-ui/react";
import { useState } from "react";
import type { Signup } from "./components/types/login.ts";

export default function Signup() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleClick = async () => {
    const signup: Signup = {
      name,
      email,
      password,
    };

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      const res = await fetch(`${baseUrl}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signup),
      });
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Response status:", res.status);
        console.error("Response body:", errorText);
        throw new Error(
          `Failed to create transaction: ${res.status} - ${errorText}`
        );
      }
      const createdSignup = await res.json();
      console.log(createdSignup);
    } catch (error) {
      console.error("Error creating signup:", error);
    } finally {
      setName("");
      setEmail("");
      setPassword("");
    }
  };

  return (
    <>
      <Card.Root h="100%" w="100%" variant="subtle" bg="white">
        <Card.Header>
          <Card.Title>新規登録</Card.Title>
        </Card.Header>
        <Card.Body>
          <Stack gap="4" w="full">
            <Field.Root required>
              <Field.Label>
                名前
                <Field.RequiredIndicator />
              </Field.Label>
              <Input
                placeholder="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Field.HelperText>
                これはあなたのユーザー名として使われます．
              </Field.HelperText>
            </Field.Root>

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
          <Button variant="solid" onClick={handleClick}>
            新規登録
          </Button>
        </Card.Footer>
      </Card.Root>
    </>
  );
}
