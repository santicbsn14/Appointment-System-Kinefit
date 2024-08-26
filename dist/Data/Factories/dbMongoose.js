import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
class DbMongoose {
    constructor() {
        this.connection = null;
    }
    async init() {
        try {
            this.connection = await mongoose.connect(process.env.DB_URI);
        }
        catch (error) {
            throw new Error(`Error en la conexión a la base de datos: ${error}`);
        }
    }
    async close() {
        if (this.connection) {
            await this.connection.disconnect();
        }
    }
    async drop() {
        if (this.connection && this.connection.connection && this.connection.connection.db) {
            await this.connection.connection.db.dropDatabase();
        }
        else {
            throw new Error("Database connection is not properly initialized.");
        }
    }
}
export default DbMongoose;
