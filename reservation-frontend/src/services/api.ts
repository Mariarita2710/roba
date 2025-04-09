const API_BASE_URL = 'http://localhost:8080/api/v1';

const fetchData = async (url: string, options?: RequestInit) => {
    const response = await fetch(url, options);
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Request failed');
    }
    return response.json();
};

// Car Models
export const fetchCarModels = async (page = 0, size = 10, filters: Record<string, string> = {}) => {
    const params = new URLSearchParams({ page: page.toString(), size: size.toString(), ...filters });
    const url = `${API_BASE_URL}/models?${params}`;
    console.log("FETCHING MODELS FROM:", url); // 👈
    return fetchData(url);
};

export const fetchCarModelDetails = async (id: number) =>
    fetchData(`${API_BASE_URL}/models/${id}`);

export const createCarModel = async (data: any) =>
    fetchData(`${API_BASE_URL}/models`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

export const updateCarModel = async (id: number, data: any) => {
    const response = await fetch(`${API_BASE_URL}/models/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update model');
    }

    return response.json();
};

export const deleteCarModel = async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/models/${id}`, {
        method: 'DELETE'
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete model');
    }


    try {
        return await response.json();
    } catch {
        return { success: true };
    }
};
// Vehicles
export const fetchVehicles = async (page = 0, size = 10, filters: Record<string, string> = {}) => {
    const params = new URLSearchParams({ page: page.toString(), size: size.toString(), ...filters });
    return fetchData(`${API_BASE_URL}/vehicles?${params}`);
};

export const fetchVehicleDetails = async (id: number) =>
    fetchData(`${API_BASE_URL}/vehicles/${id}`);

export const createVehicle = async (data: any) =>
    fetchData(`${API_BASE_URL}/vehicles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

export const updateVehicle = async (id: number, data: any) =>
    fetchData(`${API_BASE_URL}/vehicles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

export const partialUpdateVehicle = async (id: number, patch: any) =>
    fetchData(`${API_BASE_URL}/vehicles/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
    });

export const deleteVehicle = async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
        method: 'DELETE'
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete vehicle');
    }


    try {
        return await response.json();
    } catch {
        return {success: true};
    }
}

// Maintenance
export const fetchVehicleMaintenances = async (
    vehicleId: number,
    page = 0,
    size = 10,
    filters: Record<string, string> = {}
) => {
    const params = new URLSearchParams({ page: page.toString(), size: size.toString(), ...filters });
    return fetchData(`${API_BASE_URL}/vehicles/${vehicleId}/maintenances?${params}`);
};

export const fetchMaintenanceDetails = async (vehicleId: number, maintenanceId: number) =>
    fetchData(`${API_BASE_URL}/vehicles/${vehicleId}/maintenances/${maintenanceId}`);

export const createMaintenance = async (vehicleId: number, data: any) =>
    fetchData(`${API_BASE_URL}/vehicles/${vehicleId}/maintenances`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

export const updateMaintenance = async (vehicleId: number, maintenanceId: number, data: any) =>
    fetchData(`${API_BASE_URL}/vehicles/${vehicleId}/maintenances/${maintenanceId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

export const deleteMaintenance = async (vehicleId: number, maintenanceId: number) => {
    const response = await fetch(`${API_BASE_URL}/vehicles/${vehicleId}/maintenances/${maintenanceId}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete maintenance record');
    }

    if (response.status === 204) {
        return;
    }

    return response.json();
};


// Notes
export const fetchVehicleNotes = async (
    vehicleId: number,
    page = 0,
    size = 10,
    filters: Record<string, string> = {}
) => {
    const params = new URLSearchParams({ page: page.toString(), size: size.toString(), ...filters });
    return fetchData(`${API_BASE_URL}/vehicles/${vehicleId}/notes?${params}`);
};

export const fetchNoteDetails = async (vehicleId: number, noteId: number) =>
    fetchData(`${API_BASE_URL}/vehicles/${vehicleId}/notes/${noteId}`);

export const createNote = async (vehicleId: number, data: any) =>
    fetchData(`${API_BASE_URL}/vehicles/${vehicleId}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

export const updateNote = async (vehicleId: number, noteId: number, data: any) =>
    fetchData(`${API_BASE_URL}/vehicles/${vehicleId}/notes/${noteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

export const deleteNote = async (vehicleId: number, noteId: number) => {
    const response = await fetch(`${API_BASE_URL}/vehicles/${vehicleId}/notes/${noteId}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete note');
    }

    return;
};


// Utility
export const getPaginatedData = (response: any) => ({
    content: response.content || [],
    totalElements: response.totalElements || 0,
    totalPages: response.totalPages || 0,
    pageNumber: response.number || 0,
    pageSize: response.size || 10,
    isFirst: response.first || false,
    isLast: response.last || false,
});

export interface MaintenanceRecord {
    id: number;
    vehicleId: number;
    type: string;
    description: string;
    maintenanceDate: string; // usa "date" solo se così arriva dal backend
    cost: number;
}

export type Note = {
    id: number;
    note: string;
    author: string;
    createdAt: string;
};

