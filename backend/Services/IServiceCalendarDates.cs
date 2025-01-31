namespace backend.Services;

public interface IServiceCalendarDates<T>
{
    Task<T> GetCalendarDate(DateTime date);
    Task<List<T>> GetCalendarDateBatch(DateTime start, DateTime end);
    Task<List<T>> GetCalendarDate2Weeks(int weekNumber);
}