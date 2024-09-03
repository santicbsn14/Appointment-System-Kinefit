import { Criteria, IdMongo } from "typesMongoose";
import container from "../../container.js";
import { Role } from "Source/Data/Models/roleSchema.js";
class RoleManager
{
    private roleRepository
  constructor()
  {
     this.roleRepository = container.resolve('RoleMoongoseRepository')
  }

  async paginate(criteria: Criteria)
  {
    return this.roleRepository.paginate(criteria);
  }

  async getOne(id:string)
  {
    return this.roleRepository.getOne(id);
  }

  async create(data: Role)
  {
    return await this.roleRepository.create(data);
  }

  async updateOne(id: string, data: Role)
  {
    return this.roleRepository.updateOne(id, data);
  }

  async deleteOne(id: string)
  {
    return this.roleRepository.deleteOne(id);
  }
}

export default RoleManager;