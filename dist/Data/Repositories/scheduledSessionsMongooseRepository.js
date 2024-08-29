import scheduledSessionsSchema from '../Models/scheduledSessionsSchema.js';
class ScheduledSessionsRepository {
    async getAll(criteria) {
        let { limit = 30, page = 1 } = criteria;
        //@ts-ignore se vera luego...
        const scheduledSessionsDocuments = await scheduledSessionsSchema.paginate({}, { limit, page });
        if (!scheduledSessionsDocuments)
            throw new Error('ScheduledSessionss could not be accessed');
        if (!scheduledSessionsDocuments.page)
            scheduledSessionsDocuments.page = 1;
        const mappedScheduledSessionss = scheduledSessionsDocuments.docs.map((scheduledSessions) => {
            return {
                _id: scheduledSessions._id,
                professional_id: scheduledSessions.professional_id,
                pacient_id: scheduledSessions.pacient_id,
                session_dates: scheduledSessions.session_dates,
                start_date: scheduledSessions.start_date,
                number_sessions: scheduledSessions.number_sessions,
                state: scheduledSessions.state,
                frequency: scheduledSessions.frequency
            };
        });
        return {
            docs: mappedScheduledSessionss,
            totalDocs: scheduledSessionsDocuments.totalDocs,
            limit: scheduledSessionsDocuments.limit,
            totalPages: scheduledSessionsDocuments.totalPages,
            pagingCounter: scheduledSessionsDocuments.pagingCounter,
            hasPrevPage: scheduledSessionsDocuments.hasPrevPage,
            hasNextPage: scheduledSessionsDocuments.hasNextPage,
            page: scheduledSessionsDocuments.page,
            prevPage: scheduledSessionsDocuments.prevPage,
            nextPage: scheduledSessionsDocuments.nextPage,
        };
    }
    async createScheduledSessions(body) {
        const newScheduledSessions = await scheduledSessionsSchema.create(body);
        if (!newScheduledSessions)
            throw new Error('A problem occurred when the ScheduledSessions was created');
        return {
            _id: newScheduledSessions._id,
            professional_id: newScheduledSessions.professional_id,
            pacient_id: newScheduledSessions.pacient_id,
            session_dates: newScheduledSessions.session_dates,
            start_date: newScheduledSessions.start_date,
            number_sessions: newScheduledSessions.number_sessions,
            state: newScheduledSessions.state,
            frequency: newScheduledSessions.frequency
        };
    }
    async getScheduledSessionsById(id) {
        const scheduledSessions = await scheduledSessionsSchema.findById(id);
        if (!scheduledSessions)
            throw new Error('ScheduledSessions could not found');
        return {
            _id: scheduledSessions._id,
            professional_id: scheduledSessions.professional_id,
            pacient_id: scheduledSessions.pacient_id,
            session_dates: scheduledSessions.session_dates,
            start_date: scheduledSessions.start_date,
            number_sessions: scheduledSessions.number_sessions,
            state: scheduledSessions.state,
            frequency: scheduledSessions.frequency
        };
    }
    async updateScheduledSessions(id, body) {
        const updatedScheduledSessions = await scheduledSessionsSchema.findByIdAndUpdate(id, body, { new: true, runValidators: true });
        if (!updatedScheduledSessions)
            throw new Error('A problem occurred when the ScheduledSessions was updated');
        return {
            _id: updatedScheduledSessions._id,
            professional_id: updatedScheduledSessions.professional_id,
            pacient_id: updatedScheduledSessions.pacient_id,
            session_dates: updatedScheduledSessions.session_dates,
            start_date: updatedScheduledSessions.start_date,
            number_sessions: updatedScheduledSessions.number_sessions,
            state: updatedScheduledSessions.state,
            frequency: updatedScheduledSessions.frequency
        };
    }
    async deleteScheduledSessions(id) {
        const scheduledSessionsDeleted = await scheduledSessionsSchema.findByIdAndDelete(id);
        if (!scheduledSessionsDeleted)
            throw new Error('A problem occurred when the ScheduledSessions was deleted');
        return `ScheduledSessions with ID ${id} has been successfully deleted.`;
    }
}
export default ScheduledSessionsRepository;
