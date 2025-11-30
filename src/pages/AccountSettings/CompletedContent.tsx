import { EmptyState, VStack } from "@chakra-ui/react";
import { TbPasswordUser } from "react-icons/tb";

export default function CompletedContent() {
  return (
    <EmptyState.Root>
      <EmptyState.Content>
        <EmptyState.Indicator>
          <TbPasswordUser />
        </EmptyState.Indicator>
        <VStack textAlign="center">
          <EmptyState.Title>新しいパスワードの設定完了</EmptyState.Title>
          <EmptyState.Description>
            次回から新しいパスワードでログインしてください。
          </EmptyState.Description>
        </VStack>
      </EmptyState.Content>
    </EmptyState.Root>
  );
}
