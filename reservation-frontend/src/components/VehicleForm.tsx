import React, { useState } from "react";
import { VehicleProps } from "./Vehicle";

type CarModelOption = {
    id: number;
    brand: string;
    model: string;
    year: number;
};

type VehicleFormProps = {
    onSubmit: (vehicleData: Omit<VehicleProps, 'id'>) => void;
    carModels: CarModelOption[];
    initialData?: Partial<VehicleProps>;
};

const VehicleForm: React.FC<VehicleFormProps> = ({
                                                     onSubmit,
                                                     carModels,
                                                     initialData = {}
                                                 }) => {
    const [formData, setFormData] = useState({
        licensePlate: initialData.licensePlate || '',
        vin: initialData.vin || '',
        status: initialData.status || 'available',
        mileage: initialData.mileage || 0,
        carModelId: initialData.carModelId || '',
        notes: initialData.notes || ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'mileage' ? Number(value) : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const preparedData = {
            ...formData,
            carModelId: Number(formData.carModelId),
        };

        onSubmit(preparedData);
    };

    return (
        <div className="card mb-4">
            <div className="card-body">
                <h3 className="card-title">{initialData.id ? 'Edit' : 'Add New'} Vehicle</h3>
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">License Plate</label>
                            <input
                                type="text"
                                className="form-control"
                                name="licensePlate"
                                value={formData.licensePlate}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <label className="form-label">VIN</label>
                            <input
                                type="text"
                                className="form-control"
                                name="vin"
                                value={formData.vin}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Status</label>
                            <select
                                className="form-select"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                required
                            >
                                <option value="available">Available</option>
                                <option value="rented">Rented</option>
                                <option value="maintenance">Under Maintenance</option>
                            </select>
                        </div>

                        <div className="col-md-6 mb-3">
                            <label className="form-label">Mileage (km)</label>
                            <input
                                type="number"
                                className="form-control"
                                name="mileage"
                                value={formData.mileage}
                                onChange={handleChange}
                                min="0"
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Car Model</label>
                        <select
                            className="form-select"
                            name="carModelId"
                            value={formData.carModelId}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select a model</option>
                            {carModels.map(model => (
                                <option key={model.id} value={model.id}>
                                    {model.brand} {model.model} ({model.year})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Notes</label>
                        <textarea
                            className="form-control"
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            rows={3}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary">
                        {initialData.id ? 'Update' : 'Save'} Vehicle
                    </button>
                </form>
            </div>
        </div>
    );
};

export default VehicleForm;