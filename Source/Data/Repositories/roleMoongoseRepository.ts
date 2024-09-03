import { Criteria, IdMongo, Paginated } from 'typesMongoose';
import roleSchema from '../Models/roleSchema';
import { Role } from '../Models/roleSchema';
import { PaginateResult } from 'mongoose';

interface RoleMoongoseRepository{
    getAll: (criteria :Criteria)=> Promise<Paginated<Role>| null>,
    createRole: (role: Role)=> Promise<Role | null>,
    getRoleById: (roleId: IdMongo) => Promise<Role | null>,
    updateRole: (roleId:IdMongo, body: Partial<Role>) => Promise<Role | null>,
    deleteRole: (roleId: IdMongo) => Promise<string>,
}

class RoleMongooseRepository implements RoleMongooseRepository
{
  async paginate(criteria: Criteria)
  {
    let { limit, page } = criteria;
    if(!limit) limit=4
    //@ts-ignore
    const roleDocuments: PaginateResult<Role> = await roleSchema.paginate({}, { limit, page });
    if(!roleDocuments.page)roleDocuments.page = 1    
    roleDocuments.docs = roleDocuments.docs.map(document => ({
      id: document._id,
      name: document.name,
      permissions: document.permissions
    }));

    return roleDocuments;
  }

  async getOne(id: IdMongo)
  {
    const roleDocument = await roleSchema.findOne({ _id: id });

    if(!roleDocument)
    {
      throw new Error('Role dont exist.');
    }

    return {
        id: roleDocument?._id,
        name: roleDocument?.name,
        permissions: roleDocument?.permissions
    }
  }

  async create(data: Role)
  {
    const roleDocument = await roleSchema.create(data);

    return {
        id: roleDocument._id,
        name: roleDocument.name,
        permissions: roleDocument.permissions
    }
  }

  async updateOne(id: IdMongo, data: Partial<Role>)
  {
    const roleDocument = await roleSchema.findOneAndUpdate({ _id: id }, data, { new: true});

    if(!roleDocument)
    {
      throw new Error('Role dont exist.');
    }

    return {
        id: roleDocument._id,
        name: roleDocument.name,
        permissions: roleDocument.permissions
    }
  }

  async deleteOne(id: IdMongo)
  {
    return roleSchema.deleteOne({ _id: id });
  }
}

export default RoleMongooseRepository;