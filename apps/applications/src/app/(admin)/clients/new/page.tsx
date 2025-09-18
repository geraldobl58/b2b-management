"use client";

import { useRouter } from "next/navigation";
import { Box } from "@mui/material";
import { Header } from "@/components/header";
import { ClientForm } from "../_components/client-form";

const NewClientPage = () => {
  const router = useRouter();

  const handleSuccess = () => {
    router.push("/clients");
  };

  return (
    <Box>
      <Header
        title="Novo Cliente"
        description="Cadastre um novo cliente preenchendo as informações abaixo."
      />
      <ClientForm onSuccess={handleSuccess} />
    </Box>
  );
};

export default NewClientPage;
