"use client";

import { useState } from "react";
import { Box } from "@mui/material";

import { SearchCampaignValues } from "@/features/campaigns/schemas/search-campaign";
import {
  CreateCampaignValues,
  UpdateCampaignValues,
} from "@/features/campaigns/schemas/campaign";
import { useCampaign } from "@/features/campaigns/hooks/use-campaign";
import {
  CampaignHeader,
  CampaignFilters,
  CampaignTable,
  CampaignActions,
} from "@/features/campaigns/components";
import { Campaign } from "@/features/campaigns/types/campaign";

const CampaignsPage = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null
  );

  const {
    campaigns,
    campaignsMeta,
    isLoadingCampaigns,
    error,
    page,
    limit,
    search,
    type,
    branchType,
    clientId,
    startDate,
    endDate,
    applyFilters,
    setPage,
    setLimit,
    clearFilters,
    isCreating,
    isUpdating,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    isDeleting,
    deleteCampaignError,
  } = useCampaign();

  const handleEditCampaign = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setOpenDialog(true);
  };

  const handleDeleteCampaign = async (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    // The actual deletion will be handled by CampaignActions component
  };

  const handleOpenDialog = () => {
    setEditingCampaign(null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCampaign(null);
  };

  const handleCampaignSubmit = async (data: CreateCampaignValues) => {
    try {
      if (editingCampaign) {
        await updateCampaign({
          id: editingCampaign.id,
          data: data as UpdateCampaignValues,
        });
      } else {
        await createCampaign(data);
      }
      console.log("Campaign operation completed successfully");
    } catch (error) {
      console.error("Error in handleCampaignSubmit:", error);
      throw error; // Re-throw to let the form handle it
    }
  };

  const handleApplyFilters = (data: SearchCampaignValues) => {
    applyFilters({
      page: 1,
      limit,
      ...data,
    });
  };

  const handleClearFilters = () => {
    clearFilters();
  };

  const handleCampaignDeleted = () => {
    setSelectedCampaign(null);
  };

  return (
    <Box>
      <CampaignHeader onAddCampaign={handleOpenDialog} />

      <CampaignFilters
        search={search}
        type={type}
        branchType={branchType}
        clientId={clientId}
        startDate={startDate}
        endDate={endDate}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
      />

      <CampaignTable
        campaigns={campaigns || []}
        campaignsMeta={campaignsMeta}
        isLoadingCampaigns={isLoadingCampaigns}
        error={error}
        page={page}
        limit={limit}
        onPageChange={setPage}
        onRowsPerPageChange={setLimit}
        onEditCampaign={handleEditCampaign}
        onDeleteCampaign={handleDeleteCampaign}
      />

      <CampaignActions
        openDialog={openDialog}
        editingCampaign={editingCampaign}
        selectedCampaign={selectedCampaign}
        isCreatingCampaign={isCreating}
        isUpdatingCampaign={isUpdating}
        isDeletingCampaign={isDeleting}
        deleteCampaignError={deleteCampaignError}
        onCloseDialog={handleCloseDialog}
        onCampaignSubmit={handleCampaignSubmit}
        onDeleteCampaign={deleteCampaign}
        onCampaignDeleted={handleCampaignDeleted}
      />
    </Box>
  );
};

export default CampaignsPage;
