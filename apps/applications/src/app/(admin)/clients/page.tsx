import { Typography } from "@mui/material";
import { DashboardLayout } from "@/components/layout/app-layout";
import { ClientForm } from "./components/client-form";

const ClientsIdPage = () => {
  return (
    <DashboardLayout title="Gerenciamento de Clientes">
      <Typography variant="h4" sx={{ marginBottom: 2 }}>
        Clientes
      </Typography>
      <div>
        <ClientForm />
      </div>
    </DashboardLayout>
  );
};

export default ClientsIdPage;
