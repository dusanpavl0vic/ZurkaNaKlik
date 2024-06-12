using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using backend.Services;

namespace backend.Middleware
{
    public class ValidateAgencijaIdMiddleware
    {
        private readonly RequestDelegate _next;
        //private readonly IUserService _userService;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public ValidateAgencijaIdMiddleware(RequestDelegate next, IHttpContextAccessor httpContextAccessor)
        {
            _next = next;
            //_userService = userService;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task Invoke(HttpContext context)
        {
            var idAgencije = string.Empty;

            if (_httpContextAccessor.HttpContext is not null)
            {
                var user = _httpContextAccessor.HttpContext.User;
                if (user.Identity is not null && user.Identity.IsAuthenticated)
                {
                    idAgencije = user.FindFirstValue(ClaimTypes.Sid) ?? string.Empty; // Pretpostavljam da je ClaimTypes.Sid za idAgencije
                }
            }

            if (!string.IsNullOrEmpty(idAgencije))
            {
                context.Items["idAgencije"] = idAgencije;
            }

            await _next(context);
        }
    }

}