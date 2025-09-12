"use client";

import { Typography } from "@mui/material";
import { DashboardLayout } from "@/components/layout/app-layout";

const Dashboard = () => {
  return (
    <DashboardLayout title="Dashboard">
      <Typography variant="h4" sx={{ marginBottom: 2 }}>
        Dashboard Principal
      </Typography>
      <Typography sx={{ marginBottom: 2 }}>
        Bem-vindo ao sistema de gerenciamento B2B. Use o menu lateral para
        navegar entre as diferentes seções.
      </Typography>
    </DashboardLayout>
  );
};

export default Dashboard;
