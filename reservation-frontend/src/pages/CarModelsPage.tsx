import React, { useEffect, useState, useCallback } from "react";
import {
    Box,
    Button,
    Typography,
    Stack,
    Select,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Pagination,
    FormControl,
    InputLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Model, { ModelProps } from "../components/Model";
import {
    fetchCarModels,
    fetchVehicles,
    createCarModel,
    updateCarModel,
    deleteCarModel,
    getPaginatedData,
    fetchCarModelDetails
} from "../services/api";
import ModelForm from "../components/ModelForm";
import ErrorAlert from "../components/ErrorAlert";
import SearchModels from "../components/SearchModels";
import { ModelRequestDTO } from '../types';
import { VehicleProps } from "../components/Vehicle";

const CarModelsPage: React.FC = () => {
    const [models, setModels] = useState<ModelProps[]>([]);
    const [vehicles, setVehicles] = useState<VehicleProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [editingModel, setEditingModel] = useState<ModelProps | null>(null);
    const [pagination, setPagination] = useState({ page: 0, size: 10, totalPages: 1 });
    const [filters, setFilters] = useState<Record<string, string>>({});

    const handleError = (err: unknown) => {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
    };

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const [modelRes, vehicleRes] = await Promise.all([
                fetchCarModels(pagination.page, pagination.size, filters),
                fetchVehicles(0, 1000)
            ]);

            const vehicleList: VehicleProps[] = vehicleRes.content;
            const usedModelIds = new Set(vehicleList.map(v => v.carModelId));

            const modelData = getPaginatedData(modelRes);
            const modelList: ModelProps[] = modelData.content.map(model => ({
                ...model,
                isDeletable: !usedModelIds.has(model.id)
            }));

            setModels(modelList);
            setVehicles(vehicleList);

            console.log(vehicleList)
            setPagination(prev => ({ ...prev, totalPages: modelData.totalPages }));
            setError(null);
        } catch (err: unknown) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, [pagination.page, pagination.size, filters]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleAddModel = async (modelData: ModelRequestDTO) => {
        try {
            const newModel = await createCarModel(modelData);
            const isDeletable = !vehicles.some(v => v.carModelId === newModel.id);
            setModels(prev => [{ ...newModel, isDeletable }, ...prev]);
            setShowForm(false);
            setError(null);
            setPagination(prev => ({ ...prev, page: 0 }));
        } catch (err: unknown) {
            handleError(err);
        }
    };

    const handleUpdateModel = async (updatedModel: ModelProps) => {
        try {
            await updateCarModel(updatedModel.id, updatedModel);
            const isDeletable = !vehicles.some(v => v.carModelId === updatedModel.id);
            setModels(prev =>
                prev.map(m => m.id === updatedModel.id ? { ...updatedModel, isDeletable } : m)
            );
            setEditingModel(null);
            setShowForm(false);
            setError(null);
        } catch (err: unknown) {
            handleError(err);
        }
    };

    const handleDeleteModel = async (id: number) => {
        try {
            await deleteCarModel(id);
            setModels(prev => prev.filter(m => m.id !== id));
            setError(null);
            await loadData();
        } catch (err: unknown) {
            handleError(err);
        }
    };

    const handlePageChange = (_: React.ChangeEvent<unknown>, newPage: number) => {
        setPagination(prev => ({ ...prev, page: newPage - 1 }));
    };

    const handleSearchResults = async (searchFilters: Record<string, string>) => {
        if (searchFilters.id) {
            try {
                const model = await fetchCarModelDetails(Number(searchFilters.id));
                const isDeletable = !vehicles.some(v => v.carModelId === model.id);
                setModels([{ ...model, isDeletable }]);
                setPagination({ page: 0, size: 10, totalPages: 1 });
            } catch {
                setModels([]);
                setError("Model not found");
            }
        } else {
            setFilters(searchFilters);
            setPagination(prev => ({ ...prev, page: 0 }));
        }
    };

    const handleResetSearch = () => {
        setFilters({});
        setPagination({ page: 0, size: 10, totalPages: 1 });
    };

    return (
        <Box p={3}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4">Car Models</Typography>
                <Button variant="contained" onClick={() => {
                    setEditingModel(null);
                    setShowForm(true);
                }}>
                    Add New Model
                </Button>
            </Stack>

            <SearchModels onSearch={handleSearchResults} onReset={handleResetSearch} />

            <Dialog open={showForm} onClose={() => setShowForm(false)} fullWidth maxWidth="sm">
                <DialogTitle>
                    {editingModel ? "Edit Model" : "Add Model"}
                    <IconButton
                        onClick={() => {
                            setShowForm(false);
                            setEditingModel(null);
                        }}
                        sx={{ position: "absolute", right: 8, top: 8 }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <ModelForm
                        initialData={editingModel || {}}
                        onSubmit={(modelData) => {
                            if (editingModel) {
                                handleUpdateModel({
                                    ...editingModel,
                                    ...modelData,
                                    fuelType: modelData.engineType as ModelProps['fuelType'],
                                    transmission: modelData.transmissionType as ModelProps['transmission'],
                                    infotainmentSystem: modelData.infotainmentOptions === 'Standard',
                                    safetyRating: parseInt(modelData.safetyFeatures) || 5,
                                });
                            } else {
                                handleAddModel(modelData);
                            }
                        }}
                        onCancel={() => {
                            setShowForm(false);
                            setEditingModel(null);
                        }}
                    />
                </DialogContent>
            </Dialog>

            <Stack direction="row" justifyContent="space-between" alignItems="center" mt={3} mb={2}>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Items per page</InputLabel>
                    <Select
                        value={pagination.size.toString()}
                        label="Items per page"
                        onChange={(e) => setPagination(prev => ({
                            ...prev,
                            size: Number(e.target.value),
                            page: 0
                        }))}
                    >
                        {[5, 10, 20, 50].map(size => (
                            <MenuItem key={size} value={size.toString()}>
                                {size}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Pagination
                    count={pagination.totalPages}
                    page={pagination.page + 1}
                    onChange={handlePageChange}
                    color="primary"
                />
            </Stack>

            {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

            {models.length === 0 ? (
                <Typography mt={3}>
                    No car models found. {Object.keys(filters).length > 0
                    ? "Try different search criteria."
                    : "Add a new model to get started."}
                </Typography>
            ) : (
                <Stack direction="row" flexWrap="wrap" spacing={3}>
                    {models.map((model) => (
                        <Box key={model.id} width={{ xs: '100%', sm: '48%', md: '31%' }}>
                            <Model
                                {...model}
                                onModelUpdated={handleUpdateModel}
                                onModelDeleted={handleDeleteModel}
                                onEditClick={() => {
                                    setEditingModel(model);
                                    setShowForm(true);
                                }}
                            />
                        </Box>
                    ))}
                </Stack>
            )}
        </Box>
    );
};

export default CarModelsPage;
