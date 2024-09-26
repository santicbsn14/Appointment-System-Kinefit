import appointmentSchema from '../Models/appointmentSchema.js';
class AppointmentRepository {
    async getAll(criteria) {
        let { limit = 30, page = 1, ...filters } = criteria; // Extrae los filtros
        //@ts-ignore se vera luego...
        const appointmentDocuments = await appointmentSchema.paginate(filters, { limit, page });
        if (!appointmentDocuments)
            throw new Error('Appointments could not be accessed');
        if (!appointmentDocuments.page)
            appointmentDocuments.page = 1;
        const mappedAppointments = appointmentDocuments.docs.map((appointment) => {
            return {
                _id: appointment._id,
                pacient_id: appointment.pacient_id,
                professional_id: appointment.professional_id,
                date_time: appointment.date_time,
                schedule: appointment.schedule,
                state: appointment.state,
                session_type: appointment.session_type
            };
        });
        return {
            docs: mappedAppointments,
            totalDocs: appointmentDocuments.totalDocs,
            limit: appointmentDocuments.limit,
            totalPages: appointmentDocuments.totalPages,
            pagingCounter: appointmentDocuments.pagingCounter,
            hasPrevPage: appointmentDocuments.hasPrevPage,
            hasNextPage: appointmentDocuments.hasNextPage,
            page: appointmentDocuments.page,
            prevPage: appointmentDocuments.prevPage,
            nextPage: appointmentDocuments.nextPage,
        };
    }
    async createAppointment(body) {
        const newAppointment = await appointmentSchema.create(body);
        if (!newAppointment)
            throw new Error('A problem occurred when the Appointment was created');
        return {
            _id: newAppointment._id,
            pacient_id: newAppointment.pacient_id,
            professional_id: newAppointment.professional_id,
            date_time: newAppointment.date_time,
            schedule: newAppointment.schedule,
            state: newAppointment.state,
            session_type: newAppointment.session_type
        };
    }
    async getAppointmentById(id) {
        const appointment = await appointmentSchema.findById(id);
        if (!appointment)
            throw new Error('Appointment could not found');
        return {
            _id: appointment._id,
            pacient_id: appointment.pacient_id,
            professional_id: appointment.professional_id,
            date_time: appointment.date_time,
            schedule: appointment.schedule,
            state: appointment.state,
            session_type: appointment.session_type
        };
    }
    async updateAppointment(id, body) {
        const updatedAppointment = await appointmentSchema.findByIdAndUpdate(id, body, { new: true, runValidators: true });
        if (!updatedAppointment)
            throw new Error('A problem occurred when the Appointment was updated');
        return {
            _id: updatedAppointment._id,
            pacient_id: updatedAppointment.pacient_id,
            professional_id: updatedAppointment.professional_id,
            date_time: updatedAppointment.date_time,
            schedule: updatedAppointment.schedule,
            state: updatedAppointment.state,
            session_type: updatedAppointment.session_type
        };
    }
    async deleteAppointment(id) {
        const appointmentDeleted = await appointmentSchema.findByIdAndDelete(id);
        if (!appointmentDeleted)
            throw new Error('A problem occurred when the Appointment was deleted');
        return `Appointment with ID ${id} has been successfully deleted.`;
    }
}
export default AppointmentRepository;
