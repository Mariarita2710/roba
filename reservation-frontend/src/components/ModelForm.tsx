import React from 'react';
import {
    Box,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Stack,
    TextField,
    Typography,
    Card,
    CardContent
} from '@mui/material';
import { ModelProps } from './Model';
import { ModelRequestDTO } from '../types';

type ModelFormProps = {
    initialData: Partial<ModelProps>;
    onSubmit: (modelData: ModelRequestDTO) => void;
    onCancel: () => void;
};

const ModelForm: React.FC<ModelFormProps> = ({ initialData, onSubmit, onCancel }) => {
    const [formData, setFormData] = React.useState({
        brand: initialData.brand || '',
        model: initialData.model || '',
        modelYear: initialData.modelYear || new Date().getFullYear(),
        segment: initialData.segment || 'Sedan',
        doors: initialData.doors || 4,
        seatingCapacity: initialData.seatingCapacity || 5,
        luggageCapacity: initialData.luggageCapacity || 2,
        fuelType: initialData.fuelType || 'petrol',
        transmission: initialData.transmission || 'automatic',
        rentalPricePerDay: initialData.rentalPricePerDay || 50,
        airConditioning: initialData.airConditioning ?? true,
        infotainmentSystem: initialData.infotainmentSystem ?? true,
        safetyRating: initialData.safetyRating || 5
    });

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : value
        }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: checked
        }));
    };

    const handleSelectChange = (e: SelectChangeEvent) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'safetyRating' ? Number(value) : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const mappedData: ModelRequestDTO = {
            brand: formData.brand,
            model: formData.model,
            modelYear: formData.modelYear,
            segment: formData.segment,
            doors: formData.doors,
            seatingCapacity: formData.seatingCapacity,
            luggageCapacity: formData.luggageCapacity,
            category: formData.segment,
            engineType: formData.fuelType,
            transmissionType: formData.transmission,
            drivetrain: 'FWD',
            motorDisplacement: 1.6,
            airConditioning: formData.airConditioning,
            infotainmentOptions: formData.infotainmentSystem ? 'Standard' : 'None',
            safetyFeatures: formData.safetyRating.toString(),
            rentalPricePerDay: formData.rentalPricePerDay,
            safetyRating: formData.safetyRating
        };

        onSubmit(mappedData);
    };

    const segments = ['Sedan', 'SUV', 'Hatchback', 'Coupe', 'Convertible', 'Minivan'];
    const fuelTypes = ['petrol', 'diesel', 'hybrid', 'electric'];
    const transmissions = ['automatic', 'manual'];
    const safetyRatings = [1, 2, 3, 4, 5];

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    {initialData.id ? 'Edit' : 'Add New'} Car Model
                </Typography>

                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <Stack spacing={2}>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                            <TextField
                                fullWidth
                                required
                                label="Brand"
                                name="brand"
                                value={formData.brand}
                                onChange={handleTextChange}
                            />
                            <TextField
                                fullWidth
                                required
                                label="Model"
                                name="model"
                                value={formData.model}
                                onChange={handleTextChange}
                            />
                        </Stack>

                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                            <TextField
                                fullWidth
                                required
                                type="number"
                                label="Year"
                                name="modelYear"
                                value={formData.modelYear}
                                onChange={handleTextChange}
                            />
                            <FormControl fullWidth>
                                <InputLabel>Segment</InputLabel>
                                <Select
                                    name="segment"
                                    value={formData.segment}
                                    label="Segment"
                                    onChange={handleSelectChange}
                                >
                                    {segments.map((s) => (
                                        <MenuItem key={s} value={s}>
                                            {s}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <TextField
                                fullWidth
                                required
                                type="number"
                                label="Price/Day (€)"
                                name="rentalPricePerDay"
                                value={formData.rentalPricePerDay}
                                onChange={handleTextChange}
                            />
                        </Stack>

                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                            <TextField
                                fullWidth
                                required
                                type="number"
                                label="Doors"
                                name="doors"
                                value={formData.doors}
                                onChange={handleTextChange}
                            />
                            <TextField
                                fullWidth
                                required
                                type="number"
                                label="Seats"
                                name="seatingCapacity"
                                value={formData.seatingCapacity}
                                onChange={handleTextChange}
                            />
                            <TextField
                                fullWidth
                                required
                                type="number"
                                label="Luggage"
                                name="luggageCapacity"
                                value={formData.luggageCapacity}
                                onChange={handleTextChange}
                            />
                            <FormControl fullWidth>
                                <InputLabel>Safety Rating</InputLabel>
                                <Select
                                    name="safetyRating"
                                    value={formData.safetyRating.toString()}
                                    label="Safety Rating"
                                    onChange={handleSelectChange}
                                >
                                    {safetyRatings.map((r) => (
                                        <MenuItem key={r} value={r.toString()}>
                                            {r} ★
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Stack>

                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                            <FormControl fullWidth>
                                <InputLabel>Fuel Type</InputLabel>
                                <Select
                                    name="fuelType"
                                    value={formData.fuelType}
                                    label="Fuel Type"
                                    onChange={handleSelectChange}
                                >
                                    {fuelTypes.map((type) => (
                                        <MenuItem key={type} value={type}>
                                            {type}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl fullWidth>
                                <InputLabel>Transmission</InputLabel>
                                <Select
                                    name="transmission"
                                    value={formData.transmission}
                                    label="Transmission"
                                    onChange={handleSelectChange}
                                >
                                    {transmissions.map((trans) => (
                                        <MenuItem key={trans} value={trans}>
                                            {trans}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Stack>

                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={formData.airConditioning}
                                        onChange={handleCheckboxChange}
                                        name="airConditioning"
                                    />
                                }
                                label="Air Conditioning"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={formData.infotainmentSystem}
                                        onChange={handleCheckboxChange}
                                        name="infotainmentSystem"
                                    />
                                }
                                label="Infotainment System"
                            />
                        </Stack>

                        <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
                            <Button variant="outlined" onClick={onCancel}>
                                Cancel
                            </Button>
                            <Button variant="contained" type="submit">
                                {initialData.id ? 'Update' : 'Save'} Model
                            </Button>
                        </Stack>
                    </Stack>
                </Box>
            </CardContent>
        </Card>
    );
};

export default ModelForm;
