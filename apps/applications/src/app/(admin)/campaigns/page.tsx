"use client";

import { Box } from "@mui/material";

import { CampaignHeader } from "@/features/campaigns/components/campaigns/campaign-header";

const CampaignsPage = () => {
  const handleRedirectToCampaignCreation = () => {
    console.log("Redirect to campaign creation flow");
  };

  return (
    <Box>
      <CampaignHeader onAddCampaign={handleRedirectToCampaignCreation} />
    </Box>
  );
};

export default CampaignsPage;
