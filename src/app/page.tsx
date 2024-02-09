"use client";
import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import TableBody from "@mui/material/TableBody";
import { useEffect, useState } from "react";
import { orderBy } from "lodash";
import { useHandlers, useSearch, useServices, useShowSearch } from "@/stores/stores";
import AddDialog from "@/components/AddDialog";
import ServicesHead from "@/components/ServicesHead";
import EmptyServices from "@/components/EmptyServices";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import Service from "@/components/Service";
import Typography from "@mui/material/Typography";
import LogsDialog from "@/components/LogsDialog";
import Button from "@mui/material/Button";

export default function Home() {
  const liveServices = useServices((state) => state.list);
  const replaceLiveServices = useServices((state) => state.replace);
  const search = useSearch((state) => state.value);
  const clearSearch = useSearch((state) => state.replace);
  const searchIsVisible = useShowSearch((state) => state.value);

  const setHandlers = useHandlers((state) => state.replace);

  const getHandlers = async () => {
    const res = await fetch("/api/handlers");
    const data = await res.json();
    setHandlers(data);
  };

  const [loading, setLoading] = useState(true);

  const loadServices = async () => {
    const res = await fetch("/api/services");
    const data = await res.json();
    replaceLiveServices(data);
    setLoading(false);
  };

  useEffect(() => {
    loadServices();
    getHandlers();
  }, []);

  let services = liveServices;

  if (search && searchIsVisible) {
    services = services.filter((services) =>
      services.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  services = orderBy(
    services,
    ["live.status", "service.name"],
    ["desc", "asc"]
  );

  return (
    <>
      <TableContainer sx={{maxHeight: '100dvh'}}>
        <Table stickyHeader>
          <ServicesHead />

          <TableBody>
            {services.map((service) => (
              <Service key={service.id} service={service} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <AddDialog />

      <LogsDialog />

      {services.length === 0 && loading && (
        <Stack sx={{ flex: 1 }} justifyContent="center" alignItems="center">
          <CircularProgress />
        </Stack>
      )}

      {services.length === 0 && !loading && !search && <EmptyServices />}

      {services.length === 0 && search && !loading && (
        <Stack sx={{ flex: 1 }} justifyContent="center" alignItems="center" spacing={4}>
          <Typography variant="h4">No services match your search {'"'}{search}{'"'}</Typography>

          <Button onClick={() => {
            clearSearch('')
          }} variant="outlined">Clear search</Button>
        </Stack>
      )}
    </>
  );
}
