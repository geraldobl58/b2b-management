"use client";

import { useRef } from "react";
import { Alert } from "@mui/material";

import {
  ConfirmationDialog,
  useConfirmationDialog,
  FormDialog,
} from "@/components/common";
import { CreateCampaignValues } from "@/features/campaigns/schemas/campaign";
import { Campaign } from "@/features/campaigns/types/campaign";

interface CampaignActionsProps {
  openDialog: boolean;
  editingCampaign: Campaign | null;
  selectedCampaign: Campaign | null;
  isCreatingCampaign: boolean;
  isUpdatingCampaign: boolean;
  isDeletingCampaign: boolean;
  deleteCampaignError?: string | null;
  onCloseDialog: () => void;
  onCampaignSubmit: (data: CreateCampaignValues) => Promise<void>;
  onDeleteCampaign: (campaignId: string) => void;
  onCampaignDeleted: () => void;
}

export const CampaignActions = ({
  openDialog,
  editingCampaign,
  selectedCampaign,
  isCreatingCampaign,
  isUpdatingCampaign,
  isDeletingCampaign,
  deleteCampaignError,
  onCloseDialog,
  onCampaignSubmit,
  onDeleteCampaign,
  onCampaignDeleted,
}: CampaignActionsProps) => {
  const campaignFormRef = useRef<any>(null);

  const deleteDialog = useConfirmationDialog({
    title: "Excluir Campanha",
    message:
      "Tem certeza que deseja excluir esta campanha? Esta ação não pode ser desfeita.",
    variant: "delete",
    confirmText: "Excluir",
  });

  const handleDeleteConfirm = async () => {
    if (selectedCampaign) {
      try {
        onDeleteCampaign(selectedCampaign.id);
        onCampaignDeleted();
        deleteDialog.hideDialog();
      } catch (error) {
        console.error("Erro ao deletar campanha:", error);
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
          if (campaignFormRef.current) {
            await campaignFormRef.current.submit();
          } else {
            console.error("CampaignForm ref is not available");
          }
        }}
        title={editingCampaign ? "Editar Campanha" : "Nova Campanha"}
        mode={editingCampaign ? "edit" : "create"}
        isLoading={isCreatingCampaign || isUpdatingCampaign}
        maxWidth="md"
        fullWidth
      >
        {/* TODO: Implement CampaignForm component */}
        <div>
          <p>CampaignForm component will be implemented here</p>
        </div>
      </FormDialog>

      <ConfirmationDialog
        open={deleteDialog.isOpen}
        onClose={deleteDialog.hideDialog}
        onConfirm={handleDeleteConfirm}
        title="Excluir Campanha"
        message={
          selectedCampaign
            ? `Tem certeza que deseja excluir a campanha "${selectedCampaign.name}"? Esta ação não pode ser desfeita.`
            : "Tem certeza que deseja excluir esta campanha? Esta ação não pode ser desfeita."
        }
        variant="delete"
        confirmText="Excluir"
        isLoading={isDeletingCampaign}
        disabled={isDeletingCampaign}
      />

      {deleteCampaignError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          Erro ao excluir campanha: {deleteCampaignError}
        </Alert>
      )}
    </>
  );
};
