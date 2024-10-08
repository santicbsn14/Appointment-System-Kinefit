import userSchema from '../Models/userSchema.js';
class UserMongooseRepository {
    async getAll(criteria) {
        try {
            let { limit = 30, page = 1, ...filters } = criteria;
            const userDocuments = await userSchema.paginate(filters, { limit, page,
                populate: 'role' });
            if (!userDocuments.page)
                userDocuments.page = 1;
            const mappedDocs = userDocuments.docs.map(user => ({
                firstname: user.firstname,
                lastname: user.lastname,
                username: user.username,
                email: user.email,
                age: user.age,
                dni: user.dni,
                homeAdress: user.homeAdress,
                phone: user.phone,
                role: user.role,
                status: user.status,
                id: user._id
            }));
            return {
                docs: mappedDocs,
                totalDocs: userDocuments.totalDocs,
                limit: userDocuments.limit,
                totalPages: userDocuments.totalPages,
                pagingCounter: userDocuments.pagingCounter,
                hasPrevPage: userDocuments.hasPrevPage,
                hasNextPage: userDocuments.hasNextPage,
                page: userDocuments.page,
                prevPage: userDocuments.prevPage,
                nextPage: userDocuments.nextPage,
            };
        }
        catch (error) {
            throw new Error(error instanceof Error ? error.message : 'An unknown error occurred');
        }
    }
    async getUserById(id) {
        const user = await userSchema.findById(id).populate('role');
        if (user !== null) {
            return {
                firstname: user.firstname,
                lastname: user.lastname,
                username: user.username,
                email: user.email,
                age: user.age,
                dni: user.dni,
                homeAdress: user.homeAdress,
                phone: user.phone,
                role: user.role,
                status: user.status,
                id: user._id,
            };
        }
        throw new Error('User not Found');
    }
    async getUserByEmail(userEmail) {
        const user = await userSchema.findOne({ email: userEmail }).populate('role');
        if (!user)
            throw new Error('User not Found');
        return {
            firstname: user.firstname,
            lastname: user.lastname,
            username: user.username,
            email: user.email,
            age: user.age,
            dni: user.dni,
            homeAdress: user.homeAdress,
            phone: user.phone,
            role: user.role,
            status: user.status,
            password: user.password,
            id: user._id
        };
    }
    async createUser(body) {
        const user = await userSchema.create(body);
        if (!user)
            throw new Error('A problem occurred when the user was created');
        return {
            firstname: user.firstname,
            lastname: user.lastname,
            username: user.username,
            email: user.email,
            age: user.age,
            dni: user.dni,
            homeAdress: user.homeAdress,
            phone: user.phone,
            role: user.role,
            status: user.status,
            id: user._id
        };
    }
    async updateUser(userId, body) {
        const user = await userSchema.findByIdAndUpdate(userId, body, { new: true, runValidators: true });
        if (!user)
            throw new Error('A problem occurred when the user was updated');
        return {
            firstname: user.firstname,
            lastname: user.lastname,
            username: user.username,
            email: user.email,
            age: user.age,
            dni: user.dni,
            homeAdress: user.homeAdress,
            phone: user.phone,
            role: user.role,
            status: user.status,
            id: user._id,
        };
    }
    async deleteUser(userId) {
        const userDelete = await userSchema.findByIdAndDelete(userId);
        if (!userDelete)
            throw new Error('A problem occurred when the user was deleted');
        return `User with ID ${userId} has been successfully deleted.`;
    }
}
export default UserMongooseRepository;
