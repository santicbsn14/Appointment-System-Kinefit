import container from "../../container.js";
import emailValidation from "../Validations/emailValidation.js";
import idValidation from "../Validations/idValidation.js";
import createUserValidation from "../Validations/CreatesValidation/createUserValidation.js";
import updateUserValidation from "../Validations/UserValidations/updateUserValidation.js";
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
        return await this.userRepository.updateUser(body, id);
    }
    async deleteUser(id) {
        await idValidation.parseAsync(id);
        return await this.userRepository.deleteUser(id);
    }
}
export default UserManager;
