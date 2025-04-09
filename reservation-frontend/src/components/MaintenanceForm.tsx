import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Stack,
    TextField,
    Typography,
    Alert
} from "@mui/material";
import { MaintenanceRecord } from "../services/api";

interface Props {
    initialData?: MaintenanceRecord | null;
    onSubmit: (data: Omit<MaintenanceRecord, "id" | "vehicleId">) => Promise<void>;
    onCancel: () => void;
}

const MaintenanceForm: React.FC<Props> = ({ initialData, onSubmit, onCancel }) => {
    const [type, setType] = useState("");
    const [description, setDescription] = useState("");
    const [maintenanceDate, setMaintenanceDate] = useState("");
    const [cost, setCost] = useState("");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (initialData) {
            setType(initialData.type || "");
            setDescription(initialData.description || "");
            setMaintenanceDate(initialData.maintenanceDate || "");
            setCost(initialData.cost.toString());
        }
    }, [initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await onSubmit({
                type,
                description,
                maintenanceDate,
                cost: parseFloat(cost),
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Submission failed");
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate>
            <Typography variant="h6" gutterBottom>
                {initialData ? "Edit Maintenance Record" : "Add Maintenance Record"}
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Stack spacing={2}>
                <TextField
                    label="Type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    required
                    fullWidth
                />

                <TextField
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    fullWidth
                />

                <TextField
                    label="Date"
                    type="datetime-local"
                    value={maintenanceDate}
                    onChange={(e) => setMaintenanceDate(e.target.value)}
                    required
                    fullWidth
                    InputLabelProps={{
                        shrink: true
                    }}
                />

                <TextField
                    label="Cost (€)"
                    type="number"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    required
                    fullWidth
                />

                <Box display="flex" justifyContent="flex-end" gap={2}>
                    <Button type="button" variant="outlined" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="contained">
                        {initialData ? "Update" : "Create"}
                    </Button>
                </Box>
            </Stack>
        </Box>
    );
};

export default MaintenanceForm;
