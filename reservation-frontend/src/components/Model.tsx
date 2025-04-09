import React, { useState } from 'react';
import { deleteCarModel, updateCarModel } from '../services/api';
import ModelForm from './ModelForm';
import ErrorAlert from './ErrorAlert';
import { ModelRequestDTO } from '../types';

export type ModelProps = {
    id: number;
    brand: string;
    model: string;
    modelYear: number;
    segment: string;
    doors: number;
    seatingCapacity: number;
    luggageCapacity: number;
    fuelType: 'petrol' | 'diesel' | 'hybrid' | 'electric';
    transmission: 'manual' | 'automatic';
    rentalPricePerDay: number;
    airConditioning: boolean;
    infotainmentSystem: boolean;
    safetyRating: number;
    onModelUpdated?: (updatedModel: ModelProps) => void;
    onModelDeleted?: (deletedId: number) => void;
};

const Model: React.FC<ModelProps> = ({
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
                                         onModelUpdated,
                                         onModelDeleted
                                     }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleUpdate = async (updatedData: ModelRequestDTO) => {
        try {
            await updateCarModel(id, {
                ...updatedData,
                id
            });

            setIsEditing(false);
            setError(null);

            if (onModelUpdated) {
                onModelUpdated({
                    id,
                    brand: updatedData.brand,
                    model: updatedData.model,
                    modelYear: updatedData.modelYear,
                    segment: updatedData.segment,
                    doors: updatedData.doors,
                    seatingCapacity: updatedData.seatingCapacity,
                    luggageCapacity: updatedData.luggageCapacity,
                    fuelType: updatedData.engineType as 'petrol' | 'diesel' | 'hybrid' | 'electric',
                    transmission: updatedData.transmissionType as 'manual' | 'automatic',
                    rentalPricePerDay: updatedData.rentalPricePerDay,
                    airConditioning: updatedData.airConditioning,
                    infotainmentSystem: updatedData.infotainmentOptions === 'Standard',
                    safetyRating: parseInt(updatedData.safetyFeatures) || 5
                });
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to update model');
        }
    };


    const handleDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete ${brand} ${model}?`)) {
            return;
        }

        try {
            await deleteCarModel(id);
            setError(null);

            if (onModelDeleted) {
                onModelDeleted(id);
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to delete model');
        }
    };

    if (isEditing) {
        return (
            <div className="mb-4">
                {error && <ErrorAlert message={error} onClose={() => setError(null)} />}
                <ModelForm
                    initialData={{
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
                        safetyRating
                    }}
                    onSubmit={handleUpdate}
                    onCancel={() => {
                        setIsEditing(false);
                        setError(null);
                    }}
                />
            </div>
        );
    }

    return (
        <div className="card mb-3">
            <div className="card-body">
                {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

                <div className="d-flex justify-content-between align-items-start">
                    <div>
                        <h2 className="card-title mb-2">
                            {brand} {model} <span className="badge bg-secondary">{modelYear}</span>
                        </h2>
                        <div className="d-flex flex-wrap gap-2 mb-2">
                            <span className="badge bg-info text-dark">{segment}</span>
                            <span className="badge bg-light text-dark">{doors} doors</span>
                            <span className="badge bg-light text-dark">{seatingCapacity} seats</span>
                            <span className="badge bg-light text-dark">{luggageCapacity} bags</span>
                            <span className={`badge ${
                                fuelType === 'electric' ? 'bg-success' :
                                    fuelType === 'hybrid' ? 'bg-primary' : 'bg-warning'
                            }`}>
                                {fuelType}
                            </span>
                            <span className="badge bg-light text-dark">{transmission}</span>
                            <span className="badge bg-dark">
                                {Array(safetyRating).fill('★').join('')}
                            </span>
                            {airConditioning && <span className="badge bg-light text-dark">AC</span>}
                            {infotainmentSystem && <span className="badge bg-light text-dark">Audio</span>}
                        </div>
                    </div>
                    <div className="d-flex gap-2">
                        <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => setIsEditing(true)}
                            aria-label={`Edit ${brand} ${model}`}
                        >
                            <i className="bi bi-pencil"></i> Edit
                        </button>
                        <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={handleDelete}
                            aria-label={`Delete ${brand} ${model}`}
                        >
                            <i className="bi bi-trash"></i> Delete
                        </button>
                    </div>
                </div>

                <div className="mt-3">
                    <h5 className="text-success">
                        {rentalPricePerDay?.toLocaleString('en-US', {
                            style: 'currency',
                            currency: 'EUR',
                            minimumFractionDigits: 0
                        }) ?? 'N/A'} <small className="text-muted">/ day</small>
                    </h5>
                </div>
            </div>
        </div>
    );
};

export default Model;
