"use client";

import { DataTable } from "@/components/common/data-table";
import { ConfirmationDialog } from "@/components/common";

import { useOrganization } from "@/hooks/use-organization";
import { useConfirmation } from "@/hooks/use-confirmation";
import { createColumns } from "./columns";

export const ListOrganization = () => {
  const { isLoading, organizations, deleteOrganization, isDeleting } = useOrganization();
  const confirmation = useConfirmation();

  const handleDeleteOrganization = (organizationId: string, organizationName: string) => {
    confirmation.showConfirmation({
      title: "Confirmar Exclusão",
      message: `Tem certeza que deseja excluir a organização "${organizationName}"? Esta ação não pode ser desfeita.`,
      confirmText: "Sim, excluir",
      cancelText: "Cancelar",
      variant: "delete",
      onConfirm: () => deleteOrganization(organizationId),
    });
  };

  const columns = createColumns({ onDelete: handleDeleteOrganization });

  return (
    <div>
      <DataTable
        data={organizations || []}
        columns={columns}
        loading={isLoading}
        height="55vh"
        showPagination={true}
        rowsPerPageOptions={[5, 10, 25]}
        rowsPerPage={10}
        dense={false}
        stickyHeader={true}
      />

      <ConfirmationDialog
        open={confirmation.confirmation.isOpen}
        title={confirmation.confirmation.title}
        message={confirmation.confirmation.message}
        variant={confirmation.confirmation.variant}
        confirmText={confirmation.confirmation.confirmText}
        cancelText={confirmation.confirmation.cancelText}
        isLoading={confirmation.confirmation.isLoading || isDeleting}
        onClose={confirmation.handleCancel}
        onConfirm={confirmation.handleConfirm}
      />
    </div>
  );
};
