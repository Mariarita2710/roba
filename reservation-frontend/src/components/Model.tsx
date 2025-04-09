import React, { useState } from "react";
import { deleteCarModel } from "../services/api";
import ErrorAlert from "./ErrorAlert";
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Stack,
    Typography,
    Tooltip
} from "@mui/material";

export type ModelProps = {
    id: number;
    brand: string;
    model: string;
    modelYear: number;
    segment: string;
    doors: number;
    seatingCapacity: number;
    luggageCapacity: number;
    fuelType: "petrol" | "diesel" | "hybrid" | "electric";
    transmission: "manual" | "automatic";
    rentalPricePerDay: number;
    airConditioning: boolean;
    infotainmentSystem: boolean;
    safetyRating: number;
    onModelUpdated?: (updatedModel: ModelProps) => void;
    onModelDeleted?: (deletedId: number) => void;
    onEditClick?: () => void;
    isDeletable?: boolean;
};

const Model: React.FC<ModelProps> = (props) => {
    const {
        id,
        brand,
        model,
        modelYear,
        segment,
        doors,
        seatingCapacity,
        luggageCapacity,
        fuelType,
        transmission,
        rentalPricePerDay,
        airConditioning,
        infotainmentSystem,
        safetyRating,
        onModelDeleted,
        onEditClick,
        isDeletable = true
    } = props;

    const [error, setError] = useState<string | null>(null);

    const handleDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete ${brand} ${model}?`)) return;

        try {
            await deleteCarModel(id);
            setError(null);
            onModelDeleted?.(id);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to delete model");
        }
    };

    return (
        <Card sx={{ mb: 2 }}>
            <CardContent>
                {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box>
                        <Typography variant="h6" gutterBottom>
                            {brand} {model}{" "}
                            <Chip label={modelYear} size="small" sx={{ ml: 1 }} />
                        </Typography>

                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                            {segment && (
                                <Chip
                                    label={segment}
                                    color="info"
                                    size="small"
                                    variant="outlined"
                                    sx={{ minWidth: 80, textAlign: "center" }}
                                />
                            )}
                            <Chip
                                label={`${doors} doors`}
                                size="small"
                                variant="outlined"
                                sx={{ minWidth: 80, textAlign: "center" }}
                            />
                            <Chip
                                label={`${seatingCapacity} seats`}
                                size="small"
                                variant="outlined"
                                sx={{ minWidth: 80, textAlign: "center" }}
                            />
                            <Chip
                                label={`${luggageCapacity} bags`}
                                size="small"
                                variant="outlined"
                                sx={{ minWidth: 80, textAlign: "center" }}
                            />
                            <Chip
                                label={fuelType}
                                color={
                                    fuelType === "electric"
                                        ? "success"
                                        : fuelType === "hybrid"
                                            ? "primary"
                                            : "warning"
                                }
                                size="small"
                                variant="outlined"
                                sx={{ minWidth: 80, textAlign: "center" }}
                            />
                            <Chip
                                label={transmission}
                                size="small"
                                variant="outlined"
                                sx={{ minWidth: 80, textAlign: "center" }}
                            />
                            <Chip
                                label={"★".repeat(safetyRating)}
                                size="small"
                                variant="outlined"
                                sx={{ minWidth: 60, textAlign: "center" }}
                            />
                            {airConditioning && (
                                <Chip
                                    label="AC"
                                    size="small"
                                    variant="outlined"
                                    sx={{ minWidth: 40, textAlign: "center" }}
                                />
                            )}
                            {infotainmentSystem && (
                                <Chip
                                    label="Audio"
                                    size="small"
                                    variant="outlined"
                                    sx={{ minWidth: 60, textAlign: "center" }}
                                />
                            )}
                        </Stack>
                    </Box>

                    <Stack direction="row" spacing={1}>
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={onEditClick}
                        >
                            Edit
                        </Button>
                        <Tooltip
                            title={
                                isDeletable
                                    ? "Delete this model"
                                    : "You can't delete a model if a vehicle is already saved"
                            }
                            arrow
                        >
                            <Box>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    color="error"
                                    onClick={handleDelete}
                                    disabled={!isDeletable}
                                >
                                    Delete
                                </Button>
                            </Box>
                        </Tooltip>
                    </Stack>
                </Box>

                <Typography variant="h6" color="success.main">
                    {rentalPricePerDay?.toLocaleString("en-US", {
                        style: "currency",
                        currency: "EUR",
                        minimumFractionDigits: 0
                    }) ?? "N/A"}{" "}
                    <Typography component="span" variant="caption" color="text.secondary">
                        / day
                    </Typography>
                </Typography>
            </CardContent>
        </Card>
    );
};

export default Model;
