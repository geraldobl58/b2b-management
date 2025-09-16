import { Box, Button, Link, Typography } from "@mui/material";
import { PlusIcon } from "lucide-react";

const ClientsIdPage = () => {
  return (
    <Box className="mb-4 flex items-start justify-between">
      <Box>
        <Typography variant="h4" sx={{ marginBottom: 2 }}>
          Clientes
        </Typography>
        <Typography sx={{ marginBottom: 2 }}>
          Gerencie os clientes cadastrados no sistema B2B, aqui você pode
          adicionar, editar ou remover clientes conforme necessário.
        </Typography>
      </Box>
      <Box>
        <Link href="/clients/new">
          <Button variant="contained" color="primary">
            <PlusIcon />
            Adicionar Cliente
          </Button>
        </Link>
      </Box>
    </Box>
  );
};

export default ClientsIdPage;
