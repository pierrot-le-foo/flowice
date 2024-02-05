"use client";
import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import TableBody from "@mui/material/TableBody";
import { useEffect, useState } from "react";
import { orderBy } from "lodash";
import { useHandlers, useSearch, useServices } from "@/stores/stores";
import AddDialog from "@/components/AddDialog";
import ServicesHead from "@/components/ServicesHead";
import EmptyServices from "@/components/EmptyServices";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import Service from "@/components/Service";
import ServiceDialog from "@/components/ServiceDialog";
import Typography from "@mui/material/Typography";

export default function Home() {
  const liveServices = useServices((state) => state.list);
  const replaceLiveServices = useServices((state) => state.replace);
  const search = useSearch((state) => state.value);

  const setHandlers = useHandlers((state) => state.replace);

  const getHandlers = async () => {
    const res = await fetch("/api/marketplace/handlers");
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

  if (search) {
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
      <TableContainer>
        <Table>
          <ServicesHead />

          <TableBody>
            {services.map((service) => (
              <Service key={service.id} service={service} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <AddDialog />

      <ServiceDialog />

      {services.length === 0 && loading && (
        <Stack sx={{ flex: 1 }} justifyContent="center" alignItems="center">
          <CircularProgress />
        </Stack>
      )}

      {services.length === 0 && !loading && !search && <EmptyServices />}

      {services.length === 0 && search && !loading && (
        <Stack sx={{ flex: 1 }} justifyContent="center" alignItems="center">
          <Typography variant="h4">No services match your search</Typography>
        </Stack>
      )}
    </>
  );
}
