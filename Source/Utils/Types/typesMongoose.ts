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
    limit?: number;
    page?: number;
}
export type IdMongo = mongoose.Types.ObjectId
