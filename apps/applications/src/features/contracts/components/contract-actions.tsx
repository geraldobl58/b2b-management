"use client";

import { useRef } from "react";
import { Alert } from "@mui/material";

import {
  ConfirmationDialog,
  useConfirmationDialog,
  FormDialog,
} from "@/components/common";
import {
  ContractForm,
  ContractFormRef,
} from "@/features/contracts/components/contract-form";
import { FormContractValues } from "@/features/contracts/schemas/contract";
import { Contract } from "@/features/contracts/types/contract";

interface ContractActionsProps {
  openDialog: boolean;
  editingContract: Contract | null;
  selectedContract: Contract | null;
  isCreatingContract: boolean;
  isUpdatingContract: boolean;
  isDeletingContract: boolean;
  deleteContractError?: string | null;
  onCloseDialog: () => void;
  onContractSubmit: (data: FormContractValues) => Promise<void>;
  onDeleteContract: (contractId: string) => void;
  onContractDeleted: () => void;
}

export const ContractActions = ({
  openDialog,
  editingContract,
  selectedContract,
  isCreatingContract,
  isUpdatingContract,
  isDeletingContract,
  deleteContractError,
  onCloseDialog,
  onContractSubmit,
  onDeleteContract,
  onContractDeleted,
}: ContractActionsProps) => {
  const contractFormRef = useRef<ContractFormRef>(null);

  const deleteDialog = useConfirmationDialog({
    title: "Excluir Contrato",
    message:
      "Tem certeza que deseja excluir este contrato? Esta ação não pode ser desfeita.",
    variant: "delete",
    confirmText: "Excluir",
  });

  const handleDeleteConfirm = async () => {
    if (selectedContract) {
      try {
        onDeleteContract(selectedContract.id);
        onContractDeleted();
        deleteDialog.hideDialog();
      } catch (error) {
        console.error("Erro ao deletar contrato:", error);
      }
    }
  };

  return (
    <>
      <FormDialog
        open={openDialog}
        onClose={onCloseDialog}
        onSubmit={async (e) => {
          e.preventDefault();
          console.log("FormDialog onSubmit called - triggering ref submit");

          // Use the ref to trigger form submission
          if (contractFormRef.current) {
            await contractFormRef.current.submit();
          } else {
            console.error("ContractForm ref is not available");
          }
        }}
        title={editingContract ? "Editar Contrato" : "Novo Contrato"}
        mode={editingContract ? "edit" : "create"}
        isLoading={isCreatingContract || isUpdatingContract}
        maxWidth="md"
        fullWidth
      >
        <ContractForm
          ref={contractFormRef}
          key={editingContract?.id || "new"} // Force re-render when switching between create/edit
          contract={editingContract?.id}
          mode={editingContract ? "edit" : "create"}
          onSubmit={onContractSubmit}
          onSuccess={onCloseDialog}
        />
      </FormDialog>

      <ConfirmationDialog
        open={deleteDialog.isOpen}
        onClose={deleteDialog.hideDialog}
        onConfirm={handleDeleteConfirm}
        title="Excluir Contrato"
        message={
          selectedContract
            ? `Tem certeza que deseja excluir o contrato "${selectedContract.name}"? Esta ação não pode ser desfeita.`
            : "Tem certeza que deseja excluir este contrato? Esta ação não pode ser desfeita."
        }
        variant="delete"
        confirmText="Excluir"
        isLoading={isDeletingContract}
        disabled={isDeletingContract}
      />

      {deleteContractError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          Erro ao excluir contrato: {deleteContractError}
        </Alert>
      )}
    </>
  );
};
