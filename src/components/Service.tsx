import { getStatusColor } from "@/config";
import { Service as IService, ServiceAction } from "@/types";
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
import { useFilterByStatus, useFilterByType, useSelectedLogServiceId } from "@/stores/stores";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import HideSourceIcon from "@mui/icons-material/HideSource";
import ServiceMenu from "./ServiceMenu";
import WifiIcon from '@mui/icons-material/Wifi';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import SignalWifiStatusbarNullIcon from '@mui/icons-material/SignalWifiStatusbarNull';

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

  const [deleted, setDeleted] = useState(false);
  const setLogs = useSelectedLogServiceId((state) => state.replace);

  const getStatus = useCallback(async () => {
    if (!deleted) {
      const response = await fetch(`/api/services/${service.id}/status`);
      const data = await response.json();
      let nextStatus = false;
      if (typeof data.status === "boolean") {
        nextStatus = data.status;
      } else if (Array.isArray(data.status)) {
        nextStatus = data.status[0];
      }
      setStatus(nextStatus);
      if (status !== nextStatus) {
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
          <Avatar src={service.image || service.handler.image} />
        </TableCell>

        <TableCell>
          {/* <Alert
            severity={getStatusColor(status)}
            sx={{ fontWeight: "bold", color: "white" }}
            variant="filled"
          >
            {service.name}
          </Alert> */}
          <Button
            fullWidth
            color={getStatusColor(status)}
            variant="contained"
            sx={{ justifyContent: "flex-start" }}
            startIcon={
              status === true ? (
                <WifiIcon htmlColor="white" />
              ) : status === false ? (
                <WifiOffIcon htmlColor="white" />
              ) : (
                <SignalWifiStatusbarNullIcon htmlColor="white" />
              )
            }
          >
            {service.name}
          </Button>
        </TableCell>

        <TableCell>
          {service.handler.name} <Chip label={`v${service.handler.version}`} />
        </TableCell>

        <TableCell>{service.category.label}</TableCell>

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
      <ServiceMenu
        anchorEl={ref.current}
        open={openMenu}
        onClose={() => {
          setOpenMenu(false);
        }}
        service={service}
        setDeleted={() => {
          setDeleted(true);
        }}
      />
    </>
  );
}
