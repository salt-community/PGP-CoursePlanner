namespace Backend.ExceptionHandler.Exceptions
{
    public class BadRequestInvalidGrantException : BadRequestException<int>
    {
        public BadRequestInvalidGrantException()
        { }
        public BadRequestInvalidGrantException(string message) : base(message)
        { }
        public BadRequestInvalidGrantException(string message, Exception inner) : base(message, inner)
        { }
        public BadRequestInvalidGrantException(string resourceName, int resourceId) : base(resourceName, resourceId)
        { }
        public BadRequestInvalidGrantException(string resourceName, int resourceId, Exception inner) : base(resourceName, resourceId, inner)
        { }
    }
}