import { putWithAuth } from "@/utils/putWithAuth";
import { Button, Card, Field, Input, Stack } from "@chakra-ui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { NewPasswordType } from "../../types/accountSettings.ts";
import { useAuth } from "@/utils/useAuth.tsx";

type newPasswordFormProps = {
  setIsCheckCompleted: (value: boolean) => void;
};

export default function NewPasswordForm({
  setIsCheckCompleted,
}: newPasswordFormProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const { onLogout } = useAuth();
  const defaultValues: NewPasswordType = {
    newPassword: "",
    confirmNewPassword: "",
  };

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<NewPasswordType>({
    defaultValues,
  });
  const newPassword = watch("newPassword");

  const onsubmit = async (data: NewPasswordType) => {
    setLoading((prev) => !prev);

    try {
      await putWithAuth("/setNewPassword", data);
    } catch (err) {
      console.error(err);
      onLogout();
    } finally {
      setIsCheckCompleted(true);
      setLoading((prev) => !prev);
      reset(defaultValues);
    }
  };

  return (
    <Card.Root>
      <form onSubmit={handleSubmit(onsubmit)} noValidate>
        <Card.Header>
          <Card.Title>新しいパスワードを設定</Card.Title>
        </Card.Header>
        <Card.Body>
          <Stack gap="4" w="full">
            <Field.Root invalid={!!errors.newPassword}>
              <Field.Label>新しいパスワード</Field.Label>
              <Input
                p="2"
                borderWidth="1px"
                borderRadius="md"
                w="full"
                type="password"
                {...register("newPassword", {
                  required: "新しいパスワードを入力してください",
                })}
              />
              <Field.ErrorText>{errors.newPassword?.message}</Field.ErrorText>
            </Field.Root>
            <Field.Root invalid={!!errors.confirmNewPassword}>
              <Field.Label>新しいパスワード（確認用）</Field.Label>
              <Input
                p="2"
                borderWidth="1px"
                borderRadius="md"
                w="full"
                type="password"
                {...register("confirmNewPassword", {
                  required: "確認用パスワードを入力してください",
                  validate: (value) =>
                    value === newPassword || "パスワードが一致しません",
                })}
              />
              <Field.ErrorText>
                {errors.confirmNewPassword?.message}
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
  );
}
