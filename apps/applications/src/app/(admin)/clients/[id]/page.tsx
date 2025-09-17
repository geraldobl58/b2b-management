"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { Box } from "@mui/material";
import { Header } from "@/components/header";
import { ClientForm } from "../components/client-form";

interface ClientIdPageProps {
  params: Promise<{
    id: string;
  }>;
}

const ClientIdPage = ({ params }: ClientIdPageProps) => {
  const router = useRouter();
  const { id } = use(params);

  const handleSuccess = () => {
    router.push("/clients");
  };

  return (
    <Box>
      <Header
        title="Editar Cliente"
        description="Edite as informações do cliente selecionado."
      />
      <ClientForm mode="edit" client={id} onSuccess={handleSuccess} />
    </Box>
  );
};

export default ClientIdPage;
