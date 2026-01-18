import React, { useMemo, useState, useEffect } from "react";
import {
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  TableSortLabel,
  TableContainer,
  Box,
  Typography,
  Checkbox,
  Toolbar,
  alpha,
  IconButton,
  Tooltip,
  FormControlLabel,
  Switch,
  Collapse,
} from "@mui/material";
import { useTheme } from '@mui/material/styles';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';

type Order = "asc" | "desc";

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number
  ) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

export type GroupRow = { __group: true; label: string; count: number };

export interface Column<T> {
  id: keyof T;
  label: string;
  headerAlign?: "left" | "center" | "right";
  align?: "left" | "center" | "right";
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  groupLabel?: string;
}

interface TableProps<T> {
  rows: T[];
  columns: Column<T>[];
  rowsPerPageOptions?: number[];
  defaultRowsPerPage?: number;
  emptyMessage?: string;
  rowKey?: keyof T;
  enableSelection?: boolean;
  selected?: (string | number)[];
  onSelectionChange?: (selected: (string | number)[]) => void;
  selectedAction?: React.ReactNode;
  dense?: boolean;
  onDenseChange?: (dense: boolean) => void;
  renderRowDetails?: (row: T) => React.ReactNode;
  disablePagination?: boolean;
  disableSorting?: boolean;
}

export default function EcomTable<T>({
  rows,
  columns,
  rowsPerPageOptions = [5, 10, 25],
  defaultRowsPerPage = 5,
  emptyMessage = "No records found.",
  rowKey = "id" as keyof T,
  enableSelection = false,
  selected = [],
  onSelectionChange,
  selectedAction,
  dense = false,
  onDenseChange,
  renderRowDetails,
  disablePagination = false,
  disableSorting = false,
}: TableProps<T>) {
  const [orderBy, setOrderBy] = useState<keyof T | "">("");
  const [order, setOrder] = useState<Order>("asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
  const [openStates, setOpenStates] = useState<Record<string | number, boolean>>({});
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  const hasRowDetails = typeof renderRowDetails === "function";

  const toggleRow = (id: string | number) => {
    setOpenStates((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleGroup = (label: string) => {
    setCollapsedGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  /* PAGE RESET */
  useEffect(() => {
    setPage(0);
  }, [rows.length]);

  /*  SORT */
  const handleSort = (id: keyof T) => {
    if (disableSorting) return;
    if (orderBy === id) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setOrderBy(id);
      setOrder("asc");
    }
  };

  /* SELECTION */
  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => (n as any)[rowKey]);
      onSelectionChange?.(newSelected);
      return;
    }
    onSelectionChange?.([]);
  };

  const handleClick = (id: string | number) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: (string | number)[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    onSelectionChange?.(newSelected);
  };

  const isSelected = (id: string | number) => selected.indexOf(id) !== -1;

  const sortedRows = useMemo(() => {
    if (disableSorting || !orderBy) return rows;

    return [...rows].sort((a: any, b: any) => {
      const valA = a[orderBy];
      const valB = b[orderBy];

      // Handle strings for case-insensitive and numeric-string sorting
      if (typeof valA === "string" && typeof valB === "string") {
        return order === "asc"
          ? valA.localeCompare(valB, undefined, { numeric: true, sensitivity: "base" })
          : valB.localeCompare(valA, undefined, { numeric: true, sensitivity: "base" });
      }

      // Fallback for numbers, nulls, etc.
      if (valA < valB) return order === "asc" ? -1 : 1;
      if (valA > valB) return order === "asc" ? 1 : -1;
      return 0;
    });
  }, [rows, orderBy, order]);

  /* PAGINATION */
  const paginatedRows = useMemo(() => {
    if (disablePagination) return sortedRows;
    const start = page * rowsPerPage;
    return sortedRows.slice(start, start + rowsPerPage);
  }, [sortedRows, page, rowsPerPage, disablePagination]);


  const visibleRowIds = useMemo(() =>
    paginatedRows
      .filter((r: any) => !r.__group)
      .map((r: any) => (r as any)[rowKey]),
    [paginatedRows, rowKey]
  );

  const allVisibleExpanded = useMemo(() =>
    visibleRowIds.length > 0 && visibleRowIds.every(id => openStates[id]),
    [visibleRowIds, openStates]
  );

  const handleToggleAllRows = () => {
    const shouldExpand = !allVisibleExpanded;
    const newStates = { ...openStates };
    visibleRowIds.forEach(id => {
      newStates[id] = shouldExpand;
    });
    setOpenStates(newStates);
  };
  const numSelected = selected.length;

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", boxShadow: 3, borderRadius: 2 }}>
      {enableSelection && selected.length > 0 && (
        <Toolbar
          sx={{
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
            ...(numSelected > 0 && {
              bgcolor: (theme) =>
                alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
            }),
          }}
        >
          {numSelected > 0 && (
            <Typography sx={{ flex: "1 1 100%" }} variant="subtitle1">
              {numSelected} selected
            </Typography>
          )}

          {numSelected > 0 && selectedAction}
        </Toolbar>
      )}
      <TableContainer sx={{ overflowX: "auto", maxHeight: 500 }}>
        <Table stickyHeader size={dense ? "small" : "medium"}>
          <TableHead>
            {/* GROUP HEADERS (Only if at least one groupLabel exists) */}
            {columns.some(c => c.groupLabel) && (
              <TableRow sx={{
                position: "sticky",
                top: 0,
                zIndex: 4,
                backgroundColor: "#fafafa",
              }}>
                {hasRowDetails && (
                  <TableCell
                    rowSpan={2}
                    sx={{
                      backgroundColor: "#fafafa",
                      textAlign: "center",
                      borderRight: "2px solid rgba(224, 224, 224, 1)",
                      zIndex: 3
                    }}
                  >
                    <Tooltip title={allVisibleExpanded ? "Collapse All" : "Expand All"}>
                      <IconButton size="small" onClick={handleToggleAllRows}>
                        {allVisibleExpanded ? <KeyboardDoubleArrowUpIcon /> : <KeyboardDoubleArrowDownIcon />}
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                )}
                {enableSelection && (
                  <TableCell
                    rowSpan={2}
                    sx={{ backgroundColor: "#fafafa", zIndex: 3 }}
                  />
                )}
                {(() => {
                  const headerCells: React.ReactNode[] = [];
                  for (let i = 0; i < columns.length; i++) {
                    const col = columns[i];
                    const isGroupStart = i > 0 && columns[i].groupLabel !== columns[i - 1].groupLabel;
                    const borderLeft = isGroupStart ? "2px solid rgba(224, 224, 224, 1)" : "none";

                    if (col.groupLabel) {
                      // Find how many columns are in this group
                      let colSpan = 1;
                      while (i + 1 < columns.length && columns[i + 1].groupLabel === col.groupLabel) {
                        colSpan++;
                        i++;
                      }
                      headerCells.push(
                        <TableCell
                          key={`group-${i}`}
                          colSpan={colSpan}
                          align="center"
                          sx={{
                            backgroundColor: "#fafafa",
                            fontWeight: "bold",
                            borderBottom: "2px solid rgba(224, 224, 224, 0.8)",
                            borderLeft: borderLeft,
                            fontSize: "0.80rem",
                            color: "text.secondary",
                            lineHeight: 2,
                            pt: 2,
                            pb: 1
                          }}
                        >
                          {col.groupLabel.toUpperCase()}
                        </TableCell>
                      );
                    } else {
                      headerCells.push(
                        <TableCell
                          key={`ungrouped-${i}`}
                          rowSpan={2}
                          align={col.headerAlign || "center"}
                          sx={{
                            backgroundColor: "#fafafa",
                            borderLeft: borderLeft,
                            fontWeight: "bold"
                          }}
                        >
                          {!disableSorting && col.sortable !== false ? (
                            <TableSortLabel
                              active={orderBy === col.id}
                              direction={orderBy === col.id ? order : "asc"}
                              onClick={() => handleSort(col.id)}
                            >
                              {col.label}
                            </TableSortLabel>
                          ) : (
                            col.label
                          )}
                        </TableCell>
                      );
                    }
                  }
                  return headerCells;
                })()}
              </TableRow>
            )}

            <TableRow sx={columns.some(c => c.groupLabel) ? {
              position: "sticky",
              top: 38,
              zIndex: 3,
              backgroundColor: "#fafafa",
            } : {
              position: "sticky",
              top: 0,
              zIndex: 2,
              backgroundColor: "#fafafa",
            }}>
              {!columns.some(c => c.groupLabel) && (
                <>
                  {hasRowDetails && (
                    <TableCell sx={{ backgroundColor: "#fafafa", zIndex: 2, width: 40 }}>
                      <Tooltip title={allVisibleExpanded ? "Collapse All" : "Expand All"}>
                        <IconButton size="small" onClick={handleToggleAllRows}>
                          {allVisibleExpanded ? <KeyboardDoubleArrowUpIcon /> : <KeyboardDoubleArrowDownIcon />}
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  )}
                  {enableSelection && (
                    <TableCell padding="checkbox" sx={{ backgroundColor: "#fafafa", zIndex: 2 }}>
                      <Checkbox
                        color="primary"
                        indeterminate={selected.length > 0 && selected.length < rows.length}
                        checked={rows.length > 0 && selected.length === rows.length}
                        onChange={handleSelectAllClick}
                      />
                    </TableCell>
                  )}
                </>
              )}
              {columns.map((c, i) => {
                const hasGrouping = columns.some(col => col.groupLabel);
                const isGroupStart = i > 0 && columns[i].groupLabel !== columns[i - 1].groupLabel;
                const borderLeft = hasGrouping && isGroupStart ? "2px solid rgba(224, 224, 224, 1)" : "none";

                if (hasGrouping && !c.groupLabel) return null;

                return (
                  <TableCell
                    key={String(c.id)}
                    align={c.headerAlign || "center"}
                    sx={{
                      borderLeft: borderLeft,
                      ...(hasGrouping ? { borderTop: "none" } : {})
                    }}
                  >
                    {!disableSorting && c.sortable !== false ? (
                      <TableSortLabel
                        active={orderBy === c.id}
                        direction={orderBy === c.id ? order : "asc"}
                        onClick={() => handleSort(c.id)}
                      >
                        {c.label}
                      </TableSortLabel>
                    ) : (
                      c.label
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>

          <TableBody>
            {(() => {
              if (paginatedRows.length === 0) {
                return (
                  <TableRow>
                    <TableCell colSpan={columns.length + (enableSelection ? 1 : 0) + (hasRowDetails ? 1 : 0)} align="center" sx={{ py: 10 }}>
                      <Typography color="textSecondary">
                        {emptyMessage}
                      </Typography>
                    </TableCell>
                  </TableRow>
                );
              }

              const rowsToRender: React.ReactNode[] = [];
              let currentGroupCollapsed = false;

              paginatedRows.forEach((row: any, index: number) => {
                if (row.__group) {
                  currentGroupCollapsed = !!collapsedGroups[row.label];
                  rowsToRender.push(
                    <TableRow
                      key={`group-${row.label}-${index}`}
                      onClick={() => toggleGroup(row.label)}
                      sx={{ cursor: "pointer", "&:hover": { backgroundColor: "rgba(0,0,0,0.08)" } }}
                    >
                      <TableCell
                        colSpan={columns.length + (enableSelection ? 1 : 0) + (hasRowDetails ? 1 : 0)}
                        sx={{
                          backgroundColor: "rgba(0,0,0,0.04)",
                          fontWeight: "bold",
                          py: 1,
                        }}
                      >
                        <Box display="flex" alignItems="center">
                          <IconButton size="small" sx={{ mr: 1 }}>
                            {currentGroupCollapsed ? <KeyboardArrowRightIcon /> : <KeyboardArrowDownIcon />}
                          </IconButton>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {row.label.toUpperCase()} ({row.count})
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                  return;
                }

                if (currentGroupCollapsed) return;

                const dataRow = row as T;
                const rowId = (dataRow as any)[rowKey] as string | number;
                const isItemSelected = isSelected(rowId);

                rowsToRender.push(
                  <React.Fragment key={String(rowId || index)}>
                    <TableRow
                      hover
                      role="checkbox"
                      aria-checked={isItemSelected}
                      selected={isItemSelected}
                    >
                      {hasRowDetails && (
                        <TableCell sx={{ borderRight: "2px solid rgba(224, 224, 224, 1)" }}>
                          <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={() => toggleRow(rowId)}
                          >
                            {openStates[rowId] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                          </IconButton>
                        </TableCell>
                      )}
                      {enableSelection && (
                        <TableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            checked={isItemSelected}
                            onClick={(event) => {
                              event.stopPropagation();
                              handleClick(rowId);
                            }}
                          />
                        </TableCell>
                      )}
                      {columns.map((c, i) => {
                        const hasGrouping = columns.some(col => col.groupLabel);
                        const isGroupStart = i > 0 && columns[i].groupLabel !== columns[i - 1].groupLabel;
                        const borderLeft = hasGrouping && isGroupStart ? "2px solid rgba(224, 224, 224, 1)" : "none";

                        return (
                          <TableCell
                            key={String(c.id)}
                            align={c.align || "center"}
                            sx={{
                              whiteSpace: "normal",
                              wordBreak: "break-word",
                              maxWidth: 110,
                              borderLeft: borderLeft,
                            }}
                          >
                            {c.render ? (
                              c.render(dataRow)
                            ) : (
                              <Tooltip title={(dataRow as any)[c.id] || ""}>
                                <span>{(dataRow as any)[c.id] || "—"}</span>
                              </Tooltip>
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                    {hasRowDetails && (
                      <TableRow>
                        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={columns.length + (enableSelection ? 1 : 0) + (hasRowDetails ? 1 : 0)}>
                          <Collapse in={openStates[rowId]} timeout="auto" unmountOnExit>
                            {renderRowDetails!(dataRow)}
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                );
              });

              return rowsToRender;
            })()}
          </TableBody>
        </Table>
      </TableContainer>

      {!disablePagination && (
        <Box sx={{ display: "flex", alignItems: "center", borderTop: "1px solid rgba(224, 224, 224, 0.12)" }}>
          {onDenseChange && (
            <FormControlLabel
              control={<Switch checked={dense} onChange={(e) => onDenseChange!(e.target.checked)} />}
              label="Dense padding"
              sx={{ ml: 2 }}
            />
          )}
          <Box sx={{ ml: "auto" }}>
            <TablePagination
              component="div"
              count={rows.length}
              page={page}
              onPageChange={(_, p) => setPage(p)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(+e.target.value);
                setPage(0);
              }}
              rowsPerPageOptions={rowsPerPageOptions}
              ActionsComponent={TablePaginationActions}
            />
          </Box>
        </Box>
      )}
    </Paper>
  );
}
