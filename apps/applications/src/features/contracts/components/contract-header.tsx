"use client";

import { PlusIcon } from "lucide-react";
import { Button } from "@mui/material";

import { Header } from "@/components/header";

interface ContractHeaderProps {
  onAddContract: () => void;
}

export const ContractHeader = ({ onAddContract }: ContractHeaderProps) => {
  return (
    <Header
      title="Contratos"
      description="Gerencie os contratos da sua empresa, aqui você pode adicionar, editar ou remover contratos."
      content={
        <Button
          className="normal-case"
          variant="contained"
          color="primary"
          startIcon={<PlusIcon />}
          onClick={onAddContract}
        >
          Adicionar Contrato
        </Button>
      }
    />
  );
};
