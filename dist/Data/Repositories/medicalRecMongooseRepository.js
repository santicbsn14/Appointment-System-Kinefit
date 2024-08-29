import medicalRecordSchema from '../Models/medicalRecSchema.js';
class MedicalRecordRepository {
    async getAll(criteria) {
        let { limit = 30, page = 1 } = criteria;
        //@ts-ignore se vera luego...
        const medicalRecordDocuments = await medicalRecordSchema.paginate({}, { limit, page });
        if (!medicalRecordDocuments)
            throw new Error('MedicalRecords could not be accessed');
        if (!medicalRecordDocuments.page)
            medicalRecordDocuments.page = 1;
        const mappedMedicalRecords = medicalRecordDocuments.docs.map((medicalRecord) => {
            return {
                _id: medicalRecord._id,
                pacient_id: medicalRecord.pacient_id,
                last_update: medicalRecord.last_update,
                notes: medicalRecord.notes,
                attachments: medicalRecord.attachments
            };
        });
        return {
            docs: mappedMedicalRecords,
            totalDocs: medicalRecordDocuments.totalDocs,
            limit: medicalRecordDocuments.limit,
            totalPages: medicalRecordDocuments.totalPages,
            pagingCounter: medicalRecordDocuments.pagingCounter,
            hasPrevPage: medicalRecordDocuments.hasPrevPage,
            hasNextPage: medicalRecordDocuments.hasNextPage,
            page: medicalRecordDocuments.page,
            prevPage: medicalRecordDocuments.prevPage,
            nextPage: medicalRecordDocuments.nextPage,
        };
    }
    async createMedicalRecord(body) {
        const newMedicalRecord = await medicalRecordSchema.create(body);
        if (!newMedicalRecord)
            throw new Error('A problem occurred when the MedicalRecord was created');
        return {
            _id: newMedicalRecord._id,
            pacient_id: newMedicalRecord.pacient_id,
            last_update: newMedicalRecord.last_update,
            notes: newMedicalRecord.notes,
            attachments: newMedicalRecord.attachments
        };
    }
    async getMedicalRecordById(id) {
        const medicalRecord = await medicalRecordSchema.findById(id);
        if (!medicalRecord)
            throw new Error('MedicalRecord could not found');
        return {
            _id: medicalRecord._id,
            pacient_id: medicalRecord.pacient_id,
            last_update: medicalRecord.last_update,
            notes: medicalRecord.notes,
            attachments: medicalRecord.attachments
        };
    }
    async updateMedicalRecord(id, body) {
        const updatedMedicalRecord = await medicalRecordSchema.findByIdAndUpdate(id, body, { new: true, runValidators: true });
        if (!updatedMedicalRecord)
            throw new Error('A problem occurred when the MedicalRecord was updated');
        return {
            _id: updatedMedicalRecord._id,
            pacient_id: updatedMedicalRecord.pacient_id,
            last_update: updatedMedicalRecord.last_update,
            notes: updatedMedicalRecord.notes,
            attachments: updatedMedicalRecord.attachments
        };
    }
    async deleteMedicalRecord(id) {
        const medicalRecordDeleted = await medicalRecordSchema.findByIdAndDelete(id);
        if (!medicalRecordDeleted)
            throw new Error('A problem occurred when the MedicalRecord was deleted');
        return `MedicalRecord with ID ${id} has been successfully deleted.`;
    }
}
export default MedicalRecordRepository;
