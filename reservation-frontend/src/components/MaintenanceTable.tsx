import React, { useState } from 'react';
import { MaintenanceRecord, deleteMaintenance } from '../services/api';
import ErrorAlert from './ErrorAlert';

type MaintenanceTableProps = {
    vehicleId: number;
    records: MaintenanceRecord[];
    onMaintenanceUpdated: () => void;
    onEdit: (record: MaintenanceRecord) => void;
};

const MaintenanceTable: React.FC<MaintenanceTableProps> = ({
                                                               vehicleId,
                                                               records,
                                                               onMaintenanceUpdated,
                                                               onEdit,
                                                           }) => {
    const [error, setError] = useState<string | null>(null);

    const handleDelete = async (maintenanceId: number) => {
        if (!window.confirm('Are you sure you want to delete this maintenance record?')) return;
        try {
            await deleteMaintenance(vehicleId, maintenanceId);
            onMaintenanceUpdated();
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Failed to delete maintenance record');
            }
        }
    };

    return (
        <div>
            <h3 className="mb-3">Maintenance History</h3>
            {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

            <table className="table table-striped">
                <thead>
                <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Description</th>
                    <th>Cost</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {records.length === 0 && (
                    <tr>
                        <td colSpan={5}>No maintenance records available.</td>
                    </tr>
                )}
                {records.map(record => (
                    <tr key={record.id}>
                        <td>{new Date(record.maintenanceDate).toLocaleDateString()}</td>
                        <td>{record.type}</td>
                        <td>{record.description}</td>
                        <td>€{record.cost.toFixed(2)}</td>
                        <td>
                            <button
                                className="btn btn-sm btn-outline-primary me-2"
                                onClick={() => onEdit(record)}
                            >
                                Edit
                            </button>
                            <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDelete(record.id)}
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default MaintenanceTable;
