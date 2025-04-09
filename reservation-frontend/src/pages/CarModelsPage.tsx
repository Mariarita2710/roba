import React, { useEffect, useState } from "react";
import Model, { ModelProps } from "../components/Model";
import { fetchCarModels, createCarModel } from "../services/api";
import ModelForm from "../components/ModelForm";
import { ModelRequestDTO } from '../types';

const CarModelsPage: React.FC = () => {
    const [models, setModels] = useState<ModelProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);

    const handleModelUpdated = (updatedModel: ModelProps) => {
        setModels(models.map(model =>
            model.id === updatedModel.id ? updatedModel : model
        ));
    };

    const handleModelDeleted = (deletedId: number) => {
        setModels(models.filter(model => model.id !== deletedId));
    };

    useEffect(() => {
        const loadModels = async () => {
            try {
                const data = await fetchCarModels();
                setModels(data.content); // Assuming paginated response
                setLoading(false);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("Unknown error");
                }
            }
        };
        loadModels().catch((err) => {
            console.error("Unhandled loadModels error:", err);
        });
    }, []);

    const handleAddModel = async (modelData: ModelRequestDTO) => {
        try {
            const newModel = await createCarModel(modelData);
            setModels([...models, newModel]);
            setShowForm(false);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Unknown error");
            }
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Car Models</h1>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? 'Cancel' : 'Add New Model'}
                </button>
            </div>

            {showForm && (
                <ModelForm
                    initialData={{}}
                    onSubmit={handleAddModel}
                    onCancel={() => setShowForm(false)}
                />
            )}

            <div className="row">
                {models.map((model) => (
                    <div key={model.id} className="col-md-6 mb-4">
                        <Model {...model}
                               onModelUpdated={handleModelUpdated}
                               onModelDeleted={handleModelDeleted}/>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CarModelsPage;