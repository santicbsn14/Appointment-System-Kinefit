import mongoose, { PaginateResult } from 'mongoose';
import userSchema, { IUser, IUserPublic } from '../Models/userSchema';
import { Paginated, Criteria, IdMongo } from '../../Utils/Types/typesMongoose';


interface userRepository{
    getAll: (criteria :Criteria)=> Promise<Paginated<IUserPublic>| null>,
    createUser: (user: IUser)=> Promise<IUserPublic | null>,
    getUserByEmail: (user: IUser['email'])=> Promise<IUserPublic | null>,
    getUserById: (userId: IdMongo) => Promise<IUserPublic | null>,
    updateUser: (userId:IdMongo, body: Partial<IUser>) => Promise<IUserPublic | null>,
    deleteUser: (userId: IdMongo) => Promise<string>,
}



class UserMongooseRepository implements userRepository {
  

  async getAll(criteria: Criteria): Promise<Paginated<IUserPublic>> {
    try {
      let { limit = 30, page = 1 } = criteria;
      
      const userDocuments: PaginateResult<IUser> = await userSchema.paginate({}, { limit, page });
      if(!userDocuments.page) userDocuments.page = 1
      const mappedDocs = userDocuments.docs.map(user => ({
        firstname:user.firstname ,
        lastname: user.lastname ,
        username:user.username,
        email:user.email,
        age: user.age,
        dni: user.dni ,
        homeAdress: user.homeAdress ,
        phone: user.phone ,
        role: user.role ,
        status: user.status ,
        id: user._id 
      }));
    
      return {
        docs: mappedDocs as IUserPublic[],
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
  async getUserById(id: IdMongo): Promise<IUserPublic | null>{
      const user = await userSchema.findById(id)
      if(user !== null){
      return {
        firstname:user.firstname ,
        lastname: user.lastname ,
        username:user.username,
        email:user.email,
        age: user.age,
        dni: user.dni ,
        homeAdress: user.homeAdress ,
        phone: user.phone ,
        role: user.role ,
        status: user.status ,
        id: user._id  ,
      }
    }
    throw new Error('User not Found');

  }
  async getUserByEmail(userEmail: IUser['email']): Promise<IUserPublic | null>{
    const user = await userSchema.findOne({email: userEmail})
    if(!user) throw new Error('User not Found');
    return{
      firstname:user.firstname ,
      lastname: user.lastname ,
      username:user.username,
      email:user.email,
      age: user.age,
      dni: user.dni ,
      homeAdress: user.homeAdress ,
      phone: user.phone ,
      role: user.role ,
      status: user.status ,
      id: user._id  ,
    }
  }
  async createUser(body: IUser): Promise<IUserPublic|null>{
    const user = await userSchema.create(body)
    if(!user) throw new Error('A problem occurred when the user was created')
    return {
      firstname:user.firstname ,
      lastname: user.lastname ,
      username:user.username,
      email:user.email,
      age: user.age,
      dni: user.dni ,
      homeAdress: user.homeAdress ,
      phone: user.phone ,
      role: user.role ,
      status: user.status ,
      id: user._id  ,
    }
  }
  async updateUser(userId: IdMongo, body: Partial<IUser>):Promise<IUserPublic | null>{
    const user = await userSchema.findByIdAndUpdate(userId, body)
    if(!user) throw new Error('A problem occurred when the user was updated')
    return {
        firstname:user.firstname ,
        lastname: user.lastname ,
        username:user.username,
        email:user.email,
        age: user.age,
        dni: user.dni ,
        homeAdress: user.homeAdress ,
        phone: user.phone ,
        role: user.role ,
        status: user.status ,
        id: user._id  ,
      }
  }
  async deleteUser(userId:IdMongo):Promise<string>{
    const userDelete = await userSchema.findByIdAndDelete(userId)
    if(!userDelete) throw new Error('A problem occurred when the user was deleted')
    return `User with ID ${userId} has been successfully deleted.`;
  }
}
export default UserMongooseRepository