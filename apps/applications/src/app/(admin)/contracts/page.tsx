"use client";

import { useState } from "react";
import { Box } from "@mui/material";

import { SearchContractValues } from "@/features/contracts/schemas/search-contract";
import { FormContractValues } from "@/features/contracts/schemas/contract";
import { useContract } from "@/features/contracts/hooks/use-contract";
import {
  ContractHeader,
  ContractFilters,
  ContractTable,
  ContractActions,
} from "@/features/contracts/components";
import { Contract } from "@/features/contracts/types/contract";

const ContractPage = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingContract, setEditingContract] = useState<Contract | null>(null);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(
    null
  );

  const {
    contracts,
    contractsMeta,
    isLoadingContracts,
    error,
    page,
    limit,
    name,
    partner,
    clientName,
    startDate,
    endDate,
    applyFilters,
    setPage,
    setLimit,
    clearFilters,
    isCreatingContract,
    isUpdatingContract,
    createContract,
    updateContract,
    deleteContract,
    isDeletingContract,
    deleteContractError,
  } = useContract();

  const handleEditContract = (contract: Contract) => {
    setEditingContract(contract);
    setOpenDialog(true);
  };

  const handleDeleteContract = (contract: Contract) => {
    setSelectedContract(contract);
  };

  const handleOpenDialog = () => {
    setEditingContract(null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingContract(null);
  };

  const handleContractSubmit = async (data: FormContractValues) => {
    try {
      if (editingContract) {
        await updateContract({
          id: editingContract.id,
          data,
        });
      } else {
        await createContract(data);
      }
      console.log("Contract operation completed successfully");
    } catch (error) {
      console.error("Error in handleContractSubmit:", error);
      throw error; // Re-throw to let the form handle it
    }
  };

  const handleApplyFilters = (data: SearchContractValues) => {
    applyFilters(data);
  };

  const handleClearFilters = () => {
    clearFilters();
  };

  const handleContractDeleted = () => {
    setSelectedContract(null);
  };

  return (
    <Box>
      <ContractHeader onAddContract={handleOpenDialog} />

      <ContractFilters
        name={name}
        partner={partner}
        clientName={clientName}
        startDate={startDate}
        endDate={endDate}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
      />

      <ContractTable
        contracts={contracts || []}
        contractsMeta={contractsMeta}
        isLoadingContracts={isLoadingContracts}
        error={error}
        page={page}
        limit={limit}
        onPageChange={setPage}
        onRowsPerPageChange={setLimit}
        onEditContract={handleEditContract}
        onDeleteContract={handleDeleteContract}
      />

      <ContractActions
        openDialog={openDialog}
        editingContract={editingContract}
        selectedContract={selectedContract}
        isCreatingContract={isCreatingContract}
        isUpdatingContract={isUpdatingContract}
        isDeletingContract={isDeletingContract}
        deleteContractError={deleteContractError}
        onCloseDialog={handleCloseDialog}
        onContractSubmit={handleContractSubmit}
        onDeleteContract={deleteContract}
        onContractDeleted={handleContractDeleted}
      />
    </Box>
  );
};

export default ContractPage;
