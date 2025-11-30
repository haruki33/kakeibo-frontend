import type { ProfileType } from "@/types/accountSettings";
import { putWithAuth } from "@/utils/putWithAuth";
import { useAuth } from "@/utils/useAuth";
import {
  Button,
  CloseButton,
  Dialog,
  Field,
  Input,
  Portal,
  Stack,
} from "@chakra-ui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";

type dialogProfileEditProps = {
  isDialogOpen: boolean;
  setIsDialogOpen: (isOpen: boolean) => void;
  defaultValues: ProfileType;
  setProfile: (profile: ProfileType) => void;
};

export default function DialogProfileEdit({
  isDialogOpen,
  setIsDialogOpen,
  defaultValues,
  setProfile,
}: dialogProfileEditProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const { onLogout } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileType>({
    defaultValues,
  });

  const onsubmit = async (data: ProfileType) => {
    setLoading(true);

    try {
      const changedProfile = await putWithAuth("/profile", data);
      setProfile(changedProfile);
    } catch (err) {
      console.error(err);
      onLogout();
    } finally {
      setLoading(false);
      setIsDialogOpen(false);
    }
  };

  return (
    <>
      <Dialog.Root
        open={isDialogOpen}
        onOpenChange={(details) => setIsDialogOpen(details.open)}
        placement="center"
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <form onSubmit={handleSubmit(onsubmit)} noValidate>
                <Dialog.CloseTrigger asChild>
                  <CloseButton />
                </Dialog.CloseTrigger>

                <Dialog.Header>
                  <Dialog.Title>プロフィール編集</Dialog.Title>
                </Dialog.Header>

                <Dialog.Body>
                  <Stack gap="4" w="full">
                    <Field.Root invalid={!!errors.name}>
                      <Field.Label>Name</Field.Label>
                      <Input
                        placeholder="ユーザ名を入力"
                        {...register("name", {
                          required: "名前は必須です",
                        })}
                      />
                      <Field.ErrorText>{errors.name?.message}</Field.ErrorText>
                    </Field.Root>
                    <Field.Root invalid={!!errors.email}>
                      <Field.Label>Email</Field.Label>
                      <Input
                        placeholder="メールアドレスを入力"
                        {...register("email", {
                          required: "メールアドレスは必須です",
                        })}
                      />
                      <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
                    </Field.Root>
                  </Stack>
                </Dialog.Body>
                <Dialog.Footer>
                  <Button
                    type="submit"
                    loading={loading}
                    colorPalette="green"
                    variant="solid"
                    w="full"
                  >
                    更新
                  </Button>
                </Dialog.Footer>
              </form>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
}
