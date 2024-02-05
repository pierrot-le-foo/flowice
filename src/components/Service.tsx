import { getStatusColor } from "@/config";
import { Service as IService, ServiceAction } from "@/types";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ArticleIcon from "@mui/icons-material/Article";
import PauseIcon from "@mui/icons-material/Pause";
import StopIcon from "@mui/icons-material/Stop";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { useCallback, useEffect, useRef, useState } from "react";
import Avatar from "@mui/material/Avatar";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import {
  useFilterByStatus,
  useFilterByType,
  useHandlers,
  useSelectedLogServiceId,
  useSelectedServiceId,
} from "@/stores/stores";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import CloseIcon from "@mui/icons-material/Close";
import Chip from "@mui/material/Chip";
import semver from "semver";
import { find } from "lodash";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

export interface ServiceProps {
  service: IService;
}

export default function Service({ service }: ServiceProps) {
  const [status, setStatus] = useState(null);
  const [starting, setStarting] = useState(false);
  const [restarting, setRestarting] = useState(false);
  const [stopping, setStopping] = useState(false);
  const [pausing, setPausing] = useState(false);
  const selectedFilters = useFilterByStatus((state) => state.list);
  const selectedTypes = useFilterByType((state) => state.list);
  const [openMenu, setOpenMenu] = useState(false);
  const handlers = useHandlers((state) => state.list);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const setLogs = useSelectedLogServiceId(state => state.replace)

  const getStatus = useCallback(async () => {
    if (!deleted) {
      const response = await fetch(`/api/services/${service.id}/status`);
      const data = await response.json();
      setStatus(data.status);
      if (status !== data.status) {
        setStarting(false);
        setStopping(false);
      }
    }
  }, [status, deleted]);

  const start = () => {
    setStarting(true);
    fetch(`/api/services/${service.id}/start`);
  };

  const restart = () => {
    setRestarting(true);
    fetch(`/api/services/${service.id}/restart`);
    setTimeout(() => {
      setRestarting(false);
    }, 1000 * 15);
  };

  const stop = () => {
    setStopping(true);
    fetch(`/api/services/${service.id}/stop`);
  };

  const pause = () => {
    setPausing(true);
    fetch(`/api/services/${service.id}/pause`);
  };

  useEffect(() => {
    getStatus();
    const i = setInterval(getStatus, 1000 * 15);
    return () => {
      clearInterval(i);
    };
  }, [status, deleted]);

  const onDelete = async () => {
    setShowConfirmDelete(false);
    const res = await fetch(`/api/services/${service.id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (data.deleted) {
      setDeleted(true);
    }
  };

  const ref = useRef<any>();

  const statusString = status === true ? "Up" : "Down";

  if (!selectedFilters.includes(statusString)) {
    return null;
  }

  if (!selectedTypes.includes(service.handler.key)) {
    return null;
  }

  if (deleted) {
    return null;
  }

  return (
    <>
      <TableRow key={service.id}>
        <TableCell>
          <Avatar src={service.image} sx={{ background: "#fff" }} />
        </TableCell>

        <TableCell>
          {service.handler.name} <Chip label={`v${service.handler.version}`} />
        </TableCell>
        <TableCell>{service.category.type}</TableCell>

        <TableCell>
          <Alert
            severity={getStatusColor(status)}
            sx={{ fontWeight: "bold", color: "white" }}
            variant="filled"
          >
            {service.name}
          </Alert>
        </TableCell>

        <TableCell align="right">
          {status === false && (
            <IconButton
              onClick={start}
              className={starting ? "animate-flicker" : ""}
              disabled={starting}
            >
              <PlayArrowIcon color="success" />
            </IconButton>
          )}

          {status === true &&
            service.handler.actions.includes(ServiceAction.PAUSE) && (
              <IconButton
                onClick={pause}
                className={pausing ? "animate-flicker" : ""}
                disabled={pausing}
              >
                <PauseIcon color="warning" />
              </IconButton>
            )}

          {status === true && (
            <IconButton
              onClick={stop}
              className={stopping ? "animate-flicker" : ""}
              disabled={stopping}
            >
              <StopIcon color="error" />
            </IconButton>
          )}

          {status === true && (
            <IconButton
              onClick={restart}
              className={restarting ? "animate-flicker" : ""}
              disabled={restarting}
            >
              <RestartAltIcon color="secondary" />
            </IconButton>
          )}

          <IconButton color="info" onClick={() => setLogs(service.id)}>
            <ArticleIcon />
          </IconButton>

          <IconButton
            onClick={() => {
              setOpenMenu(true);
            }}
            ref={ref}
          >
            <MoreVertIcon />
          </IconButton>
        </TableCell>
      </TableRow>
      <Menu
        anchorEl={ref.current}
        open={openMenu}
        onClose={() => {
          setOpenMenu(false);
        }}
      >
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
