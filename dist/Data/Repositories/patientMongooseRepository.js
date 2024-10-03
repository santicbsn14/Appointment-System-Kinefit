import patientSchema from '../Models/patientSchema.js';
class PatientRepository {
    async getAll(criteria) {
        let { limit = 30, page = 1, ...filters } = criteria;
        //@ts-ignore se vera luego...
        const patientDocuments = await patientSchema.paginate(filters, { limit, page,
            populate: 'user_id'
        });
        if (!patientDocuments)
            throw new Error('Patients could not be accessed');
        if (!patientDocuments.page)
            patientDocuments.page = 1;
        const mappedPatients = patientDocuments.docs.map((patient) => {
            return {
                _id: patient._id,
                user_id: patient.user_id,
                mutual: patient.mutual ? patient.mutual : null,
                clinical_data: patient.clinical_data
            };
        });
        return {
            docs: mappedPatients,
            totalDocs: patientDocuments.totalDocs,
            limit: patientDocuments.limit,
            totalPages: patientDocuments.totalPages,
            pagingCounter: patientDocuments.pagingCounter,
            hasPrevPage: patientDocuments.hasPrevPage,
            hasNextPage: patientDocuments.hasNextPage,
            page: patientDocuments.page,
            prevPage: patientDocuments.prevPage,
            nextPage: patientDocuments.nextPage,
        };
    }
    async createPatient(body) {
        const newPatient = await patientSchema.create(body);
        if (!newPatient)
            throw new Error('A problem occurred when the patient was created');
        return {
            _id: newPatient._id,
            user_id: newPatient.user_id,
            mutual: newPatient.mutual ? newPatient.mutual : undefined,
            clinical_data: newPatient.clinical_data
        };
    }
    async getPatientById(id) {
        const patient = await patientSchema.findById(id).populate('user_id');
        if (!patient)
            throw new Error('Patient could not found');
        return {
            _id: patient._id,
            user_id: patient.user_id,
            mutual: patient.mutual ? patient.mutual : undefined,
            clinical_data: patient.clinical_data
        };
    }
    async updatePatient(id, body) {
        const updatedPatient = await patientSchema.findByIdAndUpdate(id, body, { new: true, runValidators: true });
        if (!updatedPatient)
            throw new Error('A problem occurred when the patient was updated');
        return {
            _id: updatedPatient._id,
            user_id: updatedPatient.user_id,
            mutual: updatedPatient.mutual ? updatedPatient.mutual : undefined,
            clinical_data: updatedPatient.clinical_data
        };
    }
    async deletePatient(id) {
        const patientDeleted = await patientSchema.findByIdAndDelete(id);
        if (!patientDeleted)
            throw new Error('A problem occurred when the patient was deleted');
        return `Patient with ID ${id} has been successfully deleted.`;
    }
}
export default PatientRepository;
