import * as React from 'react';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
    type GridRowsProp,
    type GridRowModesModel,
    GridRowModes,
    DataGrid,
    type GridColDef,
    type GridEventListener,
    type GridRowId,
    type GridRowModel,
    GridRowEditStopReasons,
    type GridSlotProps,
    Toolbar,
    ToolbarButton,
    type GridSlots,
    GridActionsCellItem,
} from '@mui/x-data-grid';
import { Paper, Typography} from '@mui/material';

// Local utility for random ID generation since we don't have @mui/x-data-grid-generator
const randomId = () => Math.random().toString(36).substr(2, 9);


const initialRows: GridRowsProp = [
    {
        id: randomId(),
        productName: 'Gaming Laptop',
        category: 'Electronics',
        price: 1200,
        stock: 15,
    },
    {
        id: randomId(),
        productName: 'Wireless Mouse',
        category: 'Accessories',
        price: 45,
        stock: 50,
    },
    {
        id: randomId(),
        productName: 'Mechanical Keyboard',
        category: 'Accessories',
        price: 85,
        stock: 30,
    },
    {
        id: randomId(),
        productName: 'Smart Watch',
        category: 'Wearables',
        price: 199,
        stock: 25,
    },
    {
        id: randomId(),
        productName: 'Bluetooth Speaker',
        category: 'Audio',
        price: 60,
        stock: 40,
    },
];

declare module '@mui/x-data-grid' {
    interface ToolbarPropsOverrides {
        setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
        setRowModesModel: (
            newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
        ) => void;
    }
}

function EditToolbar(props: GridSlotProps['toolbar']) {
    const { setRows, setRowModesModel } = props;

    const handleClick = () => {
        const id = randomId();
        setRows((oldRows) => [
            ...oldRows,
            { id, productName: '', category: '', price: 0, stock: 0, isNew: true },
        ]);
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: 'productName' },
        }));
    };

    return (
        <Toolbar>
            <Tooltip title="Add Product">
                <ToolbarButton onClick={handleClick}>
                    <AddIcon fontSize="small" />
                </ToolbarButton>
            </Tooltip>
        </Toolbar>
    );
}

export default function ProductGrid() {
    const [rows, setRows] = React.useState(initialRows);
    const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});

    const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const handleEditClick = (id: GridRowId) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };

    const handleSaveClick = (id: GridRowId) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };

    const handleDeleteClick = (id: GridRowId) => () => {
        setRows(rows.filter((row) => row.id !== id));
    };

    const handleCancelClick = (id: GridRowId) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });

        const editedRow = rows.find((row) => row.id === id);
        if (editedRow!.isNew) {
            setRows(rows.filter((row) => row.id !== id));
        }
    };

    const processRowUpdate = (newRow: GridRowModel) => {
        const updatedRow = { ...newRow, isNew: false };
        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
    };

    const columns: GridColDef[] = [
        { field: 'productName', headerName: 'Product Name', width: 200, editable: true },
        {
            field: 'category',
            headerName: 'Category',
            width: 180,
            editable: true,
            type: 'singleSelect',
            valueOptions: ['Electronics', 'Accessories', 'Wearables', 'Audio', 'Home', 'Fashion'],
        },
        {
            field: 'price',
            headerName: 'Price',
            type: 'number',
            width: 120,
            align: 'left',
            headerAlign: 'left',
            editable: true,
        },
        {
            field: 'stock',
            headerName: 'Stock',
            type: 'number',
            width: 120,
            align: 'left',
            headerAlign: 'left',
            editable: true,
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            cellClassName: 'actions',
            getActions: ({ id }) => {
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

                if (isInEditMode) {
                    return [
                        <GridActionsCellItem
                            icon={<SaveIcon />}
                            label="Save"
                            onClick={handleSaveClick(id)}
                        />,
                        <GridActionsCellItem
                            icon={<CancelIcon />}
                            label="Cancel"
                            className="textPrimary"
                            onClick={handleCancelClick(id)}
                            color="inherit"
                        />,
                    ];
                }

                return [
                    <GridActionsCellItem
                        icon={<EditIcon />}
                        label="Edit"
                        className="textPrimary"
                        onClick={handleEditClick(id)}
                        color="inherit"
                    />,
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={handleDeleteClick(id)}
                        color="inherit"
                    />,
                ];
            },
        },
    ];

    return (
         <Paper elevation={3} sx={{ p: 2 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography fontWeight={600}>Product Inventory</Typography>
      </Box>
        <Box
            sx={{
                height: 500,
                width: '100%',
                '& .actions': {
                    color: 'text.secondary',
                },
                '& .textPrimary': {
                    color: 'text.primary',
                },
            }}
        >
            <DataGrid
                rows={rows}
                columns={columns}
                editMode="row"
                rowModesModel={rowModesModel}
                onRowModesModelChange={setRowModesModel}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={processRowUpdate}
                showToolbar
                slots={{ toolbar: EditToolbar as GridSlots['toolbar'] }}
                slotProps={{
                    toolbar: { setRows, setRowModesModel },
                }}
            />
        </Box>
        </Paper>
    );
}
