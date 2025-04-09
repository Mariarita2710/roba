import React from 'react';
import { ModelProps } from './Model';
import { ModelRequestDTO } from '../types.ts';

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
        fuelType: initialData.fuelType || 'petrol',
        transmission: initialData.transmission || 'automatic',
        rentalPricePerDay: initialData.rentalPricePerDay || 50,
        luggageCapacity: initialData.luggageCapacity || 2,
        airConditioning: initialData.airConditioning ?? true,
        infotainmentSystem: initialData.infotainmentSystem ?? true,
        safetyRating: initialData.safetyRating || 5
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox'
                ? checked
                : type === 'number'
                    ? Number(value)
                    : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const mappedData = {
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
            safetyFeatures: 'Basic',
            rentalPricePerDay: formData.rentalPricePerDay
        };

        onSubmit(mappedData);
    };

    const segments = ['Sedan', 'SUV', 'Hatchback', 'Coupe', 'Convertible', 'Minivan'];
    const fuelTypes = ['petrol', 'diesel', 'hybrid', 'electric'];
    const transmissions = ['automatic', 'manual'];
    const safetyRatings = [1, 2, 3, 4, 5];

    return (
        <div className="card mb-4">
            <div className="card-body">
                <h3 className="card-title mb-4">{initialData.id ? 'Edit' : 'Add New'} Car Model</h3>
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Brand*</label>
                            <input type="text" className="form-control" name="brand" value={formData.brand} onChange={handleChange} required />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Model*</label>
                            <input type="text" className="form-control" name="model" value={formData.model} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-4 mb-3">
                            <label className="form-label">Year*</label>
                            <input type="number" className="form-control" name="modelYear" value={formData.modelYear} onChange={handleChange} required />
                        </div>
                        <div className="col-md-4 mb-3">
                            <label className="form-label">Segment*</label>
                            <select className="form-select" name="segment" value={formData.segment} onChange={handleChange}>
                                {segments.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div className="col-md-4 mb-3">
                            <label className="form-label">Price/Day (€)*</label>
                            <input type="number" className="form-control" name="rentalPricePerDay" value={formData.rentalPricePerDay} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-3 mb-3">
                            <label className="form-label">Doors*</label>
                            <input type="number" className="form-control" name="doors" value={formData.doors} onChange={handleChange} required />
                        </div>
                        <div className="col-md-3 mb-3">
                            <label className="form-label">Seats*</label>
                            <input type="number" className="form-control" name="seatingCapacity" value={formData.seatingCapacity} onChange={handleChange} required />
                        </div>
                        <div className="col-md-3 mb-3">
                            <label className="form-label">Luggage Capacity*</label>
                            <input type="number" className="form-control" name="luggageCapacity" value={formData.luggageCapacity} onChange={handleChange} required />
                        </div>
                        <div className="col-md-3 mb-3">
                            <label className="form-label">Safety Rating*</label>
                            <select className="form-select" name="safetyRating" value={formData.safetyRating} onChange={handleChange}>
                                {safetyRatings.map(r => <option key={r} value={r}>{r} ★</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Fuel Type*</label>
                            <select className="form-select" name="fuelType" value={formData.fuelType} onChange={handleChange}>
                                {fuelTypes.map(type => <option key={type} value={type}>{type}</option>)}
                            </select>
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Transmission*</label>
                            <select className="form-select" name="transmission" value={formData.transmission} onChange={handleChange}>
                                {transmissions.map(trans => <option key={trans} value={trans}>{trans}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-3 form-check">
                            <input className="form-check-input" type="checkbox" name="airConditioning" checked={formData.airConditioning} onChange={handleChange} />
                            <label className="form-check-label">Air Conditioning</label>
                        </div>
                        <div className="col-md-6 mb-3 form-check">
                            <input className="form-check-input" type="checkbox" name="infotainmentSystem" checked={formData.infotainmentSystem} onChange={handleChange} />
                            <label className="form-check-label">Infotainment System</label>
                        </div>
                    </div>

                    <div className="d-flex justify-content-end gap-2">
                        <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>Cancel</button>
                        <button type="submit" className="btn btn-primary">{initialData.id ? 'Update' : 'Save'} Model</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModelForm;
