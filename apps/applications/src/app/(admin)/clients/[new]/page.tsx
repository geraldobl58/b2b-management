import { Box } from "@mui/material";
import { Header } from "@/components/header";

import { ClientForm } from "../components/client-form";

const NewClientPage = () => {
  return (
    <Box>
      <Header
        title="Clientes"
        description="Gerencie os clientes da sua empresa, aqui você pode adicionar, editar ou remover clientes."
      />
      <ClientForm />
    </Box>
  );
};

export default NewClientPage;
