import { useHandlers } from "@/stores/stores";
import { Service } from "@/types";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import { find } from "lodash";
import { useState } from "react";
import InfoIcon from "@mui/icons-material/Info";
import semver from "semver";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import CloseIcon from "@mui/icons-material/Close";

interface ServiceMenuProps {
  anchorEl: any;
  open: boolean;
  onClose(): void
  service: Service
  setDeleted(): void
}

export default function ServiceMenu({ anchorEl, open, onClose, service, setDeleted }: ServiceMenuProps) {
  const handlers = useHandlers((state) => state.list);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const onDelete = async () => {
    setShowConfirmDelete(false);
    const res = await fetch(`/api/services/${service.id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (data.deleted) {
      setDeleted();
    }
  };
  
  return (
    <>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={onClose}
      >
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <InfoIcon />
            </ListItemIcon>
            <ListItemText primary="View" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <InfoIcon />
            </ListItemIcon>
            <ListItemText primary="Edit" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            disabled={semver.satisfies(
              service.handler.version.toString(),
              find(handlers, { key: service.handler.key })!.version.toString()
            )}
          >
            <ListItemIcon>
              <AutorenewIcon />
            </ListItemIcon>
            <ListItemText primary="Update" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <InfoIcon />
            </ListItemIcon>
            <ListItemText primary="Publish" />
          </ListItemButton>
        </ListItem>
        
        <ListItem disablePadding>
          <ListItemButton
            color="error"
            onClick={() => setShowConfirmDelete(true)}
          >
            <ListItemIcon color="error">
              <CloseIcon color="error" />
            </ListItemIcon>
            <ListItemText primary="Remove" color="error" />
          </ListItemButton>
        </ListItem>
      </Menu>
      
      <Dialog
        open={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
      >
        <DialogContent>Are you sure?</DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={() => setShowConfirmDelete(false)}>
            No
          </Button>

          <Button onClick={onDelete}>Yes</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
