export type VehicleRequestDTO = {
    carModelId: number;
    licensePlate: string;
    vin: string;
    status: 'available' | 'rented' | 'maintenance';
    mileage: number;
    notes?: string;
};


export type ModelRequestDTO = {
    brand: string;
    model: string;
    modelYear: number;
    segment: string;
    doors: number;
    seatingCapacity: number;
    luggageCapacity: number;
    category: string;
    engineType: string;
    transmissionType: string;
    drivetrain: string;
    motorDisplacement: number;
    airConditioning: boolean;
    infotainmentOptions: string;
    safetyFeatures: string;
    rentalPricePerDay: number;
    safetyRating: number;
};