import { Header } from "@/components/header";
import { Box, Button } from "@mui/material";
import { PlusIcon } from "lucide-react";

const ClientsIdPage = () => {
  return (
    <Box>
      <Header
        title="Clientes"
        description="Gerencie os clientes da sua empresa, aqui você pode adicionar, editar ou remover clientes."
        content={
          <>
            <Button className="normal-case" variant="contained" color="primary">
              <PlusIcon className="mr-2" size={16} />
              Adicionar Cliente
            </Button>
          </>
        }
      />
    </Box>
  );
};

export default ClientsIdPage;
