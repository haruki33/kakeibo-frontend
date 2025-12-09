import { Dialog, Portal, CloseButton } from "@chakra-ui/react";
import CategoryForm from "./CategoryForm.tsx";
import type { CategoryType } from "../../types/mysetting.ts";
import { putWithAuth } from "@/utils/putWithAuth.tsx";

type EditDialogProps = {
  isEditDialogOpen: boolean;
  handleEditDialogClose: () => void;
  categories: CategoryType[];
  editCategory: CategoryType;
  handleButton: (category: CategoryType) => void;
  ButtonText: string;
  ButtonLoadingText: string;
};

export default function EditDialog({
  isEditDialogOpen,
  handleEditDialogClose,
  categories,
  editCategory,
  handleButton,
  ButtonText,
  ButtonLoadingText,
}: EditDialogProps) {
  return (
    <Dialog.Root
      open={isEditDialogOpen}
      onOpenChange={handleEditDialogClose}
      placement="center"
      size="md"
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content maxW="80vw">
            <Dialog.CloseTrigger asChild>
              <CloseButton />
            </Dialog.CloseTrigger>
            <Dialog.Header>
              <Dialog.Title>カテゴリー編集</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <CategoryForm
                categories={categories}
                defaultValues={editCategory}
                handleCategory={async (data: CategoryType) => {
                  const res = await putWithAuth(
                    `/categories/${data?.id}`,
                    data
                  );
                  handleButton(res);
                  handleEditDialogClose();
                }}
                submitButtonText={ButtonText}
                loadingText={ButtonLoadingText}
              />
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
