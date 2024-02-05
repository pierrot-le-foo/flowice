"use client";
import { ServiceHandler } from "@/types";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import { chunk, omit } from "lodash";
import { useEffect, useState } from "react";
import semver from "semver";

export default function MarketplacePage() {
  const [tab, setTab] = useState(0);
  const [services, setServices] = useState<any[]>([]);
  const [handlers, setHandlers] = useState<
    (ServiceHandler & { installed: boolean })[]
  >([]);
  const [installingHandler, setInstallingHandler] = useState(false);

  const getServices = async () => {
    const res = await fetch("/api/marketplace/services");
    const data = await res.json();
    setServices(data);
  };

  const getHandlers = async () => {
    const res = await fetch("/api/marketplace/handlers");
    const data = await res.json();
    setHandlers(data);
  };

  const installHandler = async (
    handler: ServiceHandler & { installed: boolean }
  ) => {
    setInstallingHandler(true);
    const h = omit(handler, "installed");
    await fetch("/api/marketplace/handlers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(handler),
    });
    setInstallingHandler(false);
  };

  useEffect(() => {
    getServices();
    getHandlers();
  }, []);

  const chunk_services = chunk(services, 3);
  const chunk_handlers = chunk(handlers, 3);

  console.log({ semver });

  return (
    <Stack p={4} spacing={3}>
      <Typography variant="h3">Marketplace</Typography>

      <Tabs value={tab} onChange={(e, t) => setTab(t)} variant="fullWidth">
        <Tab label="Services" />
        <Tab label="Handlers" />
      </Tabs>

      {tab === 0 &&
        chunk_services.map((c, i) => (
          <Stack key={i} direction="row" spacing={3}>
            {c.map((service) => (
              <Paper
                key={service.key}
                elevation={10}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={3}
                  sx={{ flex: 1 }}
                  p={3}
                >
                  <Avatar src={service.image} sx={{ width: 60, height: 60 }}>
                    {service.name}
                  </Avatar>
                  <Stack spacing={1}>
                    <Typography variant="h4">{service.name}</Typography>
                    <Typography variant="h6">{service.description}</Typography>
                  </Stack>
                </Stack>

                <Stack direction="row" justifyContent="space-between" p={2}>
                  <Stack direction="row" spacing={2}>
                    <Typography>Handler</Typography>
                    <Typography>{service.handler.name}</Typography>
                  </Stack>

                  <Stack direction="row" spacing={2}>
                    <Typography>Category</Typography>
                    <Typography>{service.category.type}</Typography>
                  </Stack>
                </Stack>

                <Stack
                  direction="row"
                  justifyContent="flex-end"
                  p={2}
                  spacing={2}
                >
                  <Button>Website</Button>
                  <Button>Install</Button>
                </Stack>
              </Paper>
            ))}
            {c.length === 1 && (
              <>
                <Stack sx={{ flex: 1 }} />
                <Stack sx={{ flex: 1 }} />
              </>
            )}
            {c.length === 2 && (
              <>
                <Stack sx={{ flex: 1 }} />
              </>
            )}
          </Stack>
        ))}

      {tab === 1 &&
        chunk_handlers.map((c, i) => (
          <Stack key={i} direction="row" spacing={3}>
            {c.map((handler) => (
              <Paper
                key={handler.key}
                elevation={10}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={3}
                  sx={{ flex: 1 }}
                  p={3}
                >
                  <Avatar src={handler.image} sx={{ width: 60, height: 60 }}>
                    {handler.name}
                  </Avatar>
                  <Stack spacing={1}>
                    <Typography variant="h4">{handler.name}</Typography>
                    <Typography variant="h6">{handler.description}</Typography>
                  </Stack>
                </Stack>

                <Stack direction="row" justifyContent="flex-end" p={2}>
                  <Button
                    onClick={() => {
                      installHandler(handler);
                    }}
                    disabled={handler.installed || installingHandler}
                  >
                    Install{handler.installed ? "ed" : ""}
                  </Button>

                  {/* {handler.installed &&
                    !semver.statisfies(handler.installed, handler.version) && <Button>Update</Button>} */}
                </Stack>
              </Paper>
            ))}
            {c.length === 1 && (
              <>
                <Stack sx={{ flex: 1 }} />
                <Stack sx={{ flex: 1 }} />
              </>
            )}
            {c.length === 2 && (
              <>
                <Stack sx={{ flex: 1 }} />
              </>
            )}
          </Stack>
        ))}
    </Stack>
  );
}
