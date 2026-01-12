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
} from "@mui/material";
import { useTheme } from '@mui/material/styles';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';

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

export interface Column<T> {
  id: keyof T;
  label: string;
  headerAlign?: "left" | "center" | "right";
  align?: "left" | "center" | "right";
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
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
}: TableProps<T>) {
  const [orderBy, setOrderBy] = useState<keyof T | "">("");
  const [order, setOrder] = useState<Order>("asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);

  /* AUTOMATIC PAGE RESET */
  useEffect(() => {
    setPage(0);
  }, [rows.length]);

  /*  SORT */
  const handleSort = (id: keyof T) => {
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
    if (!orderBy) return rows;

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
    const start = page * rowsPerPage;
    return sortedRows.slice(start, start + rowsPerPage);
  }, [sortedRows, page, rowsPerPage]);

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
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {enableSelection && (
                <TableCell padding="checkbox" sx={{ backgroundColor: "#fafafa", zIndex: 1 }}>
                  <Checkbox
                    color="primary"
                    indeterminate={selected.length > 0 && selected.length < rows.length}
                    checked={rows.length > 0 && selected.length === rows.length}
                    onChange={handleSelectAllClick}
                  />
                </TableCell>
              )}
              {columns.map((c) => (
                <TableCell
                  key={String(c.id)}
                  align={c.headerAlign || "center"}
                >
                  {c.sortable !== false ? (
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
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedRows.length > 0 ? (
              paginatedRows.map((row, index) => {
                const rowId = (row as any)[rowKey] as string | number;
                const isItemSelected = isSelected(rowId);

                return (
                  <TableRow
                    key={String(rowId || index)}
                    hover
                    role="checkbox"
                    aria-checked={isItemSelected}
                    selected={isItemSelected}
                  >
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
                    {columns.map((c) => (
                      <TableCell
                        key={String(c.id)}
                        align={c.align || "center"}
                        sx={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: 120,
                        }}
                      >
                        {c.render ? (
                          c.render(row)
                        ) : (
                          <Tooltip title={(row as any)[c.id] || ""}>
                            <span>{(row as any)[c.id]}</span>
                          </Tooltip>
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 10 }}>
                  <Typography color="textSecondary">
                    {emptyMessage}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: "flex", justifyContent: "flex-end", borderTop: "1px solid rgba(224, 224, 224, 0.12)" }}>
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
    </Paper>
  );
}
