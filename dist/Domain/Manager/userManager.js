import container from "../../container.js";
import emailValidation from "../Validations/emailValidation.js";
import idValidation from "../Validations/idValidation.js";
import createUserValidation from "../Validations/CreatesValidation/createUserValidation.js";
import updateUserValidation from "../Validations/UserValidations/updateUserValidation.js";
import { validPassword } from "../../Utils/hashService.js";
import admin from "firebase-admin";
class UserManager {
    constructor() {
        this.userRepository = container.resolve('UserRepository');
    }
    async getAll(criteria) {
        return await this.userRepository.getAll(criteria);
    }
    async getUserById(id) {
        await idValidation.parseAsync(id);
        return await this.userRepository.getUserById(id);
    }
    async getUserByEmail(email) {
        await emailValidation.parseAsync({ email });
        return await this.userRepository.getUserByEmail(email);
    }
    async createUser(body) {
        await createUserValidation.parseAsync(body);
        return await this.userRepository.createUser(body);
    }
    async updateUser(body, id) {
        await updateUserValidation.parseAsync({ ...body, id });
        let user = await this.userRepository.getUserByEmail(body.email);
        const isHashedPassword = validPassword(body.password, user.password);
        if (!isHashedPassword) {
            throw new Error('Updated failed, invalid password.');
        }
        return await this.userRepository.updateUser(id, body);
    }
    async deleteUser(id) {
        await idValidation.parseAsync(id);
        let userToDelete = await this.userRepository.getUserById(id);
        const userRecord = await admin.auth().getUserByEmail(userToDelete.email);
        const uid = userRecord.uid;
        await admin.auth().deleteUser(uid);
        return await this.userRepository.deleteUser(id);
    }
}
export default UserManager;
