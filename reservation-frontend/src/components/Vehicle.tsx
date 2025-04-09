import React, { useState } from "react";
import {
    Card,
    CardContent,
    Typography,
    Button,
    Stack,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import { deleteVehicle, updateVehicle } from "../services/api";
import VehicleForm from "./VehicleForm";

export type CarModelOption = {
    id: number;
    brand: string;
    model: string;
    year: number;
};

export type VehicleProps = {
    id: number;
    licensePlate: string;
    vin: string;
    status: "available" | "rented" | "maintenance";
    kilometersTravelled: number;
    notes?: string;
    pendingCleaning: boolean;
    pendingRepairs: boolean;
    carModel: CarModelOption;
    carModels: CarModelOption[];
    onVehicleDeleted?: (deletedId: number) => void;
    onVehicleUpdated?: (updated: VehicleProps) => void;
};

const Vehicle: React.FC<VehicleProps> = ({
                                             id,
                                             licensePlate,
                                             vin,
                                             status,
                                             kilometersTravelled,
                                             notes,
                                             pendingCleaning,
                                             pendingRepairs,
                                             carModel,
                                             carModels = [],
                                             onVehicleDeleted,
                                             onVehicleUpdated,
                                         }) => {
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDelete = async () => {
        const confirmed = window.confirm(`Are you sure you want to delete vehicle ${licensePlate}?`);
        if (!confirmed) return;

        try {
            await deleteVehicle(id);
            onVehicleDeleted?.(id);
        } catch (error) {
            alert("Failed to delete vehicle");
        }
    };

    const handleUpdate = async (
        updatedData: Omit<VehicleProps, "id" | "carModels" | "onVehicleDeleted" | "onVehicleUpdated">
    ) => {
        try {
            await updateVehicle(id, {
                ...updatedData,
                carModelId: updatedData.carModel.id, // backend expects carModelId
            });
            setIsEditing(false);
            setError(null);
            onVehicleUpdated?.({ ...updatedData, id, carModels });
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to update vehicle");
        }
    };

    return (
        <>
            <Card variant="outlined">
                <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                        <Box>
                            <Typography variant="h6" gutterBottom>
                                Vehicle: {licensePlate}
                            </Typography>
                            <Typography>VIN: {vin}</Typography>
                            <Typography>Status: {status}</Typography>
                            <Typography>Kilometers Travelled: {kilometersTravelled} km</Typography>
                            <Typography>Cleaning Needed: {pendingCleaning ? "Yes" : "No"}</Typography>
                            <Typography>Repairs Needed: {pendingRepairs ? "Yes" : "No"}</Typography>
                            {notes && <Typography>Notes: {notes}</Typography>}

                            {carModel && (
                                <Box mt={2}>
                                    <Typography variant="subtitle1">Model Details</Typography>
                                    <Typography>Brand: {carModel.brand}</Typography>
                                    <Typography>Model: {carModel.model}</Typography>
                                    <Typography>Year: {carModel.year}</Typography>
                                </Box>
                            )}
                        </Box>

                        <Stack direction="row" spacing={2} flexWrap="wrap">
                            <Button variant="outlined" onClick={() => setIsEditing(true)}>
                                Edit
                            </Button>
                            <Button variant="outlined" color="error" onClick={handleDelete}>
                                Delete
                            </Button>
                        </Stack>
                    </Box>

                    <Box mt={2}>
                        <Stack direction="row" spacing={2} flexWrap="wrap">
                            <Button variant="outlined" onClick={() => navigate(`maintenances/${id}`)}>
                                View Maintenance
                            </Button>
                            <Button variant="outlined" onClick={() => navigate(`notes/${id}`)}>
                                View Vehicle Notes
                            </Button>
                        </Stack>
                    </Box>
                </CardContent>
            </Card>

            <Dialog open={isEditing} onClose={() => setIsEditing(false)} fullWidth maxWidth="sm">
                <DialogTitle>
                    Edit Vehicle
                    <IconButton
                        aria-label="close"
                        onClick={() => setIsEditing(false)}
                        sx={{ position: "absolute", right: 8, top: 8 }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    {error && <Typography color="error" mb={2}>{error}</Typography>}
                    <VehicleForm
                        initialData={{
                            id,
                            licensePlate,
                            vin,
                            status,
                            kilometersTravelled,
                            pendingCleaning,
                            pendingRepairs,
                            notes,
                            carModelId: carModel.id,
                        }}
                        onSubmit={handleUpdate}
                        carModels={carModels}
                    />
                </DialogContent>
            </Dialog>
        </>
    );
};

export default Vehicle;
