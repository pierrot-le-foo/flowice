// import { serviceCategories, serviceTypes } from "@/config";
import { useHandlers, useShowAddDialog } from "@/stores/stores";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";
import { AppCreator } from "@/lib/AppCreator";


export default function AddDialog() {
  const showAddDialog = useShowAddDialog((state) => state);
  const handlers = useHandlers((state) => state.list);
  const [updates, setUpdates] = useState(0);
  const [appCreator] = useState(() => new AppCreator());

  appCreator.on(() => {
    setUpdates((u) => u + 1);
  });

  appCreator.handlers = handlers;

  return (
    <Dialog
      open={showAddDialog.value}
      onClose={showAddDialog.off}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      fullWidth
      TransitionProps={{
        mountOnEnter: true,
      }}
      keepMounted={false}
    >
      <DialogTitle id="alert-dialog-title">Add new service</DialogTitle>
      <DialogContent>
        {appCreator.render()}

        {appCreator.renderStepper()}

        {appCreator.renderActions()}

        {appCreator.renderErrors()}
      </DialogContent>

      <DialogActions>
        <Button onClick={appCreator.reset} color="secondary">
          Cancel
        </Button>

        {appCreator.renderNextButton()}
      </DialogActions>
    </Dialog>
  );
}
