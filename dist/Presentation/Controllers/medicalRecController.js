import MedicalRecordManager from "../../Domain/Manager/medicalRecManager.js";
export const createMedicalRecord = async (req, res, next) => {
    try {
        const manager = new MedicalRecordManager();
        if (!req.body) {
            throw new Error('Request body is empty');
        }
        const medicalRecordData = req.body;
        const createdMedicalRecord = await manager.createMedicalRecord(medicalRecordData);
        res.status(201).json(createdMedicalRecord);
    }
    catch (error) {
        next(error);
    }
};
export const getAll = async (req, res, next) => {
    try {
        const manager = new MedicalRecordManager();
        const { limit, page } = req.query;
        const data = await manager.getAll({ limit, page });
        res.send({ status: 'success', medicalRecords: data.docs, ...data, docs: undefined });
    }
    catch (error) {
        next(error);
    }
};
export const getById = async (req, res, next) => {
    try {
        const manager = new MedicalRecordManager();
        let id = req.params.id;
        res.status(200).json(await manager.getMedicalRecordById(id));
    }
    catch (error) {
        next(error);
    }
};
export const update = async (req, res, next) => {
    try {
        const manager = new MedicalRecordManager();
        let id = req.params.id;
        let obj = req.body;
        res.status(201).json(await manager.updateMedicalRecord(obj, id));
    }
    catch (error) {
        next(error);
    }
};
export const deleteOne = async (req, res, next) => {
    try {
        const manager = new MedicalRecordManager();
        let id = req.params.id;
        res.status(201).json(await manager.deleteMedicalRecord(id));
    }
    catch (error) {
        next(error);
    }
};
