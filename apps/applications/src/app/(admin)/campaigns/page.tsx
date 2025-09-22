import { Header } from "@/components/header";
import { StepperContainer } from "@/features/campaigns/components/stepper-container";
import { Box, Button } from "@mui/material";
import { PlusIcon } from "lucide-react";

const Campaign = () => {
  return (
    <Box>
      <Header
        title="Campanhas"
        description="Gerencie as campanhas da sua empresa, aqui você pode adicionar, editar ou remover campanhas."
        content={
          <>
            <Button className="normal-case" variant="contained" color="primary">
              <PlusIcon className="mr-2" size={16} />
              Adicionar Campanha
            </Button>
          </>
        }
      />
      <StepperContainer />
    </Box>
  );
};

export default Campaign;
