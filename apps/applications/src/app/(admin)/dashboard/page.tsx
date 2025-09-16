"use client";

import { Header } from "@/components/header";
import { Box } from "@mui/material";

const Dashboard = () => {
  return (
    <Box>
      <Header
        title="Dashboard"
        description="Gerencie o dashboard da sua empresa, aqui você pode visualizar métricas e informações importantes."
      />
    </Box>
  );
};

export default Dashboard;
