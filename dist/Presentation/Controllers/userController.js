import UserManager from "../../Domain/Manager/userManager.js";
import { createHash } from "../../Utils/hashService.js";
export const createUser = async (req, res, next) => {
    try {
        const manager = new UserManager();
        if (!req.body) {
            throw new Error('Request body is empty');
        }
        const { password, ...userData } = req.body;
        const hashedPassword = await createHash(password);
        const user = {
            ...userData,
            password: hashedPassword
        };
        const createdUser = await manager.createUser(user);
        res.status(201).json(createdUser);
    }
    catch (error) {
        next(error);
    }
};
export const getAll = async (req, res, next) => {
    try {
        const manager = new UserManager();
        const { limit, page } = req.query;
        const data = await manager.getAll({ limit, page });
        res.send({ status: 'success', users: data.docs, ...data, docs: undefined });
    }
    catch (error) {
        next(error);
    }
};
export const getById = async (req, res, next) => {
    try {
        const manager = new UserManager();
        let uid = req.params.id;
        res.status(200).json(await manager.getUserById(uid));
    }
    catch (error) {
        next(error);
    }
};
export const getByEmail = async (req, res, next) => {
    try {
        const manager = new UserManager();
        

        let { email } = req.query;
        res.status(200).json(await manager.getUserByEmail(email));
    }
    catch (error) {
        next(error);
    }
};
export const update = async (req, res, next) => {
    try {
        const manager = new UserManager();
        let id = req.params.id;
        let obj = req.body;
        res.status(201).json(await manager.updateUser(obj, id));
    }
    catch (error) {
        next(error);
    }
};
export const deleteOne = async (req, res, next) => {
    try {
        const manager = new UserManager();
        let id = req.params.id;
        res.status(201).json(await manager.deleteUser(id));
    }
    catch (error) {
        next(error);
    }
};
