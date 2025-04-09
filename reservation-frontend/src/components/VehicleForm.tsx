import React, { useState } from "react";
import {
    Box,
    Button,
    TextField,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Typography,
    Stack,
    SelectChangeEvent,
    FormControlLabel,
    Checkbox,
} from "@mui/material";
import { VehicleProps } from "./Vehicle";

type CarModelOption = {
    id: number;
    brand: string;
    model: string;
    year: number;
};

type VehicleFormData = {
    licensePlate: string;
    vin: string;
    status: "available" | "rented" | "maintenance";
    kilometersTravelled: number;
    carModelId: number;
    notes?: string;
    pendingCleaning: boolean;
    pendingRepairs: boolean;
};

type VehicleFormProps = {
    onSubmit: (vehicleData: Omit<VehicleProps, "id" | "carModels" | "onVehicleDeleted" | "onVehicleUpdated">) => void;
    carModels: CarModelOption[];
    initialData?: Partial<VehicleProps> & { carModelId?: number };
};

const VehicleForm: React.FC<VehicleFormProps> = ({
                                                     onSubmit,
                                                     carModels,
                                                     initialData = {},
                                                 }) => {
    const [formData, setFormData] = useState<VehicleFormData>({
        licensePlate: initialData.licensePlate ?? "",
        vin: initialData.vin ?? "",
        status: initialData.status ?? "available",
        kilometersTravelled: initialData.kilometersTravelled ?? 0,
        carModelId: initialData.carModel?.id ?? initialData.carModelId ?? 0,
        notes: initialData.notes ?? "",
        pendingCleaning: initialData.pendingCleaning ?? false,
        pendingRepairs: initialData.pendingRepairs ?? false,
    });

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "kilometersTravelled" ? Number(value) : value,
        }));
    };

    const handleSelectChange = (e: SelectChangeEvent) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "carModelId" ? Number(value) : value,
        }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: checked,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.carModelId) {
            alert("Please select a car model.");
            return;
        }
        onSubmit({
            ...formData,
            carModel: carModels.find(m => m.id === formData.carModelId)! // Required by VehicleProps
        });
    };

    const selectedModel = carModels.find((model) => model.id === formData.carModelId);

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate>
            <Typography variant="h6" gutterBottom>
                {initialData?.id ? "Edit" : "Add New"} Vehicle
            </Typography>

            <Stack spacing={2}>
                <TextField
                    required
                    label="License Plate"
                    name="licensePlate"
                    value={formData.licensePlate}
                    onChange={handleInputChange}
                    fullWidth
                />

                <TextField
                    required
                    label="VIN"
                    name="vin"
                    value={formData.vin}
                    onChange={handleInputChange}
                    fullWidth
                />

                <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                        name="status"
                        value={formData.status}
                        onChange={handleSelectChange}
                        required
                        label="Status"
                    >
                        <MenuItem value="available">Available</MenuItem>
                        <MenuItem value="rented">Rented</MenuItem>
                        <MenuItem value="maintenance">Under Maintenance</MenuItem>
                    </Select>
                </FormControl>

                <TextField
                    required
                    type="number"
                    label="Kilometers Travelled"
                    name="kilometersTravelled"
                    value={formData.kilometersTravelled}
                    onChange={handleInputChange}
                    inputProps={{ min: 0 }}
                    fullWidth
                />

                <FormControl fullWidth required>
                    <InputLabel>Car Model</InputLabel>
                    <Select
                        name="carModelId"
                        value={formData.carModelId.toString()}
                        onChange={handleSelectChange}
                        label="Car Model"
                    >
                        <MenuItem value="0" disabled>Select a model</MenuItem>
                        {carModels.map((model) => (
                            <MenuItem key={model.id} value={model.id.toString()}>
                                {model.brand} {model.model} ({model.year})
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {selectedModel && (
                    <Box p={2} border={1} borderRadius={2} borderColor="grey.300">
                        <Typography variant="subtitle1">Selected Model Details</Typography>
                        <Typography variant="body2">Brand: {selectedModel.brand}</Typography>
                        <Typography variant="body2">Model: {selectedModel.model}</Typography>
                        <Typography variant="body2">Year: {selectedModel.year}</Typography>
                    </Box>
                )}

                <TextField
                    label="Notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    multiline
                    rows={3}
                    fullWidth
                />

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={formData.pendingCleaning}
                            onChange={handleCheckboxChange}
                            name="pendingCleaning"
                        />
                    }
                    label="Pending Cleaning"
                />

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={formData.pendingRepairs}
                            onChange={handleCheckboxChange}
                            name="pendingRepairs"
                        />
                    }
                    label="Pending Repairs"
                />

                <Box display="flex" justifyContent="flex-end">
                    <Button type="submit" variant="contained">
                        {initialData?.id ? "Update" : "Save"} Vehicle
                    </Button>
                </Box>
            </Stack>
        </Box>
    );
};

export default VehicleForm;
