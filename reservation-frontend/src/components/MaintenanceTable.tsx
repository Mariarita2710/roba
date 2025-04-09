import React, { useState } from "react";
import {
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    IconButton,
    Typography,
    Box,
    Paper
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { MaintenanceRecord, deleteMaintenance } from "../services/api";
import ErrorAlert from "./ErrorAlert";

type MaintenanceTableProps = {
    vehicleId: number;
    records: MaintenanceRecord[];
    onMaintenanceUpdated: () => void;
    onEdit: (record: MaintenanceRecord) => void;
};

const MaintenanceTable: React.FC<MaintenanceTableProps> = ({
                                                               vehicleId,
                                                               records,
                                                               onMaintenanceUpdated,
                                                               onEdit,
                                                           }) => {
    const [error, setError] = useState<string | null>(null);

    const handleDelete = async (maintenanceId: number) => {
        if (!window.confirm("Are you sure you want to delete this maintenance record?")) return;
        try {
            await deleteMaintenance(vehicleId, maintenanceId);
            onMaintenanceUpdated();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to delete maintenance record");
        }
    };

    return (
        <Paper sx={{ mt: 2, p: 2 }}>
            <Typography variant="h6" gutterBottom>
                Maintenance History
            </Typography>

            {error && (
                <Box mb={2}>
                    <ErrorAlert message={error} onClose={() => setError(null)} />
                </Box>
            )}

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Cost (€)</TableCell>
                        <TableCell align="right">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {records.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5}>No maintenance records available.</TableCell>
                        </TableRow>
                    ) : (
                        records.map((record) => (
                            <TableRow key={record.id}>
                                <TableCell>
                                    {new Date(record.maintenanceDate).toLocaleDateString()}
                                </TableCell>
                                <TableCell>{record.type}</TableCell>
                                <TableCell>{record.description}</TableCell>
                                <TableCell>€{record.cost.toFixed(2)}</TableCell>
                                <TableCell align="right">
                                    <IconButton onClick={() => onEdit(record)} size="small" color="primary">
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => handleDelete(record.id)}
                                        size="small"
                                        color="error"
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </Paper>
    );
};

export default MaintenanceTable;
