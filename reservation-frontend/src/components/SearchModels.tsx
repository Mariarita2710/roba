import React, { useState } from 'react';
import { fetchCarModelDetails } from '../services/api';

type SearchModelsProps = {
    onSearch: (filters: Record<string, string>) => void;
    onReset: () => void;
};

const SearchModels: React.FC<SearchModelsProps> = ({ onSearch, onReset }) => {
    const [searchParams, setSearchParams] = useState({
        id: '',
        brand: '',
        model: '',
        segment: '',
        fuelType: '',
        transmission: '',
        minPrice: '',
        maxPrice: ''
    });

    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setSearchParams(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            // Prepara l'oggetto filtri per il backend
            const filters: Record<string, string> = {};

            if (searchParams.id) {
                try {
                    const model = await fetchCarModelDetails(Number(searchParams.id));
                    onSearch({ id: searchParams.id }); // Passa l'ID come filtro per mostrare solo quel modello
                } catch {
                    setError("Model not found");
                }
                return;
            }



            // Altrimenti applica tutti i filtri se specificati
            if (searchParams.brand) filters.brand = searchParams.brand;
            if (searchParams.model) filters.model = searchParams.model;
            if (searchParams.segment) filters.segment = searchParams.segment;
            if (searchParams.fuelType) filters.engineType = searchParams.fuelType;
            if (searchParams.transmission) filters.transmissionType = searchParams.transmission;

            if (searchParams.minPrice) filters.minPrice = searchParams.minPrice;
            if (searchParams.maxPrice) filters.maxPrice = searchParams.maxPrice;

            onSearch(filters); // Passa i filtri al componente padre

        } catch (err) {
            console.error('Search failed:', err);
            setError(err instanceof Error ? err.message : 'Search failed');
            onSearch({}); // Notifica il reset dei filtri
        }
    };

    const handleReset = () => {
        setSearchParams({
            id: '',
            brand: '',
            model: '',
            segment: '',
            fuelType: '',
            transmission: '',
            minPrice: '',
            maxPrice: ''
        });
        setError(null);
        onReset(); // Notifica il componente padre di resettare la ricerca
    };

    const segments = ['Sedan', 'SUV', 'Hatchback', 'Coupe', 'Convertible', 'Minivan'];
    const fuelTypes = ['petrol', 'diesel', 'hybrid', 'electric'];
    const transmissions = ['automatic', 'manual'];

    return (
        <div className="card mb-4">
            <div className="card-body">
                <h5 className="card-title">Search Car Models</h5>

                {error && (
                    <div className="alert alert-danger mb-3">
                        {error}
                        <button
                            type="button"
                            className="btn-close float-end"
                            onClick={() => setError(null)}
                            aria-label="Close"
                        />
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="row mb-3">
                        <div className="col-md-4">
                            <label htmlFor="modelId" className="form-label">Model ID</label>
                            <input
                                id="modelId"
                                type="number"
                                className="form-control"
                                name="id"
                                value={searchParams.id}
                                onChange={handleChange}
                                min="1"
                                placeholder="Leave empty for filter search"
                            />
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="brand" className="form-label">Brand</label>
                            <input
                                id="brand"
                                type="text"
                                className="form-control"
                                name="brand"
                                value={searchParams.brand}
                                onChange={handleChange}
                                placeholder="e.g. Toyota"
                            />
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="model" className="form-label">Model</label>
                            <input
                                id="model"
                                type="text"
                                className="form-control"
                                name="model"
                                value={searchParams.model}
                                onChange={handleChange}
                                placeholder="e.g. Corolla"
                            />
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col-md-3">
                            <label htmlFor="segment" className="form-label">Segment</label>
                            <select
                                id="segment"
                                className="form-select"
                                name="segment"
                                value={searchParams.segment}
                                onChange={handleChange}
                            >
                                <option value="">All segments</option>
                                {segments.map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-3">
                            <label htmlFor="fuelType" className="form-label">Fuel Type</label>
                            <select
                                id="fuelType"
                                className="form-select"
                                name="fuelType"
                                value={searchParams.fuelType}
                                onChange={handleChange}
                            >
                                <option value="">All fuel types</option>
                                {fuelTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-3">
                            <label htmlFor="transmission" className="form-label">Transmission</label>
                            <select
                                id="transmission"
                                className="form-select"
                                name="transmission"
                                value={searchParams.transmission}
                                onChange={handleChange}
                            >
                                <option value="">All transmissions</option>
                                {transmissions.map(trans => (
                                    <option key={trans} value={trans}>{trans}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-3">
                            <label htmlFor="priceRange" className="form-label">Price Range (€)</label>
                            <div id="priceRange" className="input-group">
                                <input
                                    type="number"
                                    className="form-control"
                                    name="minPrice"
                                    value={searchParams.minPrice}
                                    onChange={handleChange}
                                    placeholder="Min"
                                    min="0"
                                    step="1"
                                />
                                <span className="input-group-text">to</span>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="maxPrice"
                                    value={searchParams.maxPrice}
                                    onChange={handleChange}
                                    placeholder="Max"
                                    min="0"
                                    step="1"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="d-flex justify-content-between">
                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={handleReset}
                        >
                            <i className="bi bi-arrow-counterclockwise me-1"></i>
                            Reset Filters
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                        >
                            <i className="bi bi-search me-1"></i>
                            Search
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SearchModels;