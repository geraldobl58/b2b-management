"use client";

import { Box } from "@mui/material";

import { CampaignHeader } from "@/features/campaigns/components/campaigns/campaign-header";
import { CampaignFilters } from "@/features/campaigns/components/campaigns/campaign-filters";
import { SearchCampaignValues } from "@/features/campaigns/schemas/campaign";
import { useCampaign } from "@/features/campaigns/hooks/use-campaign";

const CampaignsPage = () => {
  const handleRedirectToCampaignCreation = () => {
    console.log("Redirect to campaign creation flow");
  };

  const {
    clientName,
    type,
    branchType,
    startDate,
    endDate,
    applyFilters,
    clearFilters,
  } = useCampaign();

  const handleApplyFilters = (data: SearchCampaignValues) => {
    applyFilters(data);
  };

  const handleClearFilters = () => {
    clearFilters();
  };

  return (
    <Box>
      <CampaignHeader onAddCampaign={handleRedirectToCampaignCreation} />

      <CampaignFilters
        clientName={clientName}
        type={type}
        branchType={branchType}
        startDate={startDate}
        endDate={endDate}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
      />
    </Box>
  );
};

export default CampaignsPage;
