// src/components/DataGridCustom.tsx
import {
  Box,
  Button,
  IconButton,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { ChangeEvent, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { IDatagrid } from "../interfaces/datagrid";

type Props = IDatagrid & {
  onDelete?: (id: number) => void;
  onCreateClick?: () => void;
  onEditClick?: (id: number) => void;
};

const DataGridCustom = ({
  columns,
  rows,
  title,
  filtercolumn,
  onDelete,
  onCreateClick,
  onEditClick,
}: Props) => {
  const [filter, setFilter] = useState(""); 

  const handleFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value);
  };

  const filteredRows = rows.filter((row) =>
    filtercolumn.some((col: string) =>
      row[col]?.toString().toLowerCase().includes(filter.toLowerCase())
    )
  );

  const actionColumn: GridColDef = {
    field: "actions",
    headerName: "Actions",
    width: 160,
    renderCell: (params) => (
      <Box display="flex" gap={1}>
        <Button
          size="small"
          variant="outlined"
          color="warning"
          onClick={() => onEditClick?.(params.row.id)}
          startIcon={<EditIcon />}
        >
          Edit
        </Button>
        <IconButton
          size="small"
          color="error"
          onClick={() => {
            if (window.confirm("Are you sure you want to delete this item?")) {
              onDelete?.(params.row.id);
            }
          }}
        >
          <DeleteIcon />
        </IconButton>
      </Box>
    ),
    sortable: false,
    filterable: false,
  };

  return (
    <Box sx={{ width: "100%", minWidth: "1000px", overflowX: "auto", justifyContent: "center" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6">{title}</Typography>
        <Box display="flex" alignItems="center">
          <TextField
            variant="standard"
            placeholder="Search"
            value={filter}
            size="small"
            onChange={handleFilterChange}
            sx={{ mr: 2 }}
          />
          <Button variant="contained" color="primary" onClick={onCreateClick}>
            CREATE +
          </Button>
        </Box>
      </Toolbar>

      <DataGrid
          rows={filteredRows}
          columns={[...columns, actionColumn]}
          pageSizeOptions={[10, 20, 50]}
          initialState={{
            pagination: {
              paginationModel: {
                page: 0,
                pageSize: 10,
              },
            },
          }}
          autoHeight
          disableRowSelectionOnClick          
        />
    </Box>
  );
};

export default DataGridCustom;
