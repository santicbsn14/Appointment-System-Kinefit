import mongoose from 'mongoose';
import professionalSchema from '../Models/professionalSchema.js';
class ProfessionalRepository {
    async getAll(criteria) {
        let { limit = 30, page = 1 } = criteria;
        //@ts-ignore se vera luego...
        const professionalDocuments = await professionalSchema.paginate({}, { limit, page });
        if (!professionalDocuments)
            throw new Error('Professionals could not be accessed');
        if (!professionalDocuments.page)
            professionalDocuments.page = 1;
        const mappedProfessionals = professionalDocuments.docs.map((professional) => {
            return {
                user_id: professional.user_id,
                _id: professional._id
            };
        });
        return {
            docs: mappedProfessionals,
            totalDocs: professionalDocuments.totalDocs,
            limit: professionalDocuments.limit,
            totalPages: professionalDocuments.totalPages,
            pagingCounter: professionalDocuments.pagingCounter,
            hasPrevPage: professionalDocuments.hasPrevPage,
            hasNextPage: professionalDocuments.hasNextPage,
            page: professionalDocuments.page,
            prevPage: professionalDocuments.prevPage,
            nextPage: professionalDocuments.nextPage,
        };
    }
    async createProfessional(id) {
        let pid = new mongoose.Types.ObjectId(id);
        let body = { user_id: pid };
        const newProfessional = await professionalSchema.create(body);
        if (!newProfessional)
            throw new Error('A problem occurred when the Professional was created');
        return {
            _id: newProfessional._id,
            user_id: newProfessional.user_id,
        };
    }
    async getProfessionalById(id) {
        const professional = await professionalSchema.findById(id);
        if (!professional)
            throw new Error('Professional could not found');
        return {
            _id: professional._id,
            user_id: professional.user_id,
        };
    }
    async updateProfessional(id, body) {
        const updatedProfessional = await professionalSchema.findByIdAndUpdate(id, body);
        if (!updatedProfessional)
            throw new Error('A problem occurred when the Professional was updated');
        return {
            _id: updatedProfessional._id,
            user_id: updatedProfessional.user_id
        };
    }
    async deleteProfessional(id) {
        const ProfessionalDeleted = await professionalSchema.findByIdAndDelete(id);
        if (!ProfessionalDeleted)
            throw new Error('A problem occurred when the Professional was deleted');
        return `Professional with ID ${id} has been successfully deleted.`;
    }
}
export default ProfessionalRepository;
