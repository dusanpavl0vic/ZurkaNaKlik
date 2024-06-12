using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.DTOs;
using backend.Utilities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Hosting;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PregledController : ControllerBase
    {
        private readonly IWebHostEnvironment _hostEnvironment;
        public ZurkaNaKlikDbContext Context { get; set; }
        private readonly IConfiguration _configuration;

        public PregledController(ZurkaNaKlikDbContext context, IConfiguration configuration, IWebHostEnvironment hostEnvironment)
        {
            Context = context;
            _configuration = configuration;
            _hostEnvironment = hostEnvironment;
        }

        #region GetKorisnik
        [HttpGet("GetKorisnik/{idK}")]
        public async Task<IActionResult> GetKorisnik(int idK)
        {
            try
            {
                Korisnik korisnik = await Context.Korisnici.Where(x => x.Id == idK).FirstAsync();

                if (korisnik == null)
                {
                    return BadRequest("Nema korisnika za prikaz");
                }

                GetKorisnikResult result = ObjectCreatorSingleton.Instance.ToKorisnikResult(korisnik);
                return Ok(result);

            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        #endregion

        #region PrikaziOglaseKorisnika
        [HttpGet("PrikaziOglaseKorisnika/{idkorisnika}")]
        public async Task<ActionResult> PrikaziOglaseKorisnika(int idkorisnika)
        {
            try
            {


                Korisnik? korisnik = await Context.Korisnici.Include(o => o.ListaObjavljenihOglasaObjekta).FirstOrDefaultAsync(k => k.Id == idkorisnika);

                if (korisnik == null)
                {
                    return BadRequest("Korisnik nema objavljene oglase");
                }


                await Context.SaveChangesAsync();

                List<OglasObjektaResponse> response = new List<OglasObjektaResponse>();

                if (korisnik.ListaObjavljenihOglasaObjekta == null)
                {
                    return Ok(response);
                }

                foreach (OglasObjekta oglas in korisnik.ListaObjavljenihOglasaObjekta)
                {
                    response.Add(ObjectCreatorSingleton.Instance.ToOglasResult(oglas));
                }

                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }


        }

        #endregion

        #region VratiKategorije
        [HttpGet("VratiKategorije/{idagencije}")]
        public async Task<ActionResult> VratiKategorije(int idagencije)
        {
            try
            {


                Agencija? agencija = await Context.Agencije.FindAsync(idagencije);
                if (agencija == null)
                {
                    return BadRequest("Ne postoji agencija sa tim id-jem");
                }

                List<Kategorija>? kategorija = await Context.Kategorije.Where(k => k.Agencija!.Id == idagencije).ToListAsync();

                return Ok(kategorija);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }


        }
        #endregion

        #region VratiSveKategorijeNekeAgencije(idAgencije) *SA LISTOM MENIJA*


        [HttpGet("VratiSveKategorijeNekeAgencije/{idAgencije}")]
        public async Task<IActionResult> VratiSveKategorijeNekeAgencije(int idAgencije)
        {
            try
            {
                var kategorije = await Context.Kategorije.Include(x => x.ListaMenija).Where(x => x.Agencija!.Id == idAgencije).ToListAsync();


                if (kategorije == null)
                {
                    return BadRequest("Nema takvih kategorija i agencija zajedno");
                }
                else
                {
                    return Ok(new { kategorije });
                }

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }


        }
        #endregion

        #region PrikaziAgenciju
        [HttpGet("PrikaziAgenciju/{idAgencije}")]
        public async Task<ActionResult> PrikaziAgenciju(int idAgencije)
        {
            try
            {
                Agencija? agencija = await Context.Agencije.Include(x => x.KategorijeMenija).Where(x => x.Id == idAgencije).FirstOrDefaultAsync();

                if (agencija == null)
                {
                    return Ok("Ne postoji trazena agencija");
                }

                return Ok(agencija);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        #endregion

        // TODO Dupla, ne koristi se, izbrisi je
        // #region VratiMenijeSaKategorijama
        // [HttpGet("VratiMenijeSaKategorijama/{idagencije}")]
        // public async Task<ActionResult> VratiMenije(int idagencije)
        // {
        //     try
        //     {

        //         List<Kategorija>? kategorije = await Context.Kategorije.Where(k => k.Agencija!.Id == idagencije).ToListAsync();

        //         List<VratiMenijeResultElement>? meniKeteringa = new();

        //         if (kategorije == null)
        //         {
        //             return Ok(meniKeteringa);
        //         }

        //         foreach (Kategorija kat in kategorije)
        //         {
        //             VratiMenijeResultElement element = new(kat.Id, kat.Naziv);
        //             List<MeniKeteringa>? meniji = await Context.MenijiKeteringa.Where(m => m.Kategorija!.Id == kat.Id).ToListAsync();
        //             element.meniKeteringa = meniji;

        //             meniKeteringa.Add(element);
        //         }

        //         return Ok(meniKeteringa);
        //     }
        //     catch (Exception e)
        //     {
        //         return BadRequest(e.Message);
        //     }
        // }
        // #endregion

        #region  PrikaziSveMenijeKategorije
        [HttpGet("PrikaziSveMenijeKategorije/{idKategorije}")]
        public async Task<IActionResult> PrikaziSveMenije(int idKategorije)
        {
            try
            {

                var meniji = await Context.MenijiKeteringa.Where(k => k.Kategorija!.Id == idKategorije).ToListAsync();

                if (meniji == null)
                {
                    return BadRequest("Nema takvih kategorija i agencija zajedno");
                }
                else
                {
                    return Ok(meniji);
                }

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        #endregion

        #region VratiSveKategorijeIMenijeAgencije
        [HttpGet("VratiSveKategorijeIMenijeAgencije/{idagencije}")]
        public async Task<ActionResult> VratiSveKategorijeIMenijeAgencije(int idagencije)
        {
            try
            {
                var sveinfoagencije = await Context.Kategorije
                                                .Include(x => x.Agencija)
                                                .Include(x => x.ListaMenija)
                                                .Where(x => x.Agencija!.Id == idagencije)
                                                .ToListAsync();

                if (sveinfoagencije == null || !sveinfoagencije.Any())
                {
                    return BadRequest("Nema agencije sa tim id-jem");
                }

                // var result = sveinfoagencije.Select(k => new {
                //     k.Id,
                //     k.Naziv,
                //     ListaMenija = k.ListaMenija!.Select(m => new {
                //         m.Id,
                //         m.Naziv,
                //         m.SastavMenija,
                //         m.CenaMenija,
                //         m.Slika,
                //         m.Opis
                //     })
                // });

                List<VratiMenijeResultElement>? meniKeteringa = new();

                if (sveinfoagencije == null)
                {
                    return Ok(meniKeteringa);
                }

                foreach (Kategorija kat in sveinfoagencije)
                {
                    VratiMenijeResultElement element = new(kat.Id, kat.Naziv);
                    List<MeniKeteringa>? meniji = await Context.MenijiKeteringa.Where(m => m.Kategorija!.Id == kat.Id).ToListAsync();

                    List<MeniKeteringaResult> menijiResult = new();
                    foreach (MeniKeteringa meni in meniji)
                    {
                        menijiResult.Add(ObjectCreatorSingleton.Instance.ToMeniKeteringaResult(meni));
                    }

                    element.meniKeteringa = menijiResult;
                    meniKeteringa.Add(element);
                }

                return Ok(meniKeteringa);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }


        #endregion

        #region VratiNaziveKategorija
        [HttpGet("VratiNaziveKategorija")]
        public async Task<IActionResult> VratiNaziveKategorija()
        {
            try
            {
                List<string>? kategorije = await Context.Kategorije.Select(x => x.Naziv).Distinct().ToListAsync();

                if (kategorije == null)
                {
                    return BadRequest("Nema kategorija");
                }

                return Ok(kategorije);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        #endregion

        #region VratiAgencijeSaFilterimaISortiranjem
        [HttpPost("VratiAgencije/{pageNumber}/{pageSize}/{sort}")]
        public async Task<ActionResult> VratiAgencije([FromBody] FilteriAgencije filteri, int pageNumber, int pageSize, string? sort)
        {
            try
            {
                List<Agencija> agencije = await Context.Agencije.IgnoreQueryFilters().Include(i => i.KategorijeMenija).ToListAsync();

                switch (sort)
                {
                    case "CenaDostaveRastuca":
                        agencije = agencije.OrderBy(o => o.CenaDostave).ToList();
                        break;
                    case "CenaDostaveOpadajuce":
                        agencije = agencije.OrderByDescending(o => o.CenaDostave).ToList();
                        break;
                    case "OcenaRastuce":
                        agencije = agencije.OrderBy(o => ((double)(o.Ocena ?? 0))).ToList();
                        break;
                    case "OcenaOpadajuce":
                        agencije = agencije.OrderByDescending(o => ((double)(o.Ocena ?? 0))).ToList();
                        break;
                    default:
                        return BadRequest("Ne postoji sort");
                }

                if (filteri.listaKategorija != null && filteri.listaKategorija!.Count != 0)
                {
                    agencije = agencije.Where(agencija => agencija.KategorijeMenija!.Any(tip => filteri.listaKategorija!.Contains(tip.Naziv))).ToList();
                }

                if (filteri.grad != null)
                {
                    agencije = agencije.Where(Agencija => Agencija.Lokacija.Equals(filteri.grad)).ToList();
                }

                if (filteri.mogucnostDostave == true)
                {
                    agencije = agencije.Where(oglas => oglas.MogucnostDostave == true).ToList();

                    if (filteri.cenaDostaveOd != null && filteri.cenaDostaveOd >= 0 && (filteri.cenaDostaveDo == null || filteri.cenaDostaveOd < filteri.cenaDostaveDo))
                    {
                        agencije = agencije.Where(agencija => agencija.CenaDostave >= filteri.cenaDostaveOd).ToList();
                    }
                    if (filteri.cenaDostaveDo != null && filteri.cenaDostaveDo <= Int32.MaxValue && (filteri.cenaDostaveOd == null || filteri.cenaDostaveOd < filteri.cenaDostaveDo))
                    {
                        agencije = agencije.Where(agencija => agencija.CenaDostave <= filteri.cenaDostaveDo).ToList();
                    }
                }

                int brojAgencija = agencije.Count;

                agencije = agencije.Skip((pageNumber - 1) * pageSize)
                             .Take(pageSize).ToList();
                List<AgencijaBasic> response = new List<AgencijaBasic>();

                foreach (Agencija agencija in agencije)
                {
                    response.Add(ObjectCreatorSingleton.Instance.ToAgencijaBasic(agencija));
                }

                

                return Ok(new { brojAgencija, response });
            }
            catch (Exception e)
            {
                return BadRequest(e);
            }
        }
        #endregion

        #region VratiSliku
        [HttpGet("get-sliku/{putanja}")]
        public IActionResult VratiSliku(string putanja)
        {
            // if(putanja == null) return Ok("ESCAPESEQEUENCE");

            putanja = Uri.UnescapeDataString(putanja);

            var webRootPath = _hostEnvironment.WebRootPath;
            var absolutePath = Path.Combine(webRootPath, putanja);

            //return Ok(absolutePath);

            if (System.IO.File.Exists(absolutePath))
            {
                var fileBytes = System.IO.File.ReadAllBytes(absolutePath);
                var contentType = GetContentType(absolutePath);
                var fileName = Path.GetFileName(absolutePath);

                return File(fileBytes, contentType, fileName);
            }

            return NotFound("Slika nije pronađena.");
        }
        #endregion

        private string GetContentType(string path)
        {
            var ext = Path.GetExtension(path).ToLowerInvariant();
            return ext switch
            {
                ".jpg" => "image/jpeg",
                ".jpeg" => "image/jpeg",
                ".png" => "image/png",
                ".gif" => "image/gif",
                _ => "application/octet-stream",
            };
        }

        #region VartiMenijeLista
        [HttpPost("VratiMenijeLista")]
        public async Task<ActionResult> VratiMenijeLista([FromBody] List<int> menijiId)
        {
            try
            {
                if (menijiId == null || menijiId.Count == 0)
                {
                    return BadRequest("Lista ID-ova menija ne može biti prazna.");
                }

                // Dobavi menije iz baze na osnovu liste ID-ova
                List<MeniKeteringa>? sviMeniji = await Context.MenijiKeteringa
                    .Where(m => menijiId.Contains(m.Id))
                    .ToListAsync();

                List<MeniKeteringaResult> result = new List<MeniKeteringaResult>();

                foreach (MeniKeteringa meniKeteringa in sviMeniji)
                {
                    result.Add(ObjectCreatorSingleton.Instance.ToMeniKeteringaResult(meniKeteringa));
                }

                return Ok(result);

            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        #endregion
    }
}