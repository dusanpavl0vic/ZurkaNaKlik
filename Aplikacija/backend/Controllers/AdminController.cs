using System.Security.Claims;
using backend.Services;

namespace backend.Controllers

{
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class AdminController : Controller
    {
        public ZurkaNaKlikDbContext Context { get; set; }
        private readonly IUserService _userService;
        private readonly IConfiguration _configuration;

        public AdminController(ZurkaNaKlikDbContext context, IConfiguration configuration, IUserService userService)
        {
            Context = context;
            _configuration = configuration;
            _userService = userService;
        }

        [HttpGet("Svi korisnici")]
        public async Task<ActionResult> SviKorisnici(){

            try{
                 
                var listaKorisnika = await Context.Korisnici.ToListAsync<Korisnik>();

                
                
                return Ok(new {listaKorisnika});
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet("Sve agencije")]
        public async Task<ActionResult> SveAgencije(){

            try{
                 
                var listaAgencija = await Context.Agencije.ToListAsync<Agencija>();
                return Ok(new { listaAgencija });
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        // [HttpDelete("Obrisi korisnika/{idkorisnika}")]
        // public async Task<ActionResult> ObrisiKorisnika(int idkorisnika){

        // }
    }

// Obrisi korisnika ili agenciju
// Izmeni korisnika
// Izmeni agenciju
}