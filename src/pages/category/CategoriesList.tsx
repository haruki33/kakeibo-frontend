import { useState } from "react";
import {
  Button,
  Text,
  Card,
  Flex,
  Badge,
  Separator,
  VStack,
  Wrap,
  Spinner,
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
  positiveButtonText: string;
  positiveButtonIcon: React.ReactNode;
  UpdateCategory: (category: CategoryType) => void;
  ButtonText: string;
  ButtonLoadingText: string;
};

export default function CategoriesList({
  isLoadingCategories,
  categories,
  handleDelete,
  positiveButtonText,
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
        <Wrap gap="2" justify="flex-start">
          {categories.map((cat) => (
            <Card.Root
              variant="elevated"
              minW={{ base: "100%", md: "150px" }}
              key={cat.id}
            >
              <Card.Body>
                <Flex justify="space-between">
                  <Card.Title maxW="150px">
                    <Text
                      truncate
                      color={cat.type === "income" ? "#60A5FA" : "#F87171"}
                    >
                      {cat.name}
                    </Text>
                  </Card.Title>
                  {cat.registration_date && (
                    <Badge colorPalette="green" size="sm">
                      定期
                    </Badge>
                  )}
                </Flex>
                <Card.Description maxW="150px">
                  <Text
                    truncate
                    as="span" // <Text> => <p> となるので<p><p>...</p></p>となってしまうためspanに変更
                  >
                    {cat.description}
                  </Text>
                </Card.Description>
                <Separator my="2" />
                {cat.registration_date && (
                  <Flex justify="space-between">
                    <VStack align="flex-start" gap="0">
                      <Text textStyle="sm" fontWeight="medium">
                        登録日
                      </Text>
                      <>{cat.registration_date}</>
                    </VStack>
                    <VStack align="flex-start" gap="0">
                      <Text textStyle="sm" fontWeight="medium">
                        金額
                      </Text>
                      <Text>{cat.amount} 円</Text>
                    </VStack>
                  </Flex>
                )}
              </Card.Body>
              <Card.Footer>
                <Button
                  variant="subtle"
                  colorPalette="green"
                  flex="1"
                  onClick={() => handlePositiveButtonClick(cat)}
                >
                  {positiveButtonIcon}
                  {positiveButtonText}
                </Button>
                <Button
                  variant="subtle"
                  colorPalette="red"
                  flex="1"
                  onClick={() => handleDelete(cat)}
                >
                  <AiFillDelete />
                  削除
                </Button>
              </Card.Footer>
            </Card.Root>
          ))}
        </Wrap>
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
