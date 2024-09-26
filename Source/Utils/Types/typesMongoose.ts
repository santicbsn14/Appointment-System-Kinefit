import mongoose from "mongoose";
export interface Paginated<T> {
    docs: T[];
    totalDocs: number;
    limit: number;
    totalPages: number;
    page: number;
    pagingCounter: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    prevPage?: number | null;
    nextPage?: number | null;
}
export interface Criteria {
    limit?: number;                      // Número máximo de resultados por página
    page?: number;                       // Número de página a recuperar
    pacient_id?: string;                 // ID del paciente para filtrar
    professional_id?: string;             // ID del profesional para filtrar
    date_time?: Date;                    // Fecha y hora para filtrar
    state?: string;                      // Estado del turno (opcional)
    session_type?: string;               // Tipo de sesión (opcional)
    // Puedes añadir más filtros según las propiedades que tenga tu modelo Appointment
}
export type IdMongo = mongoose.Types.ObjectId
