import type { CurrentPasswordType } from "@/types/accountSettings";
import { postWithAuth } from "@/utils/postWithAuth";
import { Button, Card, Field, Input, Stack } from "@chakra-ui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import InvalidAlert from "./InvalidError";

type VerifyPasswordProps = {
  setIsCheckCompleted: (value: boolean) => void;
  isCheckError: boolean;
  setIsCheckError: (value: boolean) => void;
};

export default function VerifyPassword({
  setIsCheckCompleted,
  isCheckError,
  setIsCheckError,
}: VerifyPasswordProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const defaultValues: CurrentPasswordType = {
    currentPassword: "",
  };
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CurrentPasswordType>({
    defaultValues,
  });

  const onsubmit = async (data: CurrentPasswordType) => {
    setLoading(true);

    try {
      const res = await postWithAuth("/checkPassword", data);
      setIsCheckCompleted(Boolean(res.message));
    } catch (err) {
      console.error(err);
      setIsCheckError(true);
    } finally {
      reset(defaultValues);
      setLoading(false);
    }
  };
  return (
    <>
      {isCheckError && <InvalidAlert />}
      <Card.Root>
        <form onSubmit={handleSubmit(onsubmit)} noValidate>
          <Card.Header>
            <Card.Title>現在のパスワードを確認</Card.Title>
          </Card.Header>
          <Card.Body>
            <Stack gap="4" w="full">
              <Field.Root invalid={!!errors.currentPassword}>
                <Field.Label>現在のパスワードを入力してください</Field.Label>
                <Input
                  p="2"
                  borderWidth="1px"
                  borderRadius="md"
                  w="full"
                  type="password"
                  {...register("currentPassword", {
                    required: "現在のパスワードは必須です",
                  })}
                />
                <Field.ErrorText>
                  {errors.currentPassword?.message}
                </Field.ErrorText>
              </Field.Root>
            </Stack>
          </Card.Body>
          <Card.Footer justifyContent="flex-end">
            <Button
              type="submit"
              colorPalette="green"
              variant="solid"
              loading={loading}
            >
              確認
            </Button>
          </Card.Footer>
        </form>
      </Card.Root>
    </>
  );
}
