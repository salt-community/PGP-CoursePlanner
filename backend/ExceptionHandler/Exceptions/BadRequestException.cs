namespace Backend.ExceptionHandler.Exceptions
{
    public class BadRequestException<T> : Exception
    {
        public string? ResourceName { get; }
        public T? ResourceId { get; }
        public BadRequestException()
        { }

        public BadRequestException(string message) : base(message)
        { }
        public BadRequestException(string message, Exception inner) : base(message, inner)
        { }
        public BadRequestException(string resourceName, T resourceId) : base($"Can not create {resourceName} with ID {resourceId}.")
        {
            ResourceName = resourceName;
            ResourceId = resourceId;
        }
        public BadRequestException(string resourceName, T resourceId, Exception inner) : base($"Can not create {resourceName} with ID {resourceId}", inner)
        {
            ResourceName = resourceName;
            ResourceId = resourceId;
        }


    }
}