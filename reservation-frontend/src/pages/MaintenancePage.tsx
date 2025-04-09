import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    fetchVehicleMaintenances,
    createMaintenance,
    updateMaintenance,
    MaintenanceRecord,
} from "../services/api";
import MaintenanceForm from "../components/MaintenanceForm";
import MaintenanceTable from "../components/MaintenanceTable";

import {
    Box,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Alert,
    Stack
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

const MaintenancePage: React.FC = () => {
    const { vehicleId } = useParams<{ vehicleId: string }>();
    const [maintenances, setMaintenances] = useState<MaintenanceRecord[]>([]);
    const [selectedRecord, setSelectedRecord] = useState<MaintenanceRecord | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const loadMaintenances = async () => {
        if (!vehicleId) return;
        try {
            const data = await fetchVehicleMaintenances(parseInt(vehicleId), 0, 1000);
            setMaintenances(data.content || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
        }
    };

    useEffect(() => {
        loadMaintenances();
    }, [vehicleId]);

    const handleAdd = () => {
        setSelectedRecord(null);
        setShowForm(true);
    };

    const handleEdit = (record: MaintenanceRecord) => {
        setSelectedRecord(record);
        setShowForm(true);
    };

    const handleFormClose = () => {
        setShowForm(false);
        setSelectedRecord(null);
    };

    const handleFormSubmit = async (data: Omit<MaintenanceRecord, "id" | "vehicleId">) => {
        if (!vehicleId) return;

        try {
            if (selectedRecord) {
                await updateMaintenance(parseInt(vehicleId), selectedRecord.id, data);
            } else {
                await createMaintenance(parseInt(vehicleId), data);
            }
            handleFormClose();
            await loadMaintenances();
        } catch (err) {
            alert("Errore nel salvataggio: " + (err instanceof Error ? err.message : "Unknown error"));
        }
    };

    return (
        <Box m={3}>
            <Box mb={3}>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <IconButton onClick={() => navigate("/fleet")} size="small">
                        <ArrowBackIosNewIcon />
                    </IconButton>
                    <Typography variant="h4" fontWeight="bold">
                        Maintenance Records for Vehicle #{vehicleId}
                    </Typography>
                </Stack>
            </Box>


            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {maintenances.length === 0 ? (
                <Alert
                    severity="info"
                    action={
                        <Button color="inherit" size="small" onClick={handleAdd}>
                            Add
                        </Button>
                    }
                >
                    No maintenance records found.
                </Alert>
            ) : (
                <>
                    <MaintenanceTable
                        vehicleId={parseInt(vehicleId!)}
                        records={maintenances}
                        onMaintenanceUpdated={loadMaintenances}
                        onEdit={handleEdit}
                    />
                    <Box display="flex" justifyContent="flex-end" mt={3}>
                        <Button variant="contained" color="primary" onClick={handleAdd}>
                            Add Maintenance Record
                        </Button>
                    </Box>
                </>
            )}

            <Dialog open={showForm} onClose={handleFormClose} fullWidth maxWidth="md">
                <DialogTitle>
                    {selectedRecord ? "Edit Maintenance" : "Add Maintenance"}
                    <IconButton
                        aria-label="close"
                        onClick={handleFormClose}
                        sx={{ position: "absolute", right: 8, top: 8 }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <MaintenanceForm
                        initialData={selectedRecord || undefined}
                        onSubmit={handleFormSubmit}
                        onCancel={handleFormClose}
                    />
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default MaintenancePage;
