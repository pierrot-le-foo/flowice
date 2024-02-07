import Uploader from "@/components/Uploader";
import { ServiceHandler } from "@/types";
import Autocomplete from "@mui/material/Autocomplete";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
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
import Installer from "@/components/Installer";
import TextInput from "@/components/TextInput";
import DirectoryInput from "@/components/DirectoryInput";
import Typography from "@mui/material/Typography";
import CategoryPicker from "@/components/CategoryPicker";
import {
  every,
  filter,
  find,
  get,
  isEmpty,
  template,
  templateSettings,
} from "lodash";
import Alert from "@mui/material/Alert";

export enum AppCreatorStep {
  SERVICE_TYPE = "Service Type",
  SERVICE_INFO = "Service Info",
  SERVICE_HANDLER = "Service Handler",
  SERVICE_INSTALLER = "Service Installer",
  SERVICE_INPUTS = "Service Inputs",
  SERVICE_CATEGORY = "Service Category",
  SERVICE_REVIEW = "Review",
}

export enum AppCreatorType {
  NEW = "new",
  EXISTING = "existing",
}

export enum AppCreatorActionStatus {
  IN_PROGRESS = "in progress",
  DONE = "done",
  FAILED = "failed",
}

export enum AppCreatorActionName {
  CLONE_REPO = "Clone repository",
  VERIFY_TARGET_APP = "Verify Target App Exists",
  VERIFY_DOCKER_COMPOSE = "Verify docker-compose file exists",
  VERIFY_INPUTS = "Verify inputs",
  CREATE_SERVICE = "Create service",
}

interface AppCreatorAction {
  name: AppCreatorActionName;
  status: AppCreatorActionStatus;
}

export class AppCreator {
  static steps = [
    AppCreatorStep.SERVICE_TYPE,
    AppCreatorStep.SERVICE_INFO,
    AppCreatorStep.SERVICE_HANDLER,
    AppCreatorStep.SERVICE_INSTALLER,
    AppCreatorStep.SERVICE_INPUTS,
    AppCreatorStep.SERVICE_CATEGORY,
    AppCreatorStep.SERVICE_REVIEW,
    // "Service Type",
    // "Service Info",
    // "Service Handler",
    // "Service Installer",
    // "Service Category",
    // "Review",
  ];

  static setImage = (image: File | null): Promise<string> =>
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

  step = 0;
  isSteppable = true;
  type: AppCreatorType = AppCreatorType.EXISTING;
  name = "";
  description = "";
  image = "";
  handlers: ServiceHandler[] = [];
  handler: ServiceHandler | null = null;
  inputs: Record<string, any> = {};
  inputsFilled: Record<string, any> = {};
  category: Record<string, any> = {};
  actions: AppCreatorAction[] = [];
  creating = false;
  installer: Record<string, any> = {};
  errors: string[] = [];

  newAction(name: AppCreatorActionName) {
    this.actions.push({ name, status: AppCreatorActionStatus.IN_PROGRESS });
  }

  actionDone(name: AppCreatorActionName) {
    this.actions = this.actions.map((action) => {
      if (action.name === name) {
        return { ...action, status: AppCreatorActionStatus.DONE };
      }
      return action;
    });
  }

  actionFailed(name: AppCreatorActionName) {
    this.actions = this.actions.map((action) => {
      if (action.name === name) {
        return { ...action, status: AppCreatorActionStatus.FAILED };
      }
      return action;
    });
  }

  reset() {
    this.step = 0;
    this.isSteppable = true;
    this.type = AppCreatorType.EXISTING;
    this.name = "";
    this.description = "";
    this.image = "";
    this.handlers = [];
    this.handler = null;
    this.inputs = {};
    this.inputsFilled = {};
    this.category = {};
    this.creating = false;
    this.installer = {};
    this.errors = [];
  }

  emitter: () => void = () => {};

  on(emitter: () => void) {
    this.emitter = emitter;
  }

  emit() {
    this.emitter();
  }

  async create() {
    this.creating = true;
    this.errors = [];
    this.emit();

    if (this.type === AppCreatorType.NEW) {
      if (this.installer.type === "github") {
        this.newAction(AppCreatorActionName.CLONE_REPO);
        this.emit();

        const res = await fetch("/api/utils/github/clone", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.installer),
        });

        if (!res.ok) {
          this.actionFailed(AppCreatorActionName.CLONE_REPO);
          this.emit();
          return;
        }

        this.actionDone(AppCreatorActionName.CLONE_REPO);
        this.emit();

        templateSettings.interpolate = /{{([\s\S]+?)}}/g;

        for (const input of this.handler!.wrapper.inputs) {
          const install = find(input.type.new, { type: this.installer.type })!;

          const installer = this.installer;

          console.log({ install, installer });
          const compiler = template(install.use);

          const compiled = compiler({ installer });

          console.log({
            installer,
            compiled,
            result: get(this.installer, compiled),
            key: input.key,
          });

          this.inputs[input.key] = compiled;
        }

        console.log({
          installer: this.installer,
          inputs: this.inputs,
        });
      }
    }

    this.newAction(AppCreatorActionName.VERIFY_INPUTS);
    this.emit();

    const ok = await this.verifyInputs();

    if (!ok) {
      this.actionFailed(AppCreatorActionName.VERIFY_INPUTS);
      this.emit();
    } else {
      this.actionDone(AppCreatorActionName.VERIFY_INPUTS);
      this.emit();

      this.newAction(AppCreatorActionName.CREATE_SERVICE);
      this.emit();

      const res = await fetch("/api/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: this.type,
          name: this.name,
          description: this.description,
          handler: this.handler,
          wrapperInputs: this.inputs,
          category: this.category,
          image: this.image,
        }),
      });

      if (!res.ok) {
        this.actionFailed(AppCreatorActionName.CREATE_SERVICE);
        this.emit();
      } else {
        this.actionDone(AppCreatorActionName.CREATE_SERVICE);
        this.creating = false;
        this.emit();
      }
    }
  }

  verifyInputs = async () => {
    const results = await Promise.all(
      Object.keys(this.inputs).map(async (inputKey) => {
        const input = find(this.handler!.wrapper.inputs, { key: inputKey })!;

        console.log("verifying input", input);

        if (!input.required) {
          return true;
        }

        const value = this.inputs[inputKey];

        const inputType = input.type[this.type];

        if (inputType.name === "text") {
          if ("regularExpression" in inputType) {
            const regexp = new RegExp(
              inputType.regularExpression!.expression,
              inputType.regularExpression!.flags.join("")
            );
            return regexp.test(value);
          }
        } else if (inputType.name === "directory") {
          this.newAction(AppCreatorActionName.VERIFY_TARGET_APP);
          this.emit();

          const res = await fetch("/api/utils/fs/exists/directory", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ path: value }),
          });
          if (!res.ok) {
            this.errors.push(
              `API error when asking if directory "${value}" exists`
            );
            this.actionFailed(AppCreatorActionName.VERIFY_TARGET_APP);
            return false;
          }

          const { exists } = await res.json();

          if (!exists) {
            this.errors.push(`Directory "${value}" does not exist`);
            this.actionFailed(AppCreatorActionName.VERIFY_TARGET_APP);
            this.emit();
            return false;
          }

          this.actionDone(AppCreatorActionName.VERIFY_TARGET_APP);
          this.emit();

          if ("hasFile" in inputType) {
            this.newAction(AppCreatorActionName.VERIFY_DOCKER_COMPOSE);
            this.emit();

            const res = await fetch("/api/utils/fs", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ directory: value }),
            });

            if (!res.ok) {
              this.actionFailed(AppCreatorActionName.VERIFY_DOCKER_COMPOSE);
              this.errors.push(
                `API error when trying to get stats from file ${value}`
              );
              this.emit();
              return;
            }

            const stats = await res.json();

            const regexp = new RegExp(
              inputType.hasFile!.regularExpression!.expression,
              inputType.hasFile!.regularExpression!.flags.join("")
            );

            const isFile = stats.type === "file";

            if (!isFile) {
              this.actionFailed(AppCreatorActionName.VERIFY_DOCKER_COMPOSE);
              this.errors.push(`File "${value}" is not a file`);
              this.emit();
              return true;
            }

            const match = regexp.test(stats.name);

            if (!match) {
              this.actionFailed(AppCreatorActionName.VERIFY_DOCKER_COMPOSE);
              this.errors.push(
                `File "${value}" does not match regular express ${regexp}`
              );
              this.emit();
              return;
            }

            this.actionDone(AppCreatorActionName.VERIFY_DOCKER_COMPOSE);
            return true;
          }
        }

        return true;
      })
    );
    return every(results);
  };

  renderStepper() {
    return (
      <Stack py={2}>
        <Stepper activeStep={this.step} alternativeLabel>
          {AppCreator.steps.map((label, step) => (
            <Step key={label}>
              <StepButton
                color="inherit"
                onClick={() => {
                  if (this.step !== step) {
                    this.step = step;
                    this.emit();
                  }
                }}
              >
                <StepLabel>{label}</StepLabel>
              </StepButton>
            </Step>
          ))}
        </Stepper>
      </Stack>
    );
  }

  renderNextButton() {
    const step = AppCreator.steps[this.step];

    if (step === AppCreatorStep.SERVICE_TYPE) {
      this.isSteppable = true;
    } else if (step === AppCreatorStep.SERVICE_INFO) {
      this.isSteppable = !!this.name && !!this.description;
    } else if (step === AppCreatorStep.SERVICE_HANDLER) {
      this.isSteppable = !!this.handler;
    } else if (step === AppCreatorStep.SERVICE_INSTALLER) {
      if (this.type === AppCreatorType.EXISTING) {
        this.isSteppable = this.handler!.wrapper.inputs.every(
          (input) => !!this.inputsFilled[input.key]
        );
      } else {
        this.isSteppable = !isEmpty(this.installer);
      }
    } else if (step === AppCreatorStep.SERVICE_CATEGORY) {
      this.isSteppable = !isEmpty(this.category);
    } else if (step === AppCreatorStep.SERVICE_REVIEW) {
      this.isSteppable = true;
    }

    return (
      <Button
        onClick={() => {
          if (step === AppCreatorStep.SERVICE_REVIEW) {
            this.create();
          } else {
            this.step = this.step + 1;
            this.emit();
          }
        }}
        disabled={!this.isSteppable || this.creating}
      >
        Next
      </Button>
    );
  }

  renderErrors() {
    return (
      <Stack>
        {this.errors.map((error, errorIndex) => (
          <Alert key={errorIndex} severity="error">
            {error}
          </Alert>
        ))}
      </Stack>
    );
  }

  renderServiceType() {
    return (
      <Stack spacing={2} pt={1}>
        <FormControl>
          <FormLabel id="demo-radio-buttons-group-label">Options</FormLabel>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue="existing"
            name="radio-buttons-group"
            onChange={(e) => {
              // setType(e.target.value as "existing");
              if (e.target.value === "existing") {
                this.type = AppCreatorType.EXISTING;
              } else {
                this.type = AppCreatorType.NEW;
              }
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
    );
  }

  renderServiceInfo() {
    return (
      <Stack spacing={2} pt={1}>
        <TextField
          fullWidth
          label="Name"
          placeholder="Service name"
          value={this.name}
          onChange={(e) => {
            this.name = e.target.value;
            this.emit();
          }}
        />
        <TextField
          fullWidth
          label="Description"
          placeholder="Service description"
          value={this.description}
          onChange={(e) => {
            {
              this.description = e.target.value;
              this.emit();
            }
          }}
        />
        <Uploader
          onChange={async (file) => {
            this.image = await AppCreator.setImage(file);
            this.emit();
          }}
          display={(file) => <Avatar src={URL.createObjectURL(file.value)} />}
        />
      </Stack>
    );
  }

  renderServiceHandler() {
    return (
      <Stack spacing={2} pt={1}>
        <Autocomplete
          value={this.handler}
          onChange={(e, opt) => {
            this.handler = opt;
            this.emit();
          }}
          options={this.handlers}
          getOptionLabel={(handler) => handler.name}
          renderInput={(params) => <TextField {...params} label="Handler" />}
        />
      </Stack>
    );
  }

  renderInstaller() {
    return (
      <Stack spacing={2} pt={1}>
        <Installer
          onInfo={(info) => {
            this.installer = info;
            this.emit();
          }}
        />
      </Stack>
    );
  }

  renderInputs() {
    if (!this.handler) {
      return <div>Please pick handler</div>;
    }

    return (
      <Stack spacing={2} pt={1}>
        {this.handler.wrapper.inputs.map((input) => {
          let content;

          const onChange = (value: any) => {
            this.inputsFilled[input.key] = true;
            this.inputs[input.key] = value;
            this.emit();
          };

          if (input.type[this.type].name === "text") {
            content = (
              <TextInput
                input={input}
                value={this.inputs[input.key]}
                onChange={onChange}
              />
            );
          } else if (input.type[this.type].name === "directory") {
            content = (
              <DirectoryInput
                input={input}
                value={this.inputs[input.key] || "/"}
                onChange={onChange}
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
    );
  }

  renderCategory() {
    return (
      <Stack spacing={2} pt={1}>
        <CategoryPicker
          onChange={(category) => {
            this.category = category;
            this.emit();
          }}
        />
      </Stack>
    );
  }

  renderReview() {
    return (
      <Stack spacing={2} pt={1}>
        <Stack direction="row" spacing={2}>
          <Typography sx={{ fontWeight: "bold", width: 180 }}>Name</Typography>
          <Typography>{this.name}</Typography>
        </Stack>

        <Stack direction="row" spacing={2}>
          <Typography sx={{ fontWeight: "bold", width: 180 }}>
            Description
          </Typography>
          <Typography>{this.description}</Typography>
        </Stack>

        <Stack direction="row" spacing={2}>
          <Typography sx={{ fontWeight: "bold", width: 180 }}>Image</Typography>
          {this.image && <Avatar src={this.image} />}
        </Stack>

        <Stack direction="row" spacing={2}>
          <Typography sx={{ fontWeight: "bold", width: 120 }}>Type</Typography>
          <Typography>{this.type}</Typography>
        </Stack>

        <Stack direction="row" spacing={2}>
          <Typography sx={{ fontWeight: "bold", width: 180 }}>
            Handler
          </Typography>
          <Typography>{this.handler!.name}</Typography>
        </Stack>

        <Stack direction="row" spacing={2}>
          <Typography sx={{ fontWeight: "bold", width: 180 }}>
            Category
          </Typography>
          <Typography>{this.category.label}</Typography>
        </Stack>

        <Stack direction="row" spacing={2}>
          <Typography sx={{ fontWeight: "bold", width: 180 }}>
            Inputs:
          </Typography>
          <Stack>
            {Object.keys(this.inputs).map((inputKey) => (
              <Stack direction="row" spacing={2} key={inputKey}>
                <Typography sx={{ fontWeight: "bold", width: 180 }}>
                  {
                    find(this.handler!.wrapper.inputs, {
                      key: inputKey,
                    })!.name
                  }
                </Typography>
                <Typography>{this.inputs[inputKey]}</Typography>
              </Stack>
            ))}
          </Stack>
        </Stack>
      </Stack>
    );
  }

  renderActions() {
    return (
      <Stack>
        {this.actions.map((action, actionIndex) => (
          <Alert
            key={action.name}
            severity={
              action.status === "in progress"
                ? "info"
                : action.status === "done"
                ? "success"
                : "error"
            }
          >
            {action.name}
          </Alert>
        ))}
      </Stack>
    );
  }

  render() {
    const step = AppCreator.steps[this.step];

    if (step === AppCreatorStep.SERVICE_TYPE) {
      return this.renderServiceType();
    }

    if (step === AppCreatorStep.SERVICE_INFO) {
      this.isSteppable = false;
      return this.renderServiceInfo();
    }

    if (step === AppCreatorStep.SERVICE_HANDLER) {
      this.isSteppable = false;
      return this.renderServiceHandler();
    }

    if (step === AppCreatorStep.SERVICE_INSTALLER) {
      if (this.type === AppCreatorType.NEW) {
        this.isSteppable = false;
        return this.renderInstaller();
      } else {
        this.step += 1;
        this.emit();
      }
    }

    if (step === AppCreatorStep.SERVICE_INPUTS) {
      this.isSteppable = false;
      return this.renderInputs();
    }

    if (step === AppCreatorStep.SERVICE_CATEGORY) {
      this.isSteppable = false;
      return this.renderCategory();
    }

    if (step === AppCreatorStep.SERVICE_REVIEW) {
      this.isSteppable = false;
      return this.renderReview();
    }

    return <div>Unhandled step</div>;
  }
}
