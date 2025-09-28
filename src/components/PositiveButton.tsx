import { Button } from "@chakra-ui/react";

type ButtonProps = {
  loading?: boolean;
  onClick?: () => void;
  loadingText?: string;
  buttonText?: string;
};

export default function PositiveButton({
  loading,
  onClick,
  loadingText,
  buttonText,
}: ButtonProps) {
  return (
    <Button
      loading={loading}
      colorPalette="green"
      variant="solid"
      onClick={onClick}
      loadingText={loadingText}
      w="full"
    >
      {buttonText}
    </Button>
  );
}
