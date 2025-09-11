"use client";

import { Typography } from "@mui/material";
import { DashboardLayout } from "@/app/components/dashboard/app-layout";

const Campaign = () => {
  return (
    <DashboardLayout title="Campanhas">
      <Typography variant="h4" sx={{ marginBottom: 2 }}>
        Campanhas de Marketing
      </Typography>
      <Typography sx={{ marginBottom: 2 }}>
        Esta é a página de campanhas. Aqui você pode gerenciar todas as suas
        campanhas de marketing e acompanhar o desempenho das mesmas.
      </Typography>
    </DashboardLayout>
  );
};

export default Campaign;
