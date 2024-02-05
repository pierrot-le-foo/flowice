import { useShowAddDialog } from "@/stores/stores";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";

export default function EmptyServices() {
  const router = useRouter();
  const showAddDialog = useShowAddDialog((state) => state.on);

  const goTo = (path: string) => () => {
    router.push(path);
  };

  return (
    <Stack
      sx={{ flex: 1 }}
      justifyContent="center"
      alignItems="center"
      spacing={4}
      p={6}
    >
      <Typography variant="h3">No services yet!</Typography>
      <Typography variant="h5" sx={{ width: "60%" }} align="center">
        Add a{" "}
        <Link component="button" onClick={showAddDialog}>
          new service yourself
        </Link>
        , or{" "}
        <Link component="button" onClick={goTo("/marketplace")}>
          add one from marketplace.
        </Link>
      </Typography>
    </Stack>
  );
}
