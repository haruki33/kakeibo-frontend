import { useState } from "react";
import {
  Button,
  Text,
  Flex,
  Badge,
  Spinner,
  Table,
  VStack,
} from "@chakra-ui/react";
import { AiFillDelete } from "react-icons/ai";
import EditDialog from "./EditDialog.tsx";

type CategoryType = {
  id: string;
  name: string;
  type: "income" | "expense";
  is_deleted: boolean;
  description: string;
  registration_date: string | null;
  amount: string | null;
};

type categoriesListProps = {
  isLoadingCategories: boolean;
  categories: CategoryType[];
  handleDelete: (category: CategoryType) => void;
  positiveButtonIcon: React.ReactNode;
  UpdateCategory: (category: CategoryType) => void;
  ButtonText: string;
  ButtonLoadingText: string;
};

export default function CategoriesList({
  isLoadingCategories,
  categories,
  handleDelete,
  positiveButtonIcon,
  UpdateCategory,
  ButtonText,
  ButtonLoadingText,
}: categoriesListProps) {
  const [editCategory, setEditCategory] = useState<CategoryType | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);

  const handlePositiveButtonClick = (cat: CategoryType) => {
    setEditCategory(cat);
    setIsEditDialogOpen(true);
  };

  return (
    <>
      {isLoadingCategories ? (
        <Flex justify="center">
          <Spinner color="blue.500" animationDuration="0.8s" />
        </Flex>
      ) : (
        // 大きさ問題（テーブルが原因）
        <Table.ScrollArea borderWidth="1px" overflowY="auto" h="65vh">
          <Table.Root size="sm" stickyHeader>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>名前</Table.ColumnHeader>
                <Table.ColumnHeader></Table.ColumnHeader>
                <Table.ColumnHeader></Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {categories.map((cat) => (
                <Table.Row key={cat.id}>
                  <Table.Cell>
                    <Text
                      truncate
                      textStyle="md"
                      fontWeight="bold"
                      color={cat.type === "income" ? "#60A5FA" : "#F87171"}
                    >
                      {cat.name}
                    </Text>
                    <Text truncate textStyle="sm">
                      {cat.description}
                    </Text>
                  </Table.Cell>
                  {cat.registration_date ? (
                    <Table.Cell>
                      <Flex gap="2" align="bottom">
                        <Badge colorPalette="green" size="sm">
                          定期
                        </Badge>
                        <VStack gap="0">
                          <Text textStyle="sm">
                            登録日 {cat.registration_date} 日
                          </Text>
                          <Text textStyle="sm">金額 {cat.amount} 円</Text>
                        </VStack>
                      </Flex>
                    </Table.Cell>
                  ) : (
                    <Table.Cell>
                      <></>
                    </Table.Cell>
                  )}
                  <Table.Cell>
                    <Flex justify="flex-end" gap="2">
                      <Button
                        variant="subtle"
                        colorPalette="green"
                        onClick={() => handlePositiveButtonClick(cat)}
                      >
                        {positiveButtonIcon}
                      </Button>
                      <Button
                        variant="subtle"
                        colorPalette="red"
                        onClick={() => handleDelete(cat)}
                      >
                        <AiFillDelete />
                      </Button>
                    </Flex>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Table.ScrollArea>
      )}

      {isEditDialogOpen && editCategory && (
        <EditDialog
          isEditDialogOpen={isEditDialogOpen}
          handleEditDialogClose={() => {
            setIsEditDialogOpen(false);
            setEditCategory(null);
          }}
          categories={categories}
          editCategory={editCategory}
          handleButton={UpdateCategory}
          ButtonText={ButtonText}
          ButtonLoadingText={ButtonLoadingText}
        />
      )}
    </>
  );
}
