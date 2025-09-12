import { Typography } from "@mui/material";

import { DashboardLayout } from "@/components/layout/app-layout";
import { FormMembersSettings } from "./components/form-members-settings";

const OrganizationSettingsPage = () => {
  return (
    <DashboardLayout title="Configurações">
      <Typography variant="h4" sx={{ marginBottom: 2 }}>
        Configurações do Sistema
      </Typography>
      <Typography sx={{ marginBottom: 2 }}>
        Esta é a página de configurações. Aqui você pode ajustar as preferências
        do sistema, gerenciar usuários e personalizar a aplicação.
      </Typography>
      <div>
        <FormMembersSettings />
      </div>
    </DashboardLayout>
  );
};

export default OrganizationSettingsPage;
