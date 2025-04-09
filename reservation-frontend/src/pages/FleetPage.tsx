import React, { useEffect, useState } from "react";
import Vehicle, { VehicleProps } from "../components/Vehicle";
import { fetchVehicles, fetchCarModels, createVehicle } from "../services/api.ts";
import VehicleForm from "../components/VehicleForm";
import { VehicleRequestDTO } from "../types";
import {
    Box,
    Button,
    CircularProgress,
    Stack,
    Typography,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";

type CarModelOption = {
    id: number;
    brand: string;
    model: string;
    year: number;
};

const FleetPage: React.FC = () => {
    const [vehicles, setVehicles] = useState<VehicleProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [carModels, setCarModels] = useState<CarModelOption[]>([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [vehiclesData, modelsData] = await Promise.all([
                    fetchVehicles(),
                    fetchCarModels(0, 100),
                ]);

                const carModelList: CarModelOption[] = modelsData.content;

                const normalizedVehicles: VehicleProps[] = vehiclesData.content.map((v: any) => ({
                    id: v.id,
                    licensePlate: v.licensePlate,
                    vin: v.vin,
                    status: v.status.toLowerCase(),
                    kilometersTravelled: v.kilometersTravelled,
                    pendingCleaning: v.pendingCleaning,
                    pendingRepairs: v.pendingRepairs,
                    notes: v.notes ?? "",
                    carModel: {
                        id: v.carModel.id,
                        brand: v.carModel.brand,
                        model: v.carModel.model,
                        year: v.carModel.modelYear, // oppure v.carModel.year, dipende dal DTO
                    },
                    carModels: carModelList, // necessario per il form
                }));

                setCarModels(carModelList);
                setVehicles(normalizedVehicles);
                setLoading(false);
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : "Unknown error");
                setLoading(false);
            }
        };

        loadData().catch((err) => {
            console.error("Unhandled loadModels error:", err);
        });
    }, []);

    const handleAddVehicle = async (vehicleData: VehicleRequestDTO) => {
        try {
            await createVehicle(vehicleData);
            const updated = await fetchVehicles();
            setVehicles(updated.content);
            setOpenDialog(false);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Unknown error");
        }
    };


    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box mt={4}>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    return (
        <Box p={3}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4">Fleet Management</Typography>
                <Button variant="contained" onClick={() => setOpenDialog(true)}>
                    Add New Vehicle
                </Button>
            </Stack>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
                <DialogTitle>Add New Vehicle</DialogTitle>
                <DialogContent dividers>
                    <VehicleForm onSubmit={handleAddVehicle} carModels={carModels} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="secondary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>

            <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap>
                {vehicles.map((vehicle) => (
                    <Box key={vehicle.id} width={{ xs: '100%', md: '48%' }} mb={3}>
                        <Vehicle {...vehicle} carModels={carModels} />
                    </Box>
                ))}
            </Stack>
        </Box>
    );
};

export default FleetPage;
