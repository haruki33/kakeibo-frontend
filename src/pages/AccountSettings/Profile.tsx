import { fetchWithAuth } from "@/utils/fetchWithAuth";
import {
  Box,
  Button,
  Card,
  Field,
  SkeletonText,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useAuth } from "../../utils/useAuth.tsx";
import DialogProfileEdit from "./DialogProfileEdit.tsx";

type ProfileType = {
  name: string;
  email: string;
};

const Profile = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [profile, setProfile] = useState<ProfileType>({ name: "", email: "" });
  const { onLogout } = useAuth();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const data = await fetchWithAuth("/profile");
        setProfile(data);
      } catch (err) {
        console.error(err);
        onLogout();
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [onLogout]);

  return (
    <>
      <Card.Root>
        <Card.Header>
          <Card.Title>Profile</Card.Title>
        </Card.Header>
        <Card.Body>
          <Stack gap="4" w="full">
            <Field.Root>
              <Field.Label>Name</Field.Label>
              <Box
                p="2"
                borderWidth="1px"
                borderRadius="md"
                w="full"
                color="gray.500"
              >
                {loading ? (
                  <SkeletonText noOfLines={1} />
                ) : (
                  <Text>{profile?.name}</Text>
                )}
              </Box>
            </Field.Root>
            <Field.Root>
              <Field.Label>Email</Field.Label>
              <Box
                p="2"
                borderWidth="1px"
                borderRadius="md"
                w="full"
                color="gray.500"
              >
                {loading ? (
                  <SkeletonText noOfLines={1} />
                ) : (
                  <Text>{profile?.email}</Text>
                )}
              </Box>
            </Field.Root>
          </Stack>
        </Card.Body>
        <Card.Footer justifyContent="flex-end">
          <Button
            variant="solid"
            colorPalette="green"
            onClick={() => {
              setIsDialogOpen(!isDialogOpen);
            }}
          >
            編集
          </Button>
        </Card.Footer>
      </Card.Root>

      {isDialogOpen && (
        <DialogProfileEdit
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          defaultValues={profile}
          setProfile={setProfile}
        />
      )}
    </>
  );
};
export default Profile;
