// import { serviceCategories, serviceTypes } from "@/config";
import { useHandlers, useServices, useShowAddDialog } from "@/stores/stores";
import { ServiceHandler } from "@/types";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Stack from "@mui/material/Stack";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { every, filter, find } from "lodash";
import { useCallback, useEffect, useState } from "react";
import CategoryPicker from "./CategoryPicker";
import HttpServer from "./HttpServer";
import TextInput from "./TextInput";
import DirectoryInput from "./DirectoryInput";
import Uploader from "./Uploader";
import Avatar from "@mui/material/Avatar";

// Open source UI visual tool to build your customized LLM orchestration flow & AI agents.

const steps = [
  "Service Type",
  "Service Info",
  "Service Handler",
  "Service Installer",
  "Service Category",
  "Review",
];

const categories = {
  httpServer: HttpServer,
};

const lastStep = steps.length - 1;

export default function AddDialog() {
  const showAddDialog = useShowAddDialog((state) => state);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [isSteppable, setIsSteppable] = useState(steps.map((s, i) => i === 0));
  const [type, setType] = useState<"existing" | "new">("existing");
  const handlers = useHandlers((state) => state.list);
  const [handler, setHandler] = useState<ServiceHandler | null>(null);
  const [wrapperInputs, setWrapperInputs] = useState<Record<string, any>>({});
  const [category, setCategory] = useState("");
  const [categoryOptions, setCategoryOptions] = useState<Record<string, any>>(
    {}
  );
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    setIsSteppable((s) =>
      s.map((ss, i) => {
        if (i === 1) {
          return name.length > 0 && description.length > 0;
        }
        return ss;
      })
    );
  }, [name, description]);

  useEffect(() => {
    if (handler) {
      const obj: Record<string, any> = {};
      handler.wrapper.inputs.forEach((input) => {
        if (input.type[type].name === "text") {
          obj[input.key] = "";
        } else if (input.type[type].name === "directory") {
          obj[input.key] = "/";
        } else {
          obj[input.key] = undefined;
        }
      });
      setWrapperInputs(obj);
    }
  }, [handler, type]);

  useEffect(() => {
    Promise.all(
      Object.keys(wrapperInputs).map(async (inputKey) => {
        const input = find(handler?.wrapper.inputs, { key: inputKey })!;

        if (!input.required) {
          return true;
        }

        const value = wrapperInputs[inputKey];

        const inputType = input.type[type];

        if (inputType.name === "text") {
          if ("regularExpression" in inputType) {
            const regexp = new RegExp(
              inputType.regularExpression!.expression,
              inputType.regularExpression!.flags.join("")
            );
            return regexp.test(value);
          }
        } else if (inputType.name === "directory") {
          const res = await fetch("/api/utils/fs/exists/directory", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ path: value }),
          });
          if (!res.ok) {
            return false;
          }
          const { exists } = await res.json();

          if (!exists) {
            return false;
          }

          if ("hasFile" in inputType) {
            const res = await fetch("/api/utils/fs", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ directory: value }),
            });
            const files = await res.json();

            const regexp = new RegExp(
              inputType.hasFile!.regularExpression!.expression,
              inputType.hasFile!.regularExpression!.flags.join("")
            );

            return filter(files, { type: "file" }).some((f) =>
              regexp.test(f.name)
            );
          }
        }

        return false;
      })
    ).then((results) => {
      const isDone = every(results);

      setIsSteppable((i) =>
        i.map((i, j) => {
          if (j === 2) {
            return isDone;
          }
          return i;
        })
      );
    });
  }, [wrapperInputs, handler, type]);

  useEffect(() => {
    if (activeStep === 3 && type === "existing") {
      setActiveStep(4);
    }
  }, [activeStep, type]);

  const getImage = (image: File | null) =>
    new Promise((resolve) => {
      if (!image) {
        resolve("");
      } else {
        const reader = new FileReader();

        reader.addEventListener(
          "load",
          () => {
            resolve(reader.result);
          },
          false
        );

        reader.readAsDataURL(image);
      }
    });

  const handleInstall = useCallback(async () => {
    const res = await fetch("/api/services", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type,
        name,
        description,
        handler,
        wrapperInputs,
        category,
        categoryOptions,
        image: await getImage(image),
      }),
    });
    if (res.ok) {
      showAddDialog.off();
      loadServices();
      reset()
    }
  }, [
    type,
    name,
    description,
    handler,
    wrapperInputs,
    category,
    categoryOptions,
    showAddDialog,
    image,
  ]);

  const reset = () => {
    setActiveStep(0);
    showAddDialog.off();
    setIsSteppable(steps.map((s, i) => i === 0));
    setName("");
    setDescription("");
    setHandler(null);
    setCategory("");
    setWrapperInputs({});
  };

  let title = "Add new service";

  if (activeStep > 0) {
    if (type === "existing") {
      title = "Add wrapper around existing service";

      if (activeStep > 1) {
        if (handler) {
          title = `Add ${handler.name} wrapper around existing service "${name}"`;
        } else {
          title = `Add wrapper around existing service "${name}"`;
        }
      }
    }
  }

  const replaceLiveServices = useServices((state) => state.replace);

  const loadServices = async () => {
    const res = await fetch("/api/services");
    const data = await res.json();
    replaceLiveServices(data);
  };

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
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        {activeStep === 0 && (
          <Stack spacing={2} pt={1}>
            <FormControl>
              <FormLabel id="demo-radio-buttons-group-label">Options</FormLabel>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="existing"
                name="radio-buttons-group"
                onChange={(e) => {
                  setType(e.target.value as "existing");
                }}
              >
                <FormControlLabel
                  value="existing"
                  control={<Radio />}
                  label="Create a wrapper for a service already installed on your computer"
                />
                <FormControlLabel
                  value="new"
                  control={<Radio />}
                  label="Install a new service"
                />
              </RadioGroup>
            </FormControl>
          </Stack>
        )}

        {activeStep === 1 && (
          <Stack spacing={2} pt={1}>
            <TextField
              fullWidth
              label="Name"
              placeholder="Service name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              fullWidth
              label="Description"
              placeholder="Service description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Uploader
              onChange={setImage}
              display={(file) => (
                <Avatar src={URL.createObjectURL(file.value)} />
              )}
            />
          </Stack>
        )}

        {activeStep === 2 && !handler && (
          <Stack spacing={2} pt={1}>
            <Autocomplete
              value={handler}
              onChange={(e, opt) => {
                if (opt) {
                  setHandler(opt);
                } else {
                  setHandler(null);
                }
              }}
              options={handlers}
              getOptionLabel={(handler) => handler.name}
              renderInput={(params) => (
                <TextField {...params} label="Handler" />
              )}
            />
          </Stack>
        )}

        {activeStep === 2 && handler && (
          <Stack spacing={2} pt={1}>
            {handler.wrapper.inputs.map((input) => {
              let content;

              if (input.type[type].name === "text") {
                content = (
                  <TextInput
                    input={input}
                    value={wrapperInputs[input.key]}
                    onChange={(value) =>
                      setWrapperInputs((wi) => ({
                        ...wi,
                        [input.key]: value,
                      }))
                    }
                  />
                );
              } else if (input.type[type].name === "directory") {
                content = (
                  <DirectoryInput
                    input={input}
                    value={wrapperInputs[input.key] || "/"}
                    onChange={(value) =>
                      setWrapperInputs((wi) => ({
                        ...wi,
                        [input.key]: value,
                      }))
                    }
                  />
                );
              }

              return (
                <Stack key={input.key} spacing={2}>
                  <Typography variant="h6">{input.name}</Typography>
                  <Typography>{input.description}</Typography>
                  {content}
                </Stack>
              );
            })}
          </Stack>
        )}

        {activeStep === 4 && (
          <Stack spacing={2} pt={1}>
            <CategoryPicker
              onChange={(category) => {
                setCategory(category.key);
                setIsSteppable((ss) =>
                  ss.map((s, i) => {
                    if (i === 4) {
                      return true;
                    }
                    return s;
                  })
                );
              }}
            />
          </Stack>
        )}

        {activeStep === 5 && (
          <Stack spacing={2} pt={1}>
            <Stack direction="row" spacing={2}>
              <Typography sx={{ fontWeight: "bold", width: 180 }}>
                Name
              </Typography>
              <Typography>{name}</Typography>
            </Stack>

            <Stack direction="row" spacing={2}>
              <Typography sx={{ fontWeight: "bold", width: 180 }}>
                Description
              </Typography>
              <Typography>{description}</Typography>
            </Stack>

            <Stack direction="row" spacing={2}>
              <Typography sx={{ fontWeight: "bold", width: 180 }}>
                Image
              </Typography>
              {image && <Avatar src={URL.createObjectURL(image)} />}
            </Stack>

            <Stack direction="row" spacing={2}>
              <Typography sx={{ fontWeight: "bold", width: 120 }}>
                Type
              </Typography>
              <Typography>{type === "new" ? "New" : "Existing"}</Typography>
            </Stack>

            <Stack direction="row" spacing={2}>
              <Typography sx={{ fontWeight: "bold", width: 180 }}>
                Handler
              </Typography>
              <Typography>{handler!.name}</Typography>
            </Stack>

            <Stack direction="row" spacing={2}>
              <Typography sx={{ fontWeight: "bold", width: 180 }}>
                Category
              </Typography>
              <Typography>{category}</Typography>
            </Stack>

            <Stack direction="row" spacing={2}>
              <Typography sx={{ fontWeight: "bold", width: 180 }}>
                Inputs:
              </Typography>
              <Stack>
                {Object.keys(wrapperInputs).map((inputKey) => (
                  <Stack direction="row" spacing={2} key={inputKey}>
                    <Typography sx={{ fontWeight: "bold", width: 180 }}>
                      {
                        find(handler?.wrapper.inputs, {
                          key: inputKey,
                        })!.name
                      }
                    </Typography>
                    <Typography>{wrapperInputs[inputKey]}</Typography>
                  </Stack>
                ))}
              </Stack>
            </Stack>
          </Stack>
        )}

        <Stack pt={4}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label, step) => (
              <Step key={label}>
                <StepButton
                  color="inherit"
                  onClick={() => {
                    setActiveStep(step);
                  }}
                >
                  <StepLabel>{label}</StepLabel>
                </StepButton>
              </Step>
            ))}
          </Stepper>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={reset} color="secondary">
          Cancel
        </Button>
        <Button
          onClick={() => {
            if (activeStep === lastStep) {
              handleInstall();
            } else {
              setActiveStep((a) => a + 1);
            }
          }}
          autoFocus
          disabled={activeStep !== lastStep && !isSteppable[activeStep]}
        >
          {activeStep === 5 ? "Create" : "Next"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
