"use client";

import {
  DataGrid,
  GridColDef,
  GridRowsProp,
  GridPaginationModel,
  GridRowSelectionModel,
  GridSortModel,
  GridFilterModel,
  GridToolbar,
} from "@mui/x-data-grid";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Chip,
  Avatar,
  Tooltip,
} from "@mui/material";
import { ReactNode, useState } from "react";

export interface GenericDataGridProps {
  // Data
  rows: GridRowsProp;
  columns: GridColDef[];
  loading?: boolean;

  // Pagination
  paginationModel?: GridPaginationModel;
  onPaginationModelChange?: (model: GridPaginationModel) => void;
  pageSizeOptions?: number[];
  rowCount?: number;
  paginationMode?: "client" | "server";

  // Selection
  checkboxSelection?: boolean;
  onRowSelectionModelChange?: (selectionModel: GridRowSelectionModel) => void;
  rowSelectionModel?: GridRowSelectionModel;
  disableRowSelectionOnClick?: boolean;

  // Sorting & Filtering
  sortModel?: GridSortModel;
  onSortModelChange?: (model: GridSortModel) => void;
  sortingMode?: "client" | "server";
  filterModel?: GridFilterModel;
  onFilterModelChange?: (model: GridFilterModel) => void;
  filteringMode?: "client" | "server";

  // Features
  disableColumnFilter?: boolean;
  disableColumnMenu?: boolean;
  disableColumnSelector?: boolean;
  disableDensitySelector?: boolean;
  disableColumnSorting?: boolean;
  showToolbar?: boolean;
  hideFooter?: boolean;

  // Layout
  autoHeight?: boolean;
  height?: number | string;
  density?: "compact" | "standard" | "comfortable";
  maxWidth?: string;
  minHeight?: number | string;

  // Header
  title?: string;
  subtitle?: string;
  headerActions?: ReactNode;

  // No Data
  noRowsOverlay?: ReactNode;
  noResultsOverlay?: ReactNode;

  // Styling
  sx?: any;
  className?: string;

  // Events
  onRowClick?: (params: any) => void;
  onRowDoubleClick?: (params: any) => void;
}

const defaultPaginationModel: GridPaginationModel = { page: 0, pageSize: 10 };

export const GenericDataGrid = ({
  rows,
  columns,
  loading = false,
  paginationModel = defaultPaginationModel,
  onPaginationModelChange,
  pageSizeOptions = [5, 10, 25, 50],
  rowCount,
  paginationMode = "client",
  checkboxSelection = false,
  onRowSelectionModelChange,
  rowSelectionModel,
  disableRowSelectionOnClick = true,
  sortModel,
  onSortModelChange,
  sortingMode = "client",
  filterModel,
  onFilterModelChange,
  filteringMode = "client",
  disableColumnFilter = false,
  disableColumnMenu = false,
  disableColumnSelector = false,
  disableDensitySelector = false,
  disableColumnSorting = false,
  showToolbar = false,
  hideFooter = false,
  autoHeight = false,
  height = "55vh",
  density = "standard",
  maxWidth,
  minHeight,
  title,
  subtitle,
  headerActions,
  noRowsOverlay,
  noResultsOverlay,
  sx,
  className,
  onRowClick,
  onRowDoubleClick,
}: GenericDataGridProps) => {
  const [internalPaginationModel, setInternalPaginationModel] =
    useState<GridPaginationModel>(paginationModel);

  const handlePaginationChange = (model: GridPaginationModel) => {
    setInternalPaginationModel(model);
    onPaginationModelChange?.(model);
  };

  const hasHeader = title || subtitle || headerActions;

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: maxWidth || "100%",
      }}
      className={className}
    >
      {/* Header */}
      {hasHeader && (
        <Box
          sx={{
            mb: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box>
            {title && (
              <Typography variant="h5" component="h2" fontWeight="bold">
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
          {headerActions && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {headerActions}
            </Box>
          )}
        </Box>
      )}

      {/* DataGrid Container */}
      <Box
        sx={{
          height: autoHeight ? "auto" : height,
          minHeight: minHeight,
          borderRadius: 1,
          overflow: "hidden",
          border: 1,
          borderColor: "divider",
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          paginationModel={
            onPaginationModelChange ? paginationModel : internalPaginationModel
          }
          onPaginationModelChange={
            onPaginationModelChange || handlePaginationChange
          }
          pageSizeOptions={pageSizeOptions}
          rowCount={rowCount}
          paginationMode={paginationMode}
          checkboxSelection={checkboxSelection}
          onRowSelectionModelChange={onRowSelectionModelChange}
          rowSelectionModel={rowSelectionModel}
          disableRowSelectionOnClick={disableRowSelectionOnClick}
          sortModel={sortModel}
          onSortModelChange={onSortModelChange}
          sortingMode={sortingMode}
          filterModel={filterModel}
          onFilterModelChange={onFilterModelChange}
          filteringMode={filteringMode}
          disableColumnFilter={disableColumnFilter}
          disableColumnMenu={disableColumnMenu}
          disableColumnSelector={disableColumnSelector}
          disableDensitySelector={disableDensitySelector}
          disableColumnSorting={disableColumnSorting}
          autoHeight={autoHeight}
          density={density}
          hideFooter={hideFooter}
          onRowClick={onRowClick}
          onRowDoubleClick={onRowDoubleClick}
          slots={{
            toolbar: showToolbar ? GridToolbar : undefined,
            noRowsOverlay: noRowsOverlay ? () => <>{noRowsOverlay}</> : undefined,
            noResultsOverlay: noResultsOverlay
              ? () => <>{noResultsOverlay}</>
              : undefined,
          }}
          sx={{
            height: "100%",
            border: 0,
            "& .MuiDataGrid-cell": {
              borderColor: "divider",
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "grey.50",
              borderColor: "divider",
              fontWeight: "bold",
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "action.hover",
            },
            "& .MuiDataGrid-footerContainer": {
              borderColor: "divider",
            },
            ...sx,
          }}
        />
      </Box>
    </Box>
  );
};

// Componentes auxiliares para renderização de células
export const DataGridHelpers = {
  // Avatar com iniciais
  renderAvatar: (name: string, color?: string, size: number = 32) => (
    <Avatar
      sx={{
        bgcolor: color || "primary.main",
        width: size,
        height: size,
        fontSize: size * 0.4,
        fontWeight: "bold",
      }}
    >
      {name.charAt(0).toUpperCase()}
    </Avatar>
  ),

  // Chip colorido
  renderChip: (
    label: string,
    color:
      | "default"
      | "primary"
      | "secondary"
      | "error"
      | "info"
      | "success"
      | "warning" = "default",
    variant: "filled" | "outlined" = "filled",
    size: "small" | "medium" = "small"
  ) => <Chip label={label} color={color} variant={variant} size={size} />,

  // Botão de ação
  renderActionButton: (
    icon: ReactNode,
    onClick: () => void,
    tooltip?: string,
    color:
      | "inherit"
      | "default"
      | "primary"
      | "secondary"
      | "error"
      | "info"
      | "success"
      | "warning" = "default",
    disabled: boolean = false
  ) => {
    const button = (
      <IconButton
        size="small"
        onClick={onClick}
        color={color}
        disabled={disabled}
      >
        {icon}
      </IconButton>
    );

    return tooltip ? (
      <Tooltip title={tooltip} arrow>
        {button}
      </Tooltip>
    ) : (
      button
    );
  },

  // Grupo de ações
  renderActionGroup: (actions: ReactNode[]) => (
    <Box sx={{ display: "flex", gap: 0.5 }}>{actions}</Box>
  ),

  // Status com cor
  renderStatus: (
    status: string,
    colorMap?: Record<string, string>,
    defaultColor: string = "default"
  ) => {
    const color = colorMap?.[status] || defaultColor;
    return (
      <Chip
        label={status}
        size="small"
        sx={{
          backgroundColor: `${color}.light`,
          color: `${color}.dark`,
          fontWeight: "medium",
        }}
      />
    );
  },

  // Texto com ícone
  renderTextWithIcon: (text: string, icon: ReactNode, gap: number = 1) => (
    <Box sx={{ display: "flex", alignItems: "center", gap }}>
      {icon}
      <Typography variant="body2">{text}</Typography>
    </Box>
  ),

  // Dados em duas linhas
  renderTwoLineText: (
    primary: string,
    secondary: string,
    primaryProps?: any,
    secondaryProps?: any
  ) => (
    <Box>
      <Typography variant="body2" fontWeight="medium" {...primaryProps}>
        {primary}
      </Typography>
      <Typography
        variant="caption"
        color="text.secondary"
        {...secondaryProps}
      >
        {secondary}
      </Typography>
    </Box>
  ),
};

// Hook para facilitar o uso
export const useDataGrid = (initialPaginationModel?: GridPaginationModel) => {
  const [loading, setLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>(
    initialPaginationModel || defaultPaginationModel
  );
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [filterModel, setFilterModel] = useState<GridFilterModel>({
    items: [],
  });
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>(
    []
  );

  const resetPagination = () => {
    setPaginationModel({ page: 0, pageSize: paginationModel.pageSize });
  };

  const resetFilters = () => {
    setFilterModel({ items: [] });
  };

  const resetSelection = () => {
    setSelectionModel([]);
  };

  const resetAll = () => {
    resetPagination();
    resetFilters();
    resetSelection();
    setSortModel([]);
  };

  return {
    // States
    loading,
    setLoading,
    paginationModel,
    setPaginationModel,
    sortModel,
    setSortModel,
    filterModel,
    setFilterModel,
    selectionModel,
    setSelectionModel,
    
    // Reset functions
    resetPagination,
    resetFilters,
    resetSelection,
    resetAll,
  };
};