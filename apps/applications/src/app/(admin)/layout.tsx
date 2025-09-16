import { Box } from "@mui/material";
import { DashboardLayout } from "@/components/layout/app-layout";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DashboardLayout title="Gerenciamento de Clientes">
      <Box>{children}</Box>
    </DashboardLayout>
  );
}
