"use client";

import { PlusIcon } from "lucide-react";
import { Button } from "@mui/material";

import { Header } from "@/components/header";

interface CampaignHeaderProps {
  onAddCampaign: () => void;
}

export const CampaignHeader = ({ onAddCampaign }: CampaignHeaderProps) => {
  return (
    <Header
      title="Campanhas"
      description="Gerencie as campanhas da sua empresa, aqui você pode adicionar, editar ou remover campanhas."
      content={
        <Button
          className="normal-case"
          variant="contained"
          color="primary"
          startIcon={<PlusIcon />}
          onClick={onAddCampaign}
        >
          Adicionar Campanha
        </Button>
      }
    />
  );
};
