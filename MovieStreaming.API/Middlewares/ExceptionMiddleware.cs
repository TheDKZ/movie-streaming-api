namespace MovieStreaming.API.Middlewares
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;//benden sonraki  durak adresi
        private readonly ILogger<ExceptionMiddleware> _logger; // aynı zamanda arka planda loglama (kayıt altına alma)
        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }
        public async Task InvokeAsync(HttpContext httpContext) // asycn task Bu işlemin asenkron (eşzamansız) çalışacağını belirtir
        {
            try
            {
                await _next(httpContext);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Something went wrong: {ex}");
                await HandleExceptionAsync(httpContext, ex);
            }
        }
        private Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = StatusCodes.Status500InternalServerError;
            var response = new
            {
                StatusCode = context.Response.StatusCode,
                Message = "Internal Server Error from the custom middleware.",
                Detailed = exception.Message
            };
            return context.Response.WriteAsJsonAsync(response);
        }
    }
}