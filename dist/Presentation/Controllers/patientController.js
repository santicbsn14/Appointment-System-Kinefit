import PatientManager from "../../Domain/Manager/patientManager.js";
export const createPatient = async (req, res, next) => {
    try {
        const manager = new PatientManager();
        if (!req.body) {
            throw new Error('Request body is empty');
        }
        const body = req.body;
        const createdPatient = await manager.createPatient(body);
        res.status(201).json(createdPatient);
    }
    catch (error) {
        next(error);
    }
};
export const getAll = async (req, res, next) => {
    try {
        const manager = new PatientManager();
        const { limit, page } = req.query;
        const data = await manager.getAll({ limit, page });
        res.send({ status: 'success', patients: data.docs, ...data, docs: undefined });
    }
    catch (error) {
        next(error);
    }
};
export const getById = async (req, res, next) => {
    try {
        const manager = new PatientManager();
        let id = req.params.id;
        res.status(200).json(await manager.getPatientById(id));
    }
    catch (error) {
        next(error);
    }
};
export const update = async (req, res, next) => {
    try {
        const manager = new PatientManager();
        let id = req.params.id;
        let obj = req.body;
        res.status(201).json(await manager.updatePatient(obj, id));
    }
    catch (error) {
        next(error);
    }
};
export const deleteOne = async (req, res, next) => {
    try {
        const manager = new PatientManager();
        let id = req.params.id;
        res.status(201).json(await manager.deletePatient(id));
    }
    catch (error) {
        next(error);
    }
};
