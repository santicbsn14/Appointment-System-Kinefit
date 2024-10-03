import ProfessionalTimeSlotsManager from "../../Domain/Manager/professionalTimeSlotsManager.js";
export const createProfessionalTimeSlots = async (req, res, next) => {
    try {
        const manager = new ProfessionalTimeSlotsManager();
        if (!req.body) {
            throw new Error('Request body is empty');
        }
        const professionalTimeSlotsData = req.body;
        const createdProfessionalTimeSlots = await manager.createProfessionalTimeSlots(professionalTimeSlotsData);
        res.status(201).json(createdProfessionalTimeSlots);
    }
    catch (error) {
        next(error);
    }
};
export const getAll = async (req, res, next) => {
    try {
        const manager = new ProfessionalTimeSlotsManager();
        const { limit, page } = req.query;
        const data = await manager.getAll({ limit, page });
        res.send({ status: 'success', professionalTimeSlots: data.docs, ...data, docs: undefined });
    }
    catch (error) {
        next(error);
    }
};
export const getById = async (req, res, next) => {
    try {
        const manager = new ProfessionalTimeSlotsManager();
        let id = req.params.id;
        res.status(200).json(await manager.getProfessionalTimeSlotsById(id));
    }
    catch (error) {
        next(error);
    }
};
export const getByPro = async (req, res, next) => {
    try {
        const manager = new ProfessionalTimeSlotsManager();
        let id = req.params.idp;
        res.status(200).json(await manager.getProfessionalTimeSlotsByPro(id));
    }
    catch (error) {
        next(error);
    }
};
export const update = async (req, res, next) => {
    try {
        const manager = new ProfessionalTimeSlotsManager();
        let id = req.params.id;
        let obj = req.body;
        res.status(201).json(await manager.updateProfessionalTimeSlots(obj, id));
    }
    catch (error) {
        next(error);
    }
};
export const deleteOne = async (req, res, next) => {
    try {
        const manager = new ProfessionalTimeSlotsManager();
        let id = req.params.id;
        res.status(201).json(await manager.deleteProfessionalTimeSlots(id));
    }
    catch (error) {
        next(error);
    }
};
