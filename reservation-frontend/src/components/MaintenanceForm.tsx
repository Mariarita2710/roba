import React, { useEffect, useState } from "react";
import { MaintenanceRecord } from "../services/api";

interface Props {
    initialData?: MaintenanceRecord | null;
    onSubmit: (data: Omit<MaintenanceRecord, "id" | "vehicleId">) => Promise<void>;
    onCancel: () => void;
}


const MaintenanceForm: React.FC<Props> = ({ initialData, onSubmit, onCancel }) => {
    const [type, setType] = useState("");
    const [description, setDescription] = useState("");
    const [maintenanceDate, setMaintenanceDate] = useState("");
    const [cost, setCost] = useState("");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (initialData) {
            setType(initialData.type || "");
            setDescription(initialData.description || "");
            setMaintenanceDate(initialData.maintenanceDate || "");
            setCost(initialData.cost.toString());
        }
    }, [initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await onSubmit({
                type,
                description,
                maintenanceDate,
                cost: parseFloat(cost),
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Submission failed");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-4">
            <h3>{initialData ? "Edit Maintenance Record" : "Add Maintenance Record"}</h3>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="mb-2">
                <label className="form-label">Type</label>
                <input
                    type="text"
                    className="form-control"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    required
                />
            </div>

            <div className="mb-2">
                <label className="form-label">Description</label>
                <input
                    type="text"
                    className="form-control"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
            </div>

            <div className="mb-2">
                <label className="form-label">Date</label>
                <input
                    type="datetime-local"
                    className="form-control"
                    value={maintenanceDate}
                    onChange={(e) => setMaintenanceDate(e.target.value)}
                    required
                />
            </div>

            <div className="mb-2">
                <label className="form-label">Cost (€)</label>
                <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    required
                />
            </div>

            <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary">
                    {initialData ? "Update" : "Create"}
                </button>
                <button type="button" className="btn btn-secondary" onClick={onCancel}>
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default MaintenanceForm;
