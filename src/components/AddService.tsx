import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useCallback, useEffect, useState } from "react";
import CategoryPicker from "./CategoryPicker";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import Terminal from "./Terminak";
import HandlerPicker from "./HandlerPicker";
import Divider from "@mui/material/Divider";
import Uploader from "./Uploader";
import Avatar from "@mui/material/Avatar";
import { ServiceCategory, ServiceHandler } from "@/types";
import Inputs from "./Inputs";
import FormControlLabel from "@mui/material/FormControlLabel";
import PauseIcon from "@mui/icons-material/Pause";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import CircleIcon from "@mui/icons-material/Circle";
import CheckIcon from "@mui/icons-material/Check";
import Paper from "@mui/material/Paper";
import {
  compile,
  compileInputs,
  formatInputs,
  isInputValid,
  variablesArrayToObject,
} from "@/lib/inputs";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { find, orderBy, startCase } from "lodash";
import TuneIcon from "@mui/icons-material/Tune";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

const getImage = (image: File | null): Promise<string> =>
  new Promise((resolve) => {
    if (!image) {
      resolve("");
    } else {
      const reader = new FileReader();

      reader.addEventListener(
        "load",
        () => {
          resolve(reader.result as string);
        },
        false
      );

      reader.readAsDataURL(image);
    }
  });

interface AddServiceProps {
  id: string;
}

export default function AddService({ id }: AddServiceProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [handler, setHandler] = useState<ServiceHandler | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [install, setInstall] = useState("");
  const [category, setCategory] = useState<ServiceCategory | null>(null);
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<boolean | null>(null);
  const [inputs, setInputs] = useState<Record<string, any>>({});
  const [handlerIsValid, setHandlerIsValid] = useState(false);
  const [installResult, setInstallResult] = useState(null);
  const [installing, setInstalling] = useState(false);
  const [invalids, setInvalids] = useState<{ name: string; reason: string }[]>(
    []
  );
  const [viewHandlersAsJSON, setViewHandlersAsJSON] = useState(false);
  const [scriptsView, setScriptsView] = useState<
    "install" | "uninstall" | "folder" | "variables"
  >("install");
  const [variables, setVariables] = useState<
    {
      source: string;
      name: string;
      description: string;
      value: any;
      color: string;
    }[]
  >([]);
  const [showVariables, setShowVariables] = useState(false);
  const [closeOnCopied, setCloseOnCopied] = useState(true);

  useEffect(() => {
    const nextVariables: {
      source: string;
      name: string;
      description: string;
      value: any;
      color: string;
    }[] = [];

    nextVariables.push({
      source: "general",
      name: "id",
      description: "Service id",
      value: id,
      color: "darksalmon",
    });

    if (name) {
      nextVariables.push({
        source: "general",
        name: "name",
        description: "Service name",
        value: name,
        color: "darksalmon",
      });
    }

    if (description) {
      nextVariables.push({
        source: "general",
        name: "description",
        description: "Service description",
        value: description,
        color: "darksalmon",
      });
    }

    if (website) {
      nextVariables.push({
        source: "general",
        name: "website",
        description: "Service website",
        value: website,
        color: "darksalmon",
      });
    }

    if (handler) {
      const options = formatInputs(handler!.wrapper.inputs, inputs);

      Object.keys(options).forEach((inputKey) => {
        const spec = find(handler.wrapper.inputs, { key: inputKey })!;
        const value = options[inputKey];

        nextVariables.push({
          source: "handler",
          name: spec.key,
          description: spec.description,
          value,
          color: "#369",
        });
      });
    }

    if (category) {
      Object.keys(category)
        .filter((categoryKey) => category[categoryKey])
        .forEach((categoryKey) => {
          nextVariables.push({
            source: "category",
            name: categoryKey,
            description: `Category ${startCase(categoryKey)}`,
            value: category[categoryKey],
            color: "darkgreen",
          });
        });
    }

    setVariables(nextVariables);
  }, [category, description, handler, inputs, name, website]);

  useEffect(() => {
    if (handler) {
      setInvalids([]);

      const invalids: { name: string; reason: string }[] = [];

      const isValid = handler.wrapper.inputs.every((input) => {
        if (!input.required) {
          return true;
        }

        if (!(input.key in inputs)) {
          return false;
        }

        const value = inputs[input.key];

        const validity = isInputValid(input, value);

        if (!validity.valid) {
          invalids.push({ name: input.name, reason: validity.reason });
          return false;
        }

        return true;
      });

      setHandlerIsValid(isValid);
      setInvalids(invalids);
    }
  }, [inputs, handler]);

  useEffect(() => {
    setIsReady(
      !!name && !!description && !!handler && !!category && handlerIsValid
    );
  }, [category, description, handler, handlerIsValid, name]);

  const updateService = useCallback(() => {
    return fetch(`/api/services/${id}.tmp`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        name,
        description,
        image,
        website,
        handler,
        category,
        options: handler
          ? compileInputs(
              handler.wrapper.inputs,
              inputs,
              variablesArrayToObject(variables)
            )
          : {},
        install: compile(variablesArrayToObject(variables), install),
      }),
    });
  }, [
    id,
    name,
    description,
    image,
    website,
    handler,
    category,
    inputs,
    variables,
    install,
  ]);

  const reloadStatus = async () => {
    await updateService().then(async () => {
      const res = await fetch(`/api/services/${id}.tmp/status`);
      const data = await res.json();
      if (typeof data.status === "boolean") {
        setStatus(data.status);
      } else if (Array.isArray(data.status)) {
        setStatus(data.status[0]);
      }
    });
  };

  const stop = async () => {
    await updateService().then(async () => {
      const res = await fetch(`/api/services/${id}.tmp/stop`);
    });
  };

  const start = async () => {
    await updateService().then(async () => {
      const res = await fetch(`/api/services/${id}.tmp/start`);
    });
  };

  const restart = async () => {
    await updateService().then(async () => {
      const res = await fetch(`/api/services/${id}.tmp/restart`);
    });
  };

  const pause = async () => {
    await updateService().then(async () => {
      const res = await fetch(`/api/services/${id}.tmp/pause`);
    });
  };

  const unpause = async () => {
    await updateService().then(async () => {
      const res = await fetch(`/api/services/${id}.tmp/unpause`);
    });
  };

  const create = async () => {
    await updateService().then(async () => {
      const res = await fetch(`/api/services/temp/${id}`);
      const data = await res.json();
      setStatus(data.status);
    });
  };

  const runInstall = useCallback(() => {
    setInstalling(true);
    fetch(`/api/services/${id}/run`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(compile(variablesArrayToObject(variables), install)),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Request failed')
        }
        return res.json()
      })
      .then((result) => {
        setInstallResult(result);
        setInstalling(false);
      })
      .catch(error => {
        console.log(error)
        setInstalling(false);
      });
  }, [install, id]);

  return (
    <>
      <Stack spacing={2} divider={<Divider orientation="horizontal" />}>
      <Stack
          direction="row"
          alignItems="center"
          spacing={3}
          divider={<Divider sx={{ bgColor: "white" }} orientation="vertical" />}
        >
          <Stack sx={{ width: 200 }}>
            <Typography align="right" sx={{ fontWeight: "bold" }}>
              ID:
            </Typography>
          </Stack>
          <Stack sx={{ flex: 1 }}>
            <Typography>{id}</Typography>
          </Stack>
        </Stack>

        <Stack
          direction="row"
          alignItems="center"
          spacing={3}
          divider={<Divider sx={{ bgColor: "white" }} orientation="vertical" />}
        >
          <Stack sx={{ width: 200 }}>
            <Typography align="right" sx={{ fontWeight: "bold" }}>
              Name<span style={{ color: "red" }}>*</span>:
            </Typography>
          </Stack>
          <Stack sx={{ flex: 1 }}>
            <TextField
              value={name}
              onChange={(e) => setName(e.target.value)}
              label="Name"
              placeholder="The name of the service"
              name="new-service-name"
            />
          </Stack>
        </Stack>

        <Stack
          direction="row"
          alignItems="center"
          spacing={3}
          divider={<Divider sx={{ bgColor: "white" }} orientation="vertical" />}
        >
          <Stack sx={{ width: 200 }}>
            <Typography align="right" sx={{ fontWeight: "bold" }}>
              Description<span style={{ color: "red" }}>*</span>:
            </Typography>
          </Stack>
          <Stack sx={{ flex: 1 }}>
            <TextField
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              label="Description"
              placeholder="The description of the service"
              name="new-service-description"
            />
          </Stack>
        </Stack>

        <Stack
          direction="row"
          alignItems="center"
          spacing={3}
          divider={<Divider sx={{ bgColor: "white" }} orientation="vertical" />}
        >
          <Stack sx={{ width: 200 }}>
            <Typography align="right">Image:</Typography>
          </Stack>
          <Stack sx={{ flex: 1 }}>
            <Uploader
              onChange={(file) => {
                if (file) {
                  getImage(file).then(setImage);
                } else {
                  setImage("");
                }
              }}
              display={(file) => (
                <Avatar src={URL.createObjectURL(file.value)} />
              )}
            />
          </Stack>
        </Stack>

        <Stack
          direction="row"
          alignItems="center"
          spacing={3}
          divider={<Divider sx={{ bgColor: "white" }} orientation="vertical" />}
        >
          <Stack sx={{ width: 200 }}>
            <Typography align="right">Website:</Typography>
          </Stack>
          <Stack sx={{ flex: 1 }}>
            <TextField
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              label="Website"
              placeholder="Enter website"
            />
          </Stack>
        </Stack>

        <Stack
          direction="row"
          alignItems="center"
          spacing={3}
          divider={<Divider sx={{ bgColor: "white" }} orientation="vertical" />}
        >
          <Stack sx={{ width: 200 }}>
            <Typography align="right" sx={{ fontWeight: "bold" }}>
              Category<span style={{ color: "red" }}>*</span>:
            </Typography>
          </Stack>
          <Stack sx={{ flex: 1 }}>
            <CategoryPicker onChange={setCategory} />
          </Stack>
        </Stack>

        <Stack
          direction="row"
          alignItems="flex-start"
          spacing={3}
          divider={<Divider sx={{ bgColor: "white" }} orientation="vertical" />}
        >
          <Stack sx={{ width: 200 }} spacing={3}>
            <Typography align="right" sx={{ fontWeight: "bold" }}>
              Handler<span style={{ color: "red" }}>*</span>:
            </Typography>

            <Stack
              justifyContent="flex-end"
              direction="row"
              spacing={1}
              alignItems="center"
            >
              <CheckIcon
                color={
                  handler === null
                    ? "disabled"
                    : handlerIsValid
                    ? "success"
                    : "error"
                }
              />
              <Typography
                color={
                  handler === null
                    ? "darkgray"
                    : handlerIsValid
                    ? "green"
                    : "red"
                }
              >
                Is Valid
              </Typography>
            </Stack>

            <Stack
              spacing={1}
              divider={
                <Divider orientation="horizontal" sx={{ bgColor: "#ccc" }} />
              }
            >
              {invalids.map((i) => (
                <Stack key={i.name} spacing={1}>
                  <Typography color="error" fontWeight="bold">
                    {i.name}:
                  </Typography>
                  <Typography color="error">{i.reason}</Typography>
                </Stack>
              ))}
            </Stack>
          </Stack>

          <Paper sx={{ flex: 1, padding: 1 }} elevation={10}>
            <Stack spacing={2}>
              <HandlerPicker onChange={setHandler} />
              {handler && (
                <Stack spacing={2}>
                  <Tabs
                    value={viewHandlersAsJSON ? 1 : 0}
                    onChange={(e, t) => setViewHandlersAsJSON(t === 1)}
                  >
                    <Tab label="Form" />
                    <Tab label="JSON" />
                  </Tabs>

                  <Stack sx={{ position: "relative" }}>
                    <Stack
                      style={{
                        position: viewHandlersAsJSON ? "absolute" : "static",
                        top: 0,
                        bottom: 0,
                        left: viewHandlersAsJSON ? -9000 : 0,
                      }}
                    >
                      <Inputs
                        inputs={handler.wrapper.inputs}
                        onChange={setInputs}
                        variables={variables}
                        showVariables={() => setShowVariables(true)}
                      />
                    </Stack>

                    <Stack
                      style={{
                        position: !viewHandlersAsJSON ? "absolute" : "static",
                        top: 0,
                        bottom: 0,
                        left: !viewHandlersAsJSON ? -9000 : 0,
                      }}
                    >
                      <pre>
                        {JSON.stringify(
                          formatInputs(handler!.wrapper.inputs, inputs),
                          null,
                          2
                        )}
                      </pre>
                    </Stack>
                  </Stack>
                </Stack>
              )}
            </Stack>
          </Paper>
        </Stack>

        <Stack
          direction="row"
          alignItems="flex-start"
          spacing={3}
          divider={<Divider sx={{ bgColor: "white" }} orientation="vertical" />}
        >
          <Stack sx={{ width: 200 }}>
            <Typography align="right">Scripts:</Typography>
          </Stack>

          <Stack sx={{ flex: 1 }} spacing={2}>
            <Stack direction="row" justifyContent="space-between">
              <Tabs
                value={
                  scriptsView === "install"
                    ? 0
                    : scriptsView === "uninstall"
                    ? 1
                    : scriptsView === "folder"
                    ? 2
                    : 3
                }
                onChange={(e, t) => {
                  if (t === 0) {
                    setScriptsView("install");
                  } else if (t === 1) {
                    setScriptsView("uninstall");
                  } else if (t === 2) {
                    setScriptsView("folder");
                  } else if (t === 3) {
                    setScriptsView("variables");
                  }
                }}
              >
                <Tab label="Install" />
                <Tab label="Update" />
                <Tab label="Uninstall" />
              </Tabs>

              <Button
                variant="contained"
                startIcon={<TuneIcon />}
                onClick={() => setShowVariables(true)}
              >
                Variables
              </Button>
            </Stack>

            <Stack
              style={{ display: scriptsView === "install" ? "flex" : "none" }}
            >
              <Stack>
                <Terminal onChange={setInstall} />
              </Stack>
              <Button onClick={runInstall} disabled={installing}>
                Run
              </Button>
              {installResult && (
                <Stack direction="row">
                  <Stack sx={{ flex: 1, maxHeight: "80vh", overflow: "auto" }}>
                    <Typography>stdout</Typography>
                    {installResult.stdout.split("\n").map((line, lineIndex) => (
                      <Typography key={lineIndex}>{line}</Typography>
                    ))}
                  </Stack>
                  <Stack sx={{ flex: 1, maxHeight: "80vh", overflow: "auto" }}>
                    <Typography>stderr</Typography>
                    {installResult.stderr.split("\n").map((line, lineIndex) => (
                      <Typography key={lineIndex} color="darkgray">
                        {line}
                      </Typography>
                    ))}
                  </Stack>
                </Stack>
              )}
            </Stack>
          </Stack>
        </Stack>

        <Stack
          direction="row"
          alignItems="center"
          spacing={3}
          divider={<Divider sx={{ bgColor: "white" }} orientation="vertical" />}
        >
          <Stack sx={{ width: 200 }}>
            <Typography align="right">Test:</Typography>
          </Stack>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent={"space-between"}
            sx={{ flex: 1 }}
          >
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                color="success"
                startIcon={<PlayArrowIcon />}
                disabled={!handler || !handlerIsValid}
                onClick={start}
              >
                Start
              </Button>

              <Button
                variant="contained"
                color="error"
                startIcon={<StopIcon />}
                disabled={!handler || !handlerIsValid}
                onClick={stop}
              >
                Stop
              </Button>

              <Button
                variant="contained"
                color="secondary"
                startIcon={<RestartAltIcon />}
                disabled={!handler || !handlerIsValid}
                onClick={restart}
              >
                Restart
              </Button>

              {/* {isPausable && (
                <Button
                  variant="contained"
                  color="warning"
                  startIcon={<PauseIcon />}
                >
                  Pause
                </Button>
              )} */}
            </Stack>

            <Stack direction="row" spacing={2} alignItems="center">
              <IconButton
                onClick={reloadStatus}
                disabled={!handler || !handlerIsValid}
              >
                <RestartAltIcon />
              </IconButton>
              <Typography>Status:</Typography>
              <CircleIcon
                color={
                  status === null
                    ? "disabled"
                    : status === true
                    ? "success"
                    : "error"
                }
              />
            </Stack>
          </Stack>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={3}>
          <Stack sx={{ width: 200 }}>
            <Typography align="right" sx={{ fontWeight: "bold" }}></Typography>
          </Stack>
          <Stack sx={{ flex: 1 }}>
            <Button variant="contained" disabled={!isReady} onClick={create}>
              Create service
            </Button>
          </Stack>
        </Stack>
      </Stack>

      <Dialog open={showVariables} onClose={() => setShowVariables(false)} fullWidth maxWidth="xl">
        <DialogTitle>Variables</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <Typography>Only valid variables will appear here!</Typography>

            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Value</TableCell>
                  <TableCell width={60}>Copy</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {orderBy(variables, ["source", "name"], ["asc", "asc"]).map(
                  (variable) => (
                    <TableRow key={`${variable.source}.${variable.name}`}>
                      <TableCell>
                        <Typography
                          color={variable.color}
                        >{`${variable.source}.${variable.name}`}</Typography>
                      </TableCell>
                      <TableCell>{variable.description}</TableCell>
                      <TableCell>
                        <pre>{JSON.stringify(variable.value, null, 2)}</pre>
                      </TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => {
                            navigator.clipboard.writeText(
                              `{{ ${variable.source}.${variable.name} }}`
                            );
                            if (closeOnCopied) {
                              setShowVariables(false);
                            }
                          }}
                        >
                          <ContentCopyIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </Stack>
        </DialogContent>
        <DialogActions>
          <FormControlLabel
            control={
              <Checkbox
                checked={closeOnCopied}
                onChange={(e) => setCloseOnCopied(e.target.checked)}
              />
            }
            label="Close on copied"
          />
          <Button onClick={() => setShowVariables(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
