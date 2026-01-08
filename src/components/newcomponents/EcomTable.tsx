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
} from "@mui/material";

type Order = "asc" | "desc";

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
}

export default function EcomTable<T>({
  rows,
  columns,
  rowsPerPageOptions = [5, 10, 25],
  defaultRowsPerPage = 5,
  emptyMessage = "No records found.",
  rowKey = "id" as keyof T,
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

  return (
    <Paper sx={{ p: 2, width: "100%", overflow: "hidden", boxShadow:3, borderRadius:2 }}>
      <TableContainer sx={{ overflowX: "auto", maxHeight: 500 }}>
        <Table stickyHeader sx={{ minWidth: 1200 }}>
          <TableHead>
            <TableRow>
              {columns.map((c) => (
                <TableCell
                  key={String(c.id)}
                  align={c.headerAlign || "center"}
                  sx={{
                    fontWeight: "bold",
                    whiteSpace: "nowrap",
                    backgroundColor: "#fafafa",
                    zIndex: 1,
                  }}
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
              paginatedRows.map((row, index) => (
                <TableRow key={String(row[rowKey] || index)} hover>
                  {columns.map((c) => (
                    <TableCell
                      key={String(c.id)}
                      align={c.align || "center"}
                      sx={{ whiteSpace: "nowrap" }}
                    >
                      {c.render ? c.render(row) : (row as any)[c.id]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
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
          sx={{
            "& .MuiToolbar-root": {
              minHeight: 60,
              paddingY: 0,
            },
            "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
              margin: 0,
            },
          }}

        />
      </Box>
    </Paper>
  );
}
