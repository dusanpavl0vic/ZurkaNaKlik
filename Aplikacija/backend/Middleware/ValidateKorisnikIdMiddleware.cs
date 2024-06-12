using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using backend.Services;

namespace backend.Middleware
{
    public class ValidateKorisnikIdMiddleware
    {
        private readonly RequestDelegate _next;
        //private readonly IUserService _userService;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public ValidateKorisnikIdMiddleware(RequestDelegate next, IHttpContextAccessor httpContextAccessor)
        {
            _next = next;
            //_userService = userService;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task Invoke(HttpContext context)
        {
            var idKorisnika = string.Empty;
            

            if (_httpContextAccessor.HttpContext is not null)
            {
                var user = _httpContextAccessor.HttpContext.User;
                if (user.Identity is not null && user.Identity.IsAuthenticated)
                {
                    idKorisnika = user.FindFirstValue(ClaimTypes.Sid) ?? string.Empty; // Pretpostavljam da je ClaimTypes.Sid za idAgencije
                }
            }

            if (!string.IsNullOrEmpty(idKorisnika))
            {
                context.Items["idKorisnika"] = idKorisnika;
            }

            await _next(context);
        }
    }
}