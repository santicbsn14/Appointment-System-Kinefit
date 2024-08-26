import ProfessionalManager from "../../Domain/Manager/professionalManager.js";
export const createProfessional = async (req, res, next) => {
    try {
        const manager = new ProfessionalManager();
        if (!req.body) {
            throw new Error('Request body is empty');
        }
        const body = req.body;
        const createdProfessional = await manager.createProfessional(body);
        res.status(201).json(createdProfessional);
    }
    catch (error) {
        next(error);
    }
};
export const getAll = async (req, res, next) => {
    try {
        const manager = new ProfessionalManager();
        const { limit, page } = req.query;
        const data = await manager.getAll({ limit, page });
        res.send({ status: 'success', professionals: data.docs, ...data, docs: undefined });
    }
    catch (error) {
        next(error);
    }
};
export const getById = async (req, res, next) => {
    try {
        const manager = new ProfessionalManager();
        let id = req.params.id;
        res.status(200).json(await manager.getProfessionalById(id));
    }
    catch (error) {
        next(error);
    }
};
export const update = async (req, res, next) => {
    try {
        const manager = new ProfessionalManager();
        let id = req.params.id;
        let obj = req.body;
        res.status(201).json(await manager.updateProfessional(obj, id));
    }
    catch (error) {
        next(error);
    }
};
export const deleteOne = async (req, res, next) => {
    try {
        const manager = new ProfessionalManager();
        let id = req.params.id;
        res.status(201).json(await manager.deleteProfessional(id));
    }
    catch (error) {
        next(error);
    }
};
