import { Button, ButtonGroup, Card, Steps, VStack } from "@chakra-ui/react";
import VerifyPassword from "./VerifyPassword";
import { useEffect, useState } from "react";
import CompletedContent from "./CompletedContent";
import NewPasswordForm from "./NewPasswordForm";

const Password = () => {
  const [isCheckCompleted, setIsCheckCompleted] = useState<boolean>(false);
  const [isCheckError, setIsCheckError] = useState<boolean>(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (isCheckCompleted) {
      setStep((prevStep) => prevStep + 1);
      setIsCheckCompleted(false);
      setIsCheckError(false);
    }
  }, [isCheckCompleted]);

  return (
    <Card.Root p={4}>
      <Card.Body alignItems="center">
        <Steps.Root
          defaultStep={0}
          count={2}
          maxW="700px"
          step={step}
          onStepChange={(e) => setStep(e.step)}
        >
          <Steps.List>
            <Steps.Item index={0} title="Step 1">
              <VStack>
                <Steps.Indicator />
                <Steps.Title>Step 1</Steps.Title>
              </VStack>
              <Steps.Separator />
            </Steps.Item>
            <Steps.Item index={1} title="Step 2">
              <VStack>
                <Steps.Indicator />
                <Steps.Title>Step 2</Steps.Title>
              </VStack>
              <Steps.Separator />
            </Steps.Item>
          </Steps.List>

          <Steps.Content index={0}>
            <VerifyPassword
              setIsCheckCompleted={setIsCheckCompleted}
              isCheckError={isCheckError}
              setIsCheckError={setIsCheckError}
            />
          </Steps.Content>
          <Steps.Content index={1}>
            <NewPasswordForm setIsCheckCompleted={setIsCheckCompleted} />
          </Steps.Content>

          <Steps.CompletedContent>
            <CompletedContent />
          </Steps.CompletedContent>

          <ButtonGroup size="sm" variant="outline" justify="flex-end">
            {step !== 2 ? (
              <Steps.PrevTrigger asChild>
                <Button>Prev</Button>
              </Steps.PrevTrigger>
            ) : (
              <Button onClick={() => setStep(0)} ml={2}>
                最初に戻る
              </Button>
            )}
          </ButtonGroup>
        </Steps.Root>
      </Card.Body>
    </Card.Root>
  );
};

export default Password;
