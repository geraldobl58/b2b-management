"use client";

import { useRouter } from "next/navigation";
import { Box } from "@mui/material";
import { Header } from "@/components/header";
import { ClientForm } from "../components/client-form";

const ClientIdPage = () => {
  const router = useRouter();

  const handleSuccess = () => {
    router.push("/clients");
  };

  return (
    <Box>
      <Header
        title="Editar Cliente"
        description="Edite as informações do cliente selecionado."
      />
      <ClientForm onSuccess={handleSuccess} />
    </Box>
  );
};

export default ClientIdPage;
