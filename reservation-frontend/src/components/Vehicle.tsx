import {useNavigate} from "react-router-dom";

export type VehicleProps = {
    carModelId: number;
    id: number;
    licensePlate: string;
    vin: string;
    status: "available" | "rented"; // Tipi specifici
    mileage: number;
    notes?: string; // Opzionale
};

export default function Vehicle({ id, licensePlate, vin, status, mileage, notes }: VehicleProps) {
    const navigate = useNavigate();

    return (
        <div className="card p-3">
            <h5>Vehicle: {licensePlate}</h5>
            <p>VIN: {vin}</p>
            <p>Status: {status}</p>
            <p>Mileage: {mileage} km</p>
            {notes && <p>Notes: {notes}</p>}

            <button
                className="btn btn-outline-secondary mt-2"
                onClick={() => navigate(`maintenances/${id}`)}
            >
                View Maintenance
            </button>

            <button
                className="btn btn-outline-secondary mt-2"
                onClick={() => navigate(`notes/${id}`)}
            >
                View Vehicle Notes
            </button>
        </div>
    );
}
