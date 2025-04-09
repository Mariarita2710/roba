import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    fetchVehicleMaintenances,
    createMaintenance,
    updateMaintenance,
    MaintenanceRecord,
} from "../services/api";
import MaintenanceForm from "../components/MaintenanceForm";
import MaintenanceTable from "../components/MaintenanceTable";

const MaintenancePage: React.FC = () => {
    const { vehicleId } = useParams<{ vehicleId: string }>();
    const [maintenances, setMaintenances] = useState<MaintenanceRecord[]>([]);
    const [selectedRecord, setSelectedRecord] = useState<MaintenanceRecord | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadMaintenances = async () => {
        if (!vehicleId) return;
        try {
            const data = await fetchVehicleMaintenances(parseInt(vehicleId), 0, 1000);
            setMaintenances(data.content || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
        }
    };

    useEffect(() => {
        loadMaintenances();
    }, [vehicleId]);

    const handleAdd = () => {
        setSelectedRecord(null);
        setShowForm(true);
    };

    const handleEdit = (record: MaintenanceRecord) => {
        setSelectedRecord(record);
        setShowForm(true);
    };

    const handleFormClose = () => {
        setShowForm(false);
        setSelectedRecord(null);
    };

    const handleFormSubmit = async (data: Omit<MaintenanceRecord, "id" | "vehicleId">) => {
        if (!vehicleId) return;

        try {
            if (selectedRecord) {
                await updateMaintenance(parseInt(vehicleId), selectedRecord.id, data);
            } else {
                await createMaintenance(parseInt(vehicleId), data);
            }
            handleFormClose();
            await loadMaintenances();
        } catch (err) {
            alert("Errore nel salvataggio: " + (err instanceof Error ? err.message : "Unknown error"));
        }
    };

    if (error) return <div>Error: {error}</div>;

    return (
        <div className="container mt-4">
            <h1>Maintenance Records for Vehicle #{vehicleId}</h1>

            {showForm ? (
                <MaintenanceForm
                    initialData={selectedRecord || undefined}
                    onSubmit={handleFormSubmit}
                    onCancel={handleFormClose}
                />
            ) : (
                <>
                    {maintenances.length === 0 ? (
                        <div className="alert alert-info d-flex justify-content-between align-items-center">
                            <span>No maintenance records found.</span>
                            <button onClick={handleAdd} className="btn btn-primary">
                                Add Maintenance Record
                            </button>
                        </div>
                    ) : (
                        <>
                            <MaintenanceTable
                                vehicleId={parseInt(vehicleId!)}
                                records={maintenances}
                                onMaintenanceUpdated={loadMaintenances}
                                onEdit={handleEdit}
                            />
                            <div className="text-end">
                                <button onClick={handleAdd} className="btn btn-success mt-3">
                                    Add Maintenance Record
                                </button>
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default MaintenancePage;
