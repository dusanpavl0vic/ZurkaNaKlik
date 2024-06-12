using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using backend.DTOs;
using backend.Utilities;
using Microsoft.AspNetCore.Http;
using System.Security.Cryptography;
using backend.Services;
using Sprache;

namespace backend.Controllers

{

    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        public ZurkaNaKlikDbContext Context { get; set; }
        private readonly IUserService _userService;
        private readonly IConfiguration _configuration;
        public AuthController(ZurkaNaKlikDbContext context, IConfiguration configuration, IUserService userService)
        {
            Context = context;
            _configuration = configuration;
            _userService = userService;
        }

        [HttpPost("RegistrationKorisnik")]
        public async Task<ActionResult> RegistrationKorisnik([FromBody] RegistrationKorisnik request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var postojiEmail = await Context.Korisnici.AnyAsync(k => k.Email == request.email);
                if (postojiEmail)
                {
                    return BadRequest("Korisnik sa ovim email-om već postoji.");
                }

                if (request.password != request.repeatPassword)
                {
                    return BadRequest("Lozinke se ne poklapaju");
                }

                string lozinkaHash = BCrypt.Net.BCrypt.HashPassword(request.password);
                Roles rolic = request.role;
                Korisnik korisnik = ObjectCreatorSingleton.Instance.FromRegistrationKorisnik(request, lozinkaHash);


                await Context.Korisnici.AddAsync(korisnik);
                await Context.SaveChangesAsync();

                // var kor = Context.Korisnici.FirstOrDefaultAsync(f => f.Email == request.email);
                // string accessToken = prijava(korisnik);

                // await Context.SaveChangesAsync();


                LoginResult loginResult = ObjectCreatorSingleton.Instance.ToLoginResult(korisnik);

                return Ok(new { loginResult });
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPost("RegistrationAgencija")]
        public async Task<ActionResult> RegistrationAgencija([FromBody] RegistrationAgencija request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var postojiEmail = await Context.Agencije.AnyAsync(k => k.Email == request.email);
                if (postojiEmail)
                {
                    return BadRequest("Korisnik sa ovim email-om već postoji.");
                }

                string lozinkaHash = BCrypt.Net.BCrypt.HashPassword(request.password);
                var agencija = ObjectCreatorSingleton.Instance.FromRegistrationAgencija(request, lozinkaHash);

                LoginResult loginResult = ObjectCreatorSingleton.Instance.ToLoginResult(agencija);

                await Context.Agencije.AddAsync(agencija);
                await Context.SaveChangesAsync();

                // var kor = Context.Agencije.FirstOrDefaultAsync(f => f.Email == request.email);
                
                
                // string accessToken = prijava(agencija);

                // await Context.SaveChangesAsync();

                
                return Ok(new { loginResult });
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPost("login")]
        public async Task<ActionResult> Login([FromBody] Login request)
        {
            try
            {
                KorisnikAgencija? korisnikagencija = await Context.KorisniciAgencije.FirstOrDefaultAsync(p => p.Email == request.email);
                if (korisnikagencija == null)
                {
                    return BadRequest("Korisnik ne postoji, ili ste uneli pogresan email");
                }

                LoginResult loginResult = ObjectCreatorSingleton.Instance.ToLoginResult(korisnikagencija);

                if (!BCrypt.Net.BCrypt.Verify(request.password, korisnikagencija.LozinkaHash))
                {
                    return BadRequest("Pogresna sifra");
                }

                // TODO izbrisi ovo ako se ne koristi
                // LoginObject login = new LoginObject
                // {
                //     Id = loginObject!.Id,
                //     Role = loginObject.Role
                // };

                string accessToken = prijava(korisnikagencija);
                
                await Context.SaveChangesAsync();

                return Ok(new { accessToken, loginResult });
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        private string prijava(KorisnikAgencija korisnikagencija)
        {
            string accessToken = CreateToken(korisnikagencija!);

            var refreshToken = GenerateRefreshToken(korisnikagencija.Id);
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Expires = refreshToken.Expires,
            };

            Response.Cookies.Append("refreshToken", refreshToken.Token, cookieOptions); //postavlja cookie
            Response.Cookies.Append("refreshTokenid", refreshToken.id.ToString(), cookieOptions); //postavlja cookie

            korisnikagencija!.RefreshToken = refreshToken.id.ToString();
            korisnikagencija!.RefreshToken = refreshToken.Token;
            korisnikagencija!.TokenCreated = refreshToken.Created;
            korisnikagencija!.TokenExpires = refreshToken.Expires;

            

            return accessToken;
        }

        //usera vec imas u cookie samo g auzmi odatle

        [HttpGet("RefreshToken")]
        public async Task<ActionResult> RefreshToken()
        {
            try
            {
                string? refreshTokenValue = Request.Cookies["refreshToken"];
                string? userId = Request.Cookies["refreshTokenid"];

                if (refreshTokenValue == null)
                {
                    return BadRequest("Nema refresh tokena");
                }

                //int userId = int.Parse(_userService.GetMyId());
                if (userId == null)
                {
                    return BadRequest("izvini miks ako je ovde greska kazi");
                }

                KorisnikAgencija? user = await Context.KorisniciAgencije.FirstOrDefaultAsync(k => k.Id == int.Parse(userId!));

                if (user == null)
                {
                    return Unauthorized("Ne postoji korisnik sa tim tokenom u bazi");
                }

                if (!user.RefreshToken.Equals(refreshTokenValue))
                {
                    return Unauthorized("Invalid Refresh Token");
                }
                else if (user.TokenExpires < DateTime.Now)
                {
                    return Unauthorized("Token expired.");
                }

                string accessToken = CreateToken(user);
                var newRefreshToken = GenerateRefreshToken(int.Parse(userId));

                var cookieOptions = new CookieOptions
                {
                    HttpOnly = true,
                    Expires = newRefreshToken.Expires,
                };

                Response.Cookies.Append("refreshToken", newRefreshToken.Token, cookieOptions); //postavlja cookie

                user.RefreshToken = newRefreshToken.Token;
                user.TokenCreated = newRefreshToken.Created;
                user.TokenExpires = newRefreshToken.Expires;

                LoginResult loginResult = ObjectCreatorSingleton.Instance.ToLoginResult(user);

                await Context.SaveChangesAsync();

                return Ok(new { accessToken, loginResult });
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        private RefreshToken GenerateRefreshToken(int id)
        {

            var refreshToken = new RefreshToken
            {
                id = id,
                Token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64)),
                Expires = DateTime.Now.AddDays(2)
            };

            return refreshToken;
        }

        private string CreateToken(KorisnikAgencija loginObject)
        {

            List<Claim> claims = new List<Claim>{
                new Claim(ClaimTypes.Sid, loginObject.Id.ToString()),
                new Claim(ClaimTypes.Role, loginObject.Role.ToString())
            };


            DotNetEnv.Env.Load();
            string envTokenKey = Environment.GetEnvironmentVariable("TOKEN")!;
            // Izvlaci podatke iz appsettings.json
            //var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration.GetSection("AppSettings:Token").Value!));

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(envTokenKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var token = new JwtSecurityToken(
                    claims: claims,
                    expires: DateTime.Now.AddDays(1),
                    signingCredentials: creds
                );

            var jwt = new JwtSecurityTokenHandler().WriteToken(token);

            return jwt;
        }


        #region Logout
        [HttpGet("Logout")]
        public async Task<IActionResult> Logout()
        {
            try
            {

                int idKorisnika = int.Parse((HttpContext.Items["idKorisnika"] as string)!);


                Korisnik? k = await Context.Korisnici.FindAsync(idKorisnika);

                if (k == null)
                {
                    return BadRequest("nema korisnika");
                }

                k.RefreshToken = String.Empty;


                await Context.SaveChangesAsync();

                return Ok("Obrisan je korisnik");


            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        #endregion
    }
}

// logout ruta

