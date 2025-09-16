"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Paper,
  Checkbox,
  Typography,
  Box,
  CircularProgress,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import { ReactNode, useState, useMemo, useCallback } from "react";
import { useMounted } from "@/hooks/use-mounted";

export interface Column<T = Record<string, unknown>> {
  id: keyof T;
  label: string;
  minWidth?: number;
  maxWidth?: number;
  width?: number;
  align?: "left" | "center" | "right";
  sortable?: boolean;
  filterable?: boolean;
  format?: (value: unknown, row: T) => ReactNode;
  renderCell?: (value: unknown, row: T, index: number) => ReactNode;
}

export interface DataTableProps<T = Record<string, unknown>> {
  // Data
  data: T[];
  columns: Column<T>[];
  loading?: boolean;

  // Identification
  getRowId?: (row: T) => string | number;

  // Pagination
  page?: number;
  rowsPerPage?: number;
  totalCount?: number;
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (rowsPerPage: number) => void;
  rowsPerPageOptions?: number[];
  showPagination?: boolean;

  // Selection
  selectable?: boolean;
  selectedRows?: (string | number)[];
  onSelectionChange?: (selected: (string | number)[]) => void;

  // Sorting
  sortBy?: keyof T;
  sortDirection?: "asc" | "desc";
  onSort?: (column: keyof T, direction: "asc" | "desc") => void;

  // Layout
  height?: number | string;
  maxHeight?: number | string;
  stickyHeader?: boolean;
  dense?: boolean;

  // Header
  title?: string;
  subtitle?: string;
  headerActions?: ReactNode;

  // Empty state
  emptyMessage?: string;
  noDataComponent?: ReactNode;

  // Row interactions
  onRowClick?: (row: T, index: number) => void;
  onRowDoubleClick?: (row: T, index: number) => void;

  // Styling
  sx?: Record<string, unknown>;
  className?: string;

  // Features
  showRowNumbers?: boolean;
  alternatingRows?: boolean;
}

export const DataTable = <T extends Record<string, unknown>>({
  data,
  columns,
  loading = false,
  getRowId = (row: T) => (row as { id?: string | number }).id || Math.random().toString(),
  page = 0,
  rowsPerPage = 10,
  totalCount,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPageOptions = [5, 10, 25, 50],
  showPagination = true,
  selectable = false,
  selectedRows = [],
  onSelectionChange,
  sortBy,
  sortDirection = "asc",
  onSort,
  height,
  maxHeight = 600,
  stickyHeader = true,
  dense = false,
  title,
  subtitle,
  headerActions,
  emptyMessage = "Nenhum dado encontrado",
  noDataComponent,
  onRowClick,
  onRowDoubleClick,
  sx,
  className,
  showRowNumbers = false,
  alternatingRows = true,
}: DataTableProps<T>) => {
  const [internalPage, setInternalPage] = useState(page);
  const [internalRowsPerPage, setInternalRowsPerPage] = useState(rowsPerPage);
  const mounted = useMounted();

  // Pagination handlers
  const handlePageChange = (_: unknown, newPage: number) => {
    setInternalPage(newPage);
    onPageChange?.(newPage);
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setInternalRowsPerPage(newRowsPerPage);
    setInternalPage(0);
    onRowsPerPageChange?.(newRowsPerPage);
  };

  // Selection handlers
  const isRowSelected = useCallback(
    (rowId: string | number) => selectedRows.includes(rowId),
    [selectedRows]
  );

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const allIds = data.map((row) => getRowId(row));
      onSelectionChange?.(allIds);
    } else {
      onSelectionChange?.([]);
    }
  };

  const handleRowSelect = useCallback(
    (rowId: string | number) => {
      const newSelected = isRowSelected(rowId)
        ? selectedRows.filter((id) => id !== rowId)
        : [...selectedRows, rowId];
      onSelectionChange?.(newSelected);
    },
    [isRowSelected, selectedRows, onSelectionChange]
  );

  // Sort handler
  const handleSort = (column: keyof T) => {
    const isAsc = sortBy === column && sortDirection === "asc";
    const newDirection = isAsc ? "desc" : "asc";
    onSort?.(column, newDirection);
  };

  // Data processing
  const paginatedData = useMemo(() => {
    if (onPageChange) {
      // Server-side pagination
      return data;
    }
    // Client-side pagination
    const startIndex = internalPage * internalRowsPerPage;
    return data.slice(startIndex, startIndex + internalRowsPerPage);
  }, [data, internalPage, internalRowsPerPage, onPageChange]);

  const displayedData = loading ? [] : paginatedData;
  const currentPage = onPageChange ? page : internalPage;
  const currentRowsPerPage = onRowsPerPageChange
    ? rowsPerPage
    : internalRowsPerPage;
  const count = totalCount || data.length;

  const hasHeader = title || subtitle || headerActions;
  const isAllSelected =
    selectedRows.length > 0 && selectedRows.length === data.length;
  const isIndeterminate =
    selectedRows.length > 0 && selectedRows.length < data.length;

  // Build columns with optional row numbers and selection
  const displayColumns = useMemo(() => {
    const cols: Column<T>[] = [];

    if (showRowNumbers) {
      cols.push({
        id: "__rowNumber" as keyof T,
        label: "#",
        width: 60,
        align: "center",
        sortable: false,
        renderCell: (_, __, index) =>
          currentPage * currentRowsPerPage + index + 1,
      });
    }

    if (selectable) {
      cols.push({
        id: "__selection" as keyof T,
        label: "",
        width: 60,
        align: "center",
        sortable: false,
        renderCell: (_, row) => (
          <Checkbox
            checked={isRowSelected(getRowId(row))}
            onChange={() => handleRowSelect(getRowId(row))}
            size="small"
          />
        ),
      });
    }

    return [...cols, ...columns];
  }, [
    columns,
    showRowNumbers,
    selectable,
    currentPage,
    currentRowsPerPage,
    getRowId,
    handleRowSelect,
    isRowSelected,
  ]);

  return (
    <Box sx={{ width: "100%", ...sx }} className={className}>
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

      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer
          sx={{
            height,
            maxHeight,
          }}
        >
          <Table stickyHeader={stickyHeader} size={dense ? "small" : "medium"}>
            <TableHead>
              <TableRow>
                {/* Select All Checkbox */}
                {selectable && showRowNumbers && (
                  <TableCell padding="checkbox" sx={{ width: 60 }}>
                    #
                  </TableCell>
                )}
                {selectable && (
                  <TableCell padding="checkbox" sx={{ width: 60 }}>
                    <Checkbox
                      indeterminate={isIndeterminate}
                      checked={isAllSelected}
                      onChange={handleSelectAll}
                      size="small"
                    />
                  </TableCell>
                )}

                {/* Column Headers */}
                {columns.map((column) => (
                  <TableCell
                    key={String(column.id)}
                    align={column.align || "left"}
                    style={{
                      minWidth: column.minWidth,
                      maxWidth: column.maxWidth,
                      width: column.width,
                      fontWeight: "bold",
                    }}
                  >
                    {column.sortable !== false && onSort ? (
                      <TableSortLabel
                        active={sortBy === column.id}
                        direction={sortBy === column.id ? sortDirection : "asc"}
                        onClick={() => handleSort(column.id)}
                      >
                        {column.label}
                      </TableSortLabel>
                    ) : (
                      column.label
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {!mounted ? (
                <TableRow>
                  <TableCell
                    colSpan={displayColumns.length}
                    align="center"
                    sx={{ py: 4 }}
                  >
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                      <Typography variant="body2" color="text.secondary">
                        Carregando...
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : loading ? (
                <TableRow>
                  <TableCell
                    colSpan={displayColumns.length}
                    align="center"
                    sx={{ py: 4 }}
                  >
                    <CircularProgress size={40} />
                  </TableCell>
                </TableRow>
              ) : displayedData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={displayColumns.length}
                    align="center"
                    sx={{ py: 4 }}
                  >
                    {noDataComponent || (
                      <Box>
                        <Typography variant="body1" color="text.secondary">
                          {emptyMessage}
                        </Typography>
                      </Box>
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                displayedData.map((row, index) => {
                  const rowId = getRowId(row);
                  const isSelected = isRowSelected(rowId);

                  return (
                    <TableRow
                      hover
                      key={String(rowId)}
                      selected={isSelected}
                      onClick={() => onRowClick?.(row, index)}
                      onDoubleClick={() => onRowDoubleClick?.(row, index)}
                      sx={{
                        cursor:
                          onRowClick || onRowDoubleClick
                            ? "pointer"
                            : "default",
                        backgroundColor:
                          alternatingRows && index % 2 === 1
                            ? "action.hover"
                            : "transparent",
                      }}
                    >
                      {displayColumns.map((column) => {
                        const value = row[column.id];

                        return (
                          <TableCell
                            key={String(column.id)}
                            align={column.align || "left"}
                            style={{
                              minWidth: column.minWidth,
                              maxWidth: column.maxWidth,
                              width: column.width,
                            }}
                          >
                            {column.renderCell
                              ? column.renderCell(value, row, index)
                              : column.format
                                ? column.format(value, row)
                                : String(value ?? '')}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        {mounted && showPagination && !loading && (
          <TablePagination
            rowsPerPageOptions={rowsPerPageOptions}
            component="div"
            count={count}
            rowsPerPage={currentRowsPerPage}
            page={currentPage}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            labelRowsPerPage="Linhas por página:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} de ${count !== -1 ? count : `mais de ${to}`}`
            }
          />
        )}
      </Paper>
    </Box>
  );
};

// Helpers para renderização de células comuns
export const TableHelpers = {
  // Status com chip
  renderStatus: (
    status: string,
    colorMap?: Record<
      string,
      | "default"
      | "primary"
      | "secondary"
      | "error"
      | "info"
      | "success"
      | "warning"
    >
  ) => {
    const color = colorMap?.[status] || "default";
    return <Chip label={status} color={color} size="small" />;
  },

  // Ações com botões
  renderActions: (
    actions: Array<{
      icon: ReactNode;
      label: string;
      onClick: () => void;
      color?:
        | "inherit"
        | "default"
        | "primary"
        | "secondary"
        | "error"
        | "info"
        | "success"
        | "warning";
      disabled?: boolean;
    }>
  ) => (
    <Box sx={{ display: "flex", gap: 0.5 }}>
      {actions.map((action, index) => (
        <Tooltip key={index} title={action.label} arrow>
          <IconButton
            size="small"
            onClick={action.onClick}
            color={action.color || "default"}
            disabled={action.disabled}
          >
            {action.icon}
          </IconButton>
        </Tooltip>
      ))}
    </Box>
  ),

  // Texto em duas linhas
  renderTwoLineText: (primary: string, secondary: string) => (
    <Box>
      <Typography variant="body2" fontWeight="medium">
        {primary}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {secondary}
      </Typography>
    </Box>
  ),

  // Data formatada
  renderDate: (
    date: string | Date,
    format: "short" | "long" | "datetime" = "short"
  ) => {
    const d = new Date(date);
    switch (format) {
      case "long":
        return d.toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        });
      case "datetime":
        return d.toLocaleString("pt-BR");
      default:
        return d.toLocaleDateString("pt-BR");
    }
  },

  // Número formatado
  renderNumber: (value: number, options?: Intl.NumberFormatOptions) => {
    return new Intl.NumberFormat("pt-BR", options).format(value);
  },

  // Moeda formatada
  renderCurrency: (value: number, currency = "BRL") => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency,
    }).format(value);
  },
};

// Hook para facilitar o uso
export const useDataTable = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
  const [sortBy, setSortBy] = useState<string | undefined>();
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (column: string, direction: "asc" | "desc") => {
    setSortBy(column);
    setSortDirection(direction);
    setPage(0); // Reset to first page when sorting
  };

  const resetSelection = () => setSelectedRows([]);
  const resetPagination = () => setPage(0);
  const resetSort = () => {
    setSortBy(undefined);
    setSortDirection("asc");
  };

  const resetAll = () => {
    resetSelection();
    resetPagination();
    resetSort();
  };

  return {
    // States
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    selectedRows,
    setSelectedRows,
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,

    // Handlers
    handleSort,

    // Reset functions
    resetSelection,
    resetPagination,
    resetSort,
    resetAll,
  };
};
