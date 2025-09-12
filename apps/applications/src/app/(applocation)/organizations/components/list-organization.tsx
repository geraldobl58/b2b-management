"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/common/data-table";
import { ConfirmationDialog } from "@/components/common";

import { useOrganization } from "@/hooks/use-organization";
import { useConfirmation } from "@/hooks/use-confirmation";
import { createColumns } from "./columns";
import { EditOrganizationDialog } from "./edit-organization-dialog";

export const ListOrganization = () => {
  const router = useRouter();
  const { isLoading, organizations, deleteOrganization, isDeleting } = useOrganization();
  const confirmation = useConfirmation();
  const [editDialog, setEditDialog] = useState<{
    open: boolean;
    data: {
      id: string;
      name: string;
      slug: string;
      domain: string;
      industry: string;
      companySize: string;
      timezone: string;
    } | null;
  }>({
    open: false,
    data: null,
  });

  const handleEditOrganization = (organization: {
    id: string;
    name: string;
    slug: string;
    domain: string;
    industry: string;
    companySize: string;
    timezone: string;
    currentUserRole: "OWNER" | "ADMIN" | "MANAGER" | "ANALYST" | "VIEWER";
  }) => {
    setEditDialog({
      open: true,
      data: {
        id: organization.id,
        name: organization.name,
        slug: organization.slug,
        domain: organization.domain,
        industry: organization.industry,
        companySize: organization.companySize,
        timezone: organization.timezone,
      },
    });
  };

  const handleCloseEditDialog = () => {
    setEditDialog({
      open: false,
      data: null,
    });
  };

  const handleViewOrganization = (organizationId: string) => {
    router.push(`/organizations/${organizationId}`);
  };

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

  const columns = createColumns({ 
    onEdit: handleEditOrganization,
    onDelete: handleDeleteOrganization,
    onView: handleViewOrganization,
  });

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

      <EditOrganizationDialog
        open={editDialog.open}
        onClose={handleCloseEditDialog}
        organizationData={editDialog.data}
      />
    </div>
  );
};
