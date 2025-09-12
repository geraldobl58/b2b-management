"use client";

import { Typography } from "@mui/material";
import { DashboardLayout } from "@/components/layout/app-layout";

const Analytics = () => {
  return (
    <DashboardLayout title="Análises">
      <Typography variant="h4" sx={{ marginBottom: 2 }}>
        Análises e Relatórios
      </Typography>
      <Typography sx={{ marginBottom: 2 }}>
        Esta é a página de análises. Aqui você pode visualizar métricas e
        relatórios detalhados sobre o desempenho do seu negócio.
      </Typography>
    </DashboardLayout>
  );
};

export default Analytics;
