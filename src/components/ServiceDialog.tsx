import { useSelectedServiceId } from "@/stores/stores";
import { Service } from "@/types";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useEffect, useState } from "react";
import JSONReader from "./JSONReader";

export default function ServiceDialog() {
  const selectedServiceId = useSelectedServiceId((state) => state.value);
  const replaceSelectedServiceId = useSelectedServiceId(
    (state) => state.replace
  );
  const [service, setService] = useState<Service>();

  const getService = async () => {
    const res = await fetch(`/api/services/${selectedServiceId}`);
    const data = await res.json();
    setService(data);
  };

  useEffect(() => {
    if (selectedServiceId) {
      // getService();
    }
  }, [selectedServiceId]);

  return (
    <Dialog
      open={Boolean(selectedServiceId)}
      onClose={() => replaceSelectedServiceId("")}
      fullWidth
      TransitionProps={{
        mountOnEnter: true,
      }}
    >
      <DialogTitle>{service && service.name} ({selectedServiceId})</DialogTitle>

      <DialogContent>
        <pre>{JSON.stringify(service, null, 2)}</pre>
      </DialogContent>

      <DialogActions>
        <Button color="secondary" onClick={() => replaceSelectedServiceId("")}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
