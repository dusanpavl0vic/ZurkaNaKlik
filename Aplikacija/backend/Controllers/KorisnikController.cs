using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Threading.Tasks;
using backend.DTOs;
using backend.Services;
using backend.Utilities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Jpeg;
using SixLabors.ImageSharp.Processing;


namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Korisnik")]
    public class KorisnikController : Controller
    {
        private readonly IUserService _userService;
        public ZurkaNaKlikDbContext Context { get; set; }
        private readonly IConfiguration _configuration;

        public KorisnikController(ZurkaNaKlikDbContext context, IConfiguration configuration, IUserService userService)
        {
            Context = context;
            _configuration = configuration;
            _userService = userService;
        }

        #region DodajOmiljeniOglas
        [HttpPut("DodajOmiljeniOglas/{idOglasa}")]
        public async Task<ActionResult> DodajOmiljeniOglas(int idOglasa)
        {
            try
            {
                // var currId = _userService.GetMyId();
                // if(currId != idKorisnika.ToString()){
                //     return BadRequest("Nisi ti taj bebo");
                // }
                int idKorisnika = int.Parse((HttpContext.Items["idKorisnika"] as string)!);
                Korisnik? korisnik = await Context.Korisnici.Include(k => k.ListaOmiljenihOglasaObjekata).FirstOrDefaultAsync(k => k.Id == idKorisnika);

                if (korisnik == null)
                {
                    return BadRequest("Korisnik ne postoji");
                }

                OglasObjekta? oglas = await Context.OglasiObjekta.FirstOrDefaultAsync(o => o.Id == idOglasa);

                if (oglas == null)
                {
                    return BadRequest("Oglas ne postoji");
                }

                if (korisnik.ListaOmiljenihOglasaObjekata != null && korisnik.ListaOmiljenihOglasaObjekata.Any(o => o.Id == idOglasa))
                {
                    return BadRequest("Oglas već postoji u listi omiljenih oglasa korisnika");
                }

                korisnik.ListaOmiljenihOglasaObjekata?.Add(oglas);
                await Context.SaveChangesAsync();

                // List<OglasObjektaResponse> response = new();

                // if(korisnik.ListaOmiljenihOglasaObjekata == null) return Ok(response);

                // foreach (OglasObjekta omiljenOglas in korisnik.ListaOmiljenihOglasaObjekata)
                // {
                //     response.Add(ObjectCreatorSingleton.Instance.ToOglasResult(omiljenOglas));
                // }

                OglasObjektaResponse result = ObjectCreatorSingleton.Instance.ToOglasResult(oglas);
                return Ok(result);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        #endregion


        #region ObrisiOmiljeniOglas
        [HttpDelete("ObrisiOmiljeniOglas/{idOglasa}")]
        public async Task<ActionResult> ObrisiOmiljeniOglas(int idOglasa)
        {
            try
            {
                int idKorisnika = int.Parse((HttpContext.Items["idKorisnika"] as string)!);
                Korisnik? korisnik = await Context.Korisnici.IgnoreQueryFilters().Include(i => i.ListaOmiljenihOglasaObjekata).FirstOrDefaultAsync(f => f.Id == idKorisnika);


                if (korisnik == null)
                {
                    return BadRequest("Korisnik ne postoji");
                }


                OglasObjekta? oglas = await Context.OglasiObjekta.FirstOrDefaultAsync(f => f.Id == idOglasa);

                if (oglas == null)
                {
                    return BadRequest("Oglas ne postoji");
                }

                korisnik.ListaOmiljenihOglasaObjekata!.Remove(oglas);


                await Context.SaveChangesAsync();

                OglasObjektaResponse result = ObjectCreatorSingleton.Instance.ToOglasResult(oglas);
                return Ok(result);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }

        }





        #endregion



        //Da vrati sve zakupljene oglase jednog korisnika ako adminu to treba

        #region PrikaziSveZakupljeneOglase
        [HttpGet("PrikaziSveZakupljeneOglase")]
        public async Task<IActionResult> PrikaziSveZakupljeneOglase()
        {
            try
            {
                int idKorisnika = int.Parse((HttpContext.Items["idKorisnika"] as string)!);

                var listaZakupljenihOglasa = await Context.ZakupljeniOglasi
                    .Include(i => i.ZahtevZaKetering!)
                    .ThenInclude(i => i.Agencija)
                    .Include(i => i.Oglas)
                    .Include(i => i.Korisnik)
                    .Where(f => f.Korisnik!.Id == idKorisnika)
                    .ToListAsync();

                if (!listaZakupljenihOglasa.Any())
                {
                    return NoContent();
                }

                List<ZakupljeniOglasDTO> rezultat = new List<ZakupljeniOglasDTO>();

                listaZakupljenihOglasa.ForEach(o => {
                    var zakupljeniOglasDTO = new ZakupljeniOglasDTO
                    {
                        id = o.Id,
                        oglasId = o.Oglas?.Id,
                        korisnikId = o.Korisnik?.Id,
                        datumZakupa = o.DatumZakupa,
                        zakupljenOd = o.ZakupljenOd,
                        zakupljenDo = o.ZakupljenDo,
                        statusZahtevaZaKetering = o.ZahtevZaKetering?.StatusRezervacije,
                        cenaOglasa = o.Cena,
                        cenaKeteringa = o.ZahtevZaKetering?.KonacnaCena ?? 0,
                        idZakupljeniKetering = o.ZahtevZaKetering?.Id ?? 0,
                        idAgencije = o.ZahtevZaKetering?.Agencija?.Id ?? 0,
                    };

                    rezultat.Add(zakupljeniOglasDTO);
                });
                

                return Ok(rezultat);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        #endregion


        #region DodajOglas
        [HttpPost("DodajOglas")]
        public async Task<ActionResult> DodajOglas([FromBody] OglasObjektaBasic dodatOglas)
        {

            try
            {
                int idKorisnika = int.Parse((HttpContext.Items["idKorisnika"] as string)!);
                Korisnik? korisnik = await Context.Korisnici.FindAsync(idKorisnika);

                if (korisnik == null)
                {
                    return BadRequest("Korisnik ne postoji");
                }

                dodatOglas.ocena = 0;
                dodatOglas.brojOcena = 0;
                dodatOglas.zauzetiDani = [];
                OglasObjekta oglas = ObjectCreatorSingleton.Instance.ToOglas(dodatOglas);
                oglas.VlasnikOglasa = korisnik;

                // var oglas = new OglasObjekta
                // {
                //     ListaTipProslava = dodatOglas.ListaTipProslava,
                //     ListaTipProstora = dodatOglas.ListaTipProstora,
                //     Naziv = dodatOglas.Naziv,
                //     Grad = dodatOglas.Grad,
                //     Lokacija = dodatOglas.Lokacija,
                //     CenaPoDanu = dodatOglas.CenaPoDanu,
                //     BrojSoba = dodatOglas.BrojSoba,
                //     Kvadratura = dodatOglas.Kvadratura,
                //     BrojKreveta = dodatOglas.Kvadratura,
                //     BrojKupatila = dodatOglas.BrojKupatila,
                //     Grejanje = dodatOglas.Grejanje,
                //     ListDodatneOpreme = dodatOglas.ListDodatneOpreme,
                //     BrTel = dodatOglas.BrTel,
                //     Opis = dodatOglas.Opis,
                //     Slike = dodatOglas.Slike,
                //     BrojOcena = dodatOglas.BrojOcena,
                //     ZauzetiDani = dodatOglas.ZauzetiDani,
                //     VlasnikOglasa = korisnik
                // };

                /*korisnik.ListaObjavljenihOglasaObjekta?.Add(oglas);*/
                // Postavljanje vlasnika oglasa

                Context.OglasiObjekta.Add(oglas);
                await Context.SaveChangesAsync();

                OglasObjektaResponse response = ObjectCreatorSingleton.Instance.ToOglasResult(oglas);
                return Ok(response);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        #endregion

        #region ObrisiOglas
        [HttpDelete("ObrisiOglas/{idOglasa}")]
        public async Task<ActionResult> ObrisiOglas(int idOglasa)
        {
            try
            {
                int idKorisnika = int.Parse((HttpContext.Items["idKorisnika"] as string)!);
                Korisnik? korisnik = await Context.Korisnici.FindAsync(idKorisnika);

                if (korisnik == null)
                {
                    return BadRequest("Korisnik ne postoji");
                }

                OglasObjekta? oglas = await Context.OglasiObjekta.Include(i => i.VlasnikOglasa).Include(i => i.ListaZakupkjenihOglasa!).ThenInclude(t => t.ZahtevZaKetering).FirstOrDefaultAsync(f => f.Id == idOglasa);

                if (oglas == null)
                {
                    return BadRequest("Oglas ne postoji");
                }

                if (oglas.VlasnikOglasa!.Id != korisnik.Id)
                {
                    return BadRequest("Ti nisi vlasnik oglasa bato");
                }

                if (oglas.ListaZakupkjenihOglasa != null)
                {
                    foreach (var zakupljen in oglas.ListaZakupkjenihOglasa)
                    {

                        if (zakupljen!.ZahtevZaKetering != null)
                        {
                            Context.ZahteviZaKetering.Remove(zakupljen!.ZahtevZaKetering);
                        }

                        Context.ZakupljeniOglasi.Remove(zakupljen);

                    }
                }

                //Brisanje slika iz foldera oglasa
                var folderPath = Path.Combine("wwwroot", "images", "Oglasi", oglas.Id.ToString());
                if (Directory.Exists(folderPath))
                {
                    Directory.Delete(folderPath, true); // true znači da će se obrisati i svi fajlovi i podfolderi
                }

                Context.OglasiObjekta.Remove(oglas);
                await Context.SaveChangesAsync();

                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        #endregion


        //ovde je sve odjednom ne mora svaki properti da ima posebno azuriranje
        #region IzmeniOglas
        [HttpPut("IzmeniOglas")]
        public async Task<ActionResult> IzmeniOglas([FromBody] OglasObjektaResponse izmeniOglas)
        {

            try
            {
                int idKorisnika = int.Parse((HttpContext.Items["idKorisnika"] as string)!);

                OglasObjekta? oglas = await Context.OglasiObjekta.Where(k => k.Id == izmeniOglas.id)
                                                            .IgnoreQueryFilters()
                                                            .FirstOrDefaultAsync(o => o.VlasnikOglasa!.Id == idKorisnika);

                if (oglas == null)
                {
                    return BadRequest("Oglas ne postoji");
                }

                oglas.ListaTipProslava = izmeniOglas.listaTipProslava;
                oglas.ListaTipProstora = izmeniOglas.listaTipProstora;
                oglas.Naziv = izmeniOglas.naziv;
                oglas.Grad = izmeniOglas.grad;
                oglas.Lokacija = izmeniOglas.lokacija;
                oglas.CenaPoDanu = izmeniOglas.cenaPoDanu;
                oglas.BrojSoba = izmeniOglas.brojSoba;
                oglas.Kvadratura = izmeniOglas.kvadratura;
                oglas.BrojKreveta = izmeniOglas.brojKreveta;
                oglas.BrojKupatila = izmeniOglas.brojKupatila;
                oglas.Grejanje = izmeniOglas.grejanje;
                oglas.ListDodatneOpreme = izmeniOglas.listDodatneOpreme;
                oglas.BrTel = izmeniOglas.brTel;
                oglas.Opis = izmeniOglas.opis;
                oglas.ListaTipProslava = izmeniOglas.listaTipProslava;
                oglas.ListaTipProstora = izmeniOglas.listaTipProstora;
                oglas.Naziv = izmeniOglas.naziv;
                oglas.Grad = izmeniOglas.grad;
                oglas.Lokacija = izmeniOglas.lokacija;
                oglas.CenaPoDanu = izmeniOglas.cenaPoDanu;
                oglas.BrojSoba = izmeniOglas.brojSoba;
                oglas.Kvadratura = izmeniOglas.kvadratura;
                oglas.BrojKreveta = izmeniOglas.brojKreveta;
                oglas.BrojKupatila = izmeniOglas.brojKupatila;
                oglas.Grejanje = izmeniOglas.grejanje;
                oglas.ListDodatneOpreme = izmeniOglas.listDodatneOpreme;
                oglas.BrTel = izmeniOglas.brTel;
                oglas.Opis = izmeniOglas.opis;

                await Context.SaveChangesAsync();

                OglasObjektaResponse response = ObjectCreatorSingleton.Instance.ToOglasResult(oglas);

                return Ok(response);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        #endregion

        [HttpPut("IzmeniSlikuOglasa")]
        public async Task<ActionResult> IzmeniSlikuOglasa(int oglasId, IFormFile file, string staraPutanja)
        {
            try
            {

                var oglas = await Context.OglasiObjekta.Include(i => i.VlasnikOglasa).FirstOrDefaultAsync(f => f.Id == oglasId);
                if (oglas == null)
                {
                    return NotFound("Oglas nije pronađen.");
                }

                int idKorisnika = int.Parse((HttpContext.Items["idKorisnika"] as string)!);

                if (oglas.VlasnikOglasa!.Id != idKorisnika)
                {
                    return BadRequest("nisi ti taj bebo");
                }

                var folderPath = Path.Combine("wwwroot", "images", "Oglasi", oglasId.ToString());
                if (!Directory.Exists(folderPath))
                {
                    Directory.CreateDirectory(folderPath);
                }

                // Brišemo staru sliku ako je prosleđena putanja
                if (!string.IsNullOrEmpty(staraPutanja))
                {
                    var staraPutanjaFajla = Path.Combine(folderPath, Path.GetFileName(staraPutanja));
                    if (System.IO.File.Exists(staraPutanjaFajla))
                    {
                        System.IO.File.Delete(staraPutanjaFajla);

                        oglas.Slike.Remove(staraPutanja);
                    }
                }

                // Dodajemo novu sliku ako je prosleđena
                if (file != null && file.Length > 0)
                {
                    var fileName = $"s1{Path.GetExtension(file.FileName)}";
                    var filePath = Path.Combine(folderPath, fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }

                    var relativePath = Path.Combine("images", "Oglasi", oglasId.ToString(), fileName).Replace("\\", "/");
                    oglas.Slike.Clear(); // Brišemo sve postojeće slike oglasa
                    oglas.Slike.Add(relativePath); // Dodajemo novu sliku
                }

                await Context.SaveChangesAsync();
                return Ok("Slika uspešno izmenjena.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        #region OceniAgenciju
        [HttpPut("OceniAgenciju/{idAgencije}/{novaOcena}")]
        public async Task<ActionResult> OceniAgenciju(int idAgencije, int novaOcena)
        {
            try
            {

                //int idKorisnika = int.Parse((HttpContext.Items["idKorisnika"] as string)!);

                var agencija = await Context.Agencije.FindAsync(idAgencije);

                if (agencija == null)
                {
                    return BadRequest("Ne postoji takva agencija");
                }


                agencija.Ocena = (agencija.Ocena * agencija.BrojOcena + novaOcena) / ++agencija.BrojOcena;
                // 3 4 5    12/3 = 4
                // 3 4 5 3 15/4 = 3.75
                // 4+3/4 = 1.75


                Context.Agencije.Update(agencija);

                await Context.SaveChangesAsync();

                return Ok(agencija);



            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        #endregion

        #region OceniOglas
        [HttpPut("OceniOglas/{idOglasa}/{novaOcena}")]
        public async Task<ActionResult> OceniOglas(int idOglasa, int novaOcena)
        {
            try
            {

                //int idKorisnika = int.Parse((HttpContext.Items["idKorisnika"] as string)!);

                var oglas = await Context.OglasiObjekta.FindAsync(idOglasa);

                if (oglas == null)
                {
                    return BadRequest("Ne postoji takva oglas");
                }


                oglas.Ocena = (oglas.Ocena * oglas.BrojOcena + novaOcena) / ++oglas.BrojOcena;
                // 3 4 5    12/3 = 4
                // 3 4 5 3 15/4 = 3.75
                // 4+3/4 = 1.75


                Context.OglasiObjekta.Update(oglas);
                await Context.SaveChangesAsync();

                return Ok(oglas);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        #endregion

        #region ZakupiOglas
        [HttpPost("ZakupiOglas/{idOglasa}")]
        public async Task<ActionResult> ZakupiOglas(int idOglasa, [FromBody] List<DateTime> trazeniDatumi)
        {
            try
            {
                int idKorisnika = int.Parse((HttpContext.Items["idKorisnika"] as string)!);
                var korisnik = await Context.Korisnici.FindAsync(idKorisnika);

                OglasObjekta? oglas = await Context.OglasiObjekta.FindAsync(idOglasa);

                if (oglas == null)
                {
                    return BadRequest("ne postoji takav objekat");
                }

                bool slobodan = !oglas.ZauzetiDani!.Any(date => trazeniDatumi.Any(trazeniDatum => trazeniDatum.Date == date.Date));

                if (slobodan)
                {
                    oglas.ZauzetiDani!.AddRange(trazeniDatumi);

                    ZakupljeniOglas zakupljenoglas = new ZakupljeniOglas
                    {
                        Oglas = oglas,
                        Korisnik = korisnik!,
                        DatumZakupa = DateTime.Now,
                        ZakupljenOd = trazeniDatumi[0],
                        ZakupljenDo = trazeniDatumi[trazeniDatumi.Count - 1],
                        ZahtevZaKetering = null,
                        Cena = trazeniDatumi.Count * oglas.CenaPoDanu
                    };

                    Context.ZakupljeniOglasi.Add(zakupljenoglas);
                    await Context.SaveChangesAsync();

                    ZakupljeniOglasDTO result = ObjectCreatorSingleton.Instance.ToZakupljeniOglasDTO(zakupljenoglas);
                    return Ok(result);
                }
                else
                {

                    return BadRequest("Objekat je zauzet u datom periodu");
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        #endregion

        #region  PosaljiZahtevZaKetering
        [HttpPost("PosaljiZahtevZaKetering/{idZakupljenOglas}/{idAgencije}/{mogucnostDostave}")]
        public async Task<IActionResult> PosaljiZahtevZaKetering(bool mogucnostDostave, int idZakupljenOglas, int idAgencije, [FromBody] List<PorucenMeni> listamenija)
        {
            try
            {
                int idKorisnika = int.Parse((HttpContext.Items["idKorisnika"] as string)!);

                var zakupljenioglas = await Context.ZakupljeniOglasi
                    .Include(i => i.Korisnik)
                    .Include(i => i.ZahtevZaKetering)
                    .IgnoreQueryFilters()
                    .FirstOrDefaultAsync(f => f.Id == idZakupljenOglas);

                if (zakupljenioglas == null)
                {
                    return BadRequest("Nema takvog zakupljenog oglasa");
                }

                if (zakupljenioglas.Korisnik!.Id != idKorisnika)
                {
                    return BadRequest("Nisi ovlašćeni korisnik");
                }

                if (zakupljenioglas.ZahtevZaKetering != null)
                {
                    return BadRequest("Ovaj oglas već ima zakupljen ketering");
                }

                var agencija = await Context.Agencije
                    .Include(i => i.ListaZahtevZaKetering)
                    .IgnoreQueryFilters()
                    .FirstOrDefaultAsync(f => f.Id == idAgencije);

                if (agencija == null)
                {
                    return BadRequest("Agencija ne postoji");
                }

                List<int> idMenija = listamenija.Select(o => o.idMenija).ToList();

                var novizahtev = new ZahtevZaKetering
                {
                    ZakupljeniOglas = zakupljenioglas,
                    DatumRezervacije = zakupljenioglas.ZakupljenOd,
                    StatusRezervacije = null,
                    Agencija = agencija
                };

                int ukupnaCena = 0;
                foreach (var o in listamenija)
                {
                    var jedanMeni = await Context.MenijiKeteringa
                        .Include(i => i.Kategorija)
                        .ThenInclude(t => t!.Agencija)
                        .Include(i => i.ListaZahetevaZaKetering)
                        .IgnoreQueryFilters()
                        .FirstOrDefaultAsync(f => f.Id == o.idMenija);

                    if (jedanMeni == null)
                    {
                        return BadRequest("Taj meni ne postoji");
                    }

                    novizahtev.ZakupljeniMeniji?.Add(jedanMeni);
                    jedanMeni.ListaZahetevaZaKetering?.Add(novizahtev);

                    if (jedanMeni.Kategorija!.Agencija!.Id != idAgencije)
                    {
                        return BadRequest("Meniji nisu iz iste agencije");
                    }

                    ukupnaCena += jedanMeni.CenaMenija * o.kg;
                }

                agencija!.ListaZahtevZaKetering!.Add(novizahtev);

                if (mogucnostDostave)
                {
                    ukupnaCena += agencija.CenaDostave;
                }

                novizahtev.KonacnaCena = ukupnaCena;
                zakupljenioglas.ZahtevZaKetering = novizahtev;

                Context.ZahteviZaKetering.Add(novizahtev);
                await Context.SaveChangesAsync();

                ZahtevZaKeteringResult result = ObjectCreatorSingleton.Instance.ToZahtevZaKeteringResult(novizahtev);

                return Ok(result);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        #endregion

        #region OtkaziZahtevZaKetering
        [HttpDelete("OtkaziZahtevZaKetering/{idZakupljenogKeteringa}/{idZaOglasa}")]
        public async Task<ActionResult> OtkaziZahtevZaKetering(int idZakupljenogKeteringa, int idZaOglasa)
        {
            try
            {
                int idKorisnika = int.Parse((HttpContext.Items["idKorisnika"] as string)!);

                var korisnik = await Context.Korisnici.FindAsync(idKorisnika);

                var ketering = await Context.ZahteviZaKetering.Include(i => i.Agencija).ThenInclude(t => t!.ListaZahtevZaKetering).Include(i => i.ZakupljeniOglas).ThenInclude(t => t!.Korisnik).FirstOrDefaultAsync(x => x.Id == idZakupljenogKeteringa);
                
                var oglas = await Context.ZakupljeniOglasi.Include(i => i.ZahtevZaKetering).IgnoreQueryFilters().FirstOrDefaultAsync(f => f.Id == idZaOglasa);

                if (ketering == null)
                {
                    return BadRequest("Ne postoji takav zakupljen ketering");
                }

                if (ketering.ZakupljeniOglas?.Korisnik?.Id != idKorisnika){
                    return BadRequest("Nisti ti taj bebo");
                }

                if (oglas == null)
                {
                    return BadRequest("Ne postoji takav zakupljeni oglas");
                }

                ketering.StatusRezervacije = false;
                
                oglas.ZahtevZaKetering = null;
                ketering!.Agencija!.ListaZahtevZaKetering!.Remove(ketering);
                
                
                Context.ZahteviZaKetering.Remove(ketering);

                await Context.SaveChangesAsync();

                return Ok(ketering);


            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        #endregion

        #region Otkazi zakup objekta
        [HttpDelete("OtkaziRezervacijuObjekta/{idZakupljenogOglasa}")]
        public async Task<ActionResult> OtkaziRezervacijuObjekta(int idZakupljenogOglasa)
        {
            try
            {
                int idKorisnika = int.Parse((HttpContext.Items["idKorisnika"] as string)!);




                var korisnik = await Context.Korisnici.Include(i => i.ListaZakupljenihOglasa).FirstOrDefaultAsync(f => f.Id == idKorisnika);

                var oglas = await Context.ZakupljeniOglasi.Include(i => i.Oglas).Include(i => i.ZahtevZaKetering).Include(x => x.Korisnik).Where(x => x.Korisnik!.Id == idKorisnika)
                .IgnoreQueryFilters().FirstOrDefaultAsync(x => x.Id == idZakupljenogOglasa);

                
                if (oglas == null)
                {
                    return BadRequest("Ne postoji takav zakupljen oglas");
                }

                List<DateTime> sviDaniUOpsegu = Enumerable.Range(0, (oglas.ZakupljenDo - oglas.ZakupljenOd).Days + 1)
                                                        .Select(offset => oglas.ZakupljenOd.AddDays(offset))
                                                        .ToList();




                var daniZaUklanjanje = oglas.Oglas?.ZauzetiDani!
                        .Where(d => sviDaniUOpsegu.Contains(d))
                        .ToList();

                // Ukloni datume iz liste ZauzetiDani
                oglas.Oglas?.ZauzetiDani!.RemoveAll(d => sviDaniUOpsegu.Contains(d));

                if (oglas.ZahtevZaKetering != null){
                    oglas.ZahtevZaKetering!.StatusRezervacije = false;
                }

                if(korisnik!.ListaZakupljenihOglasa != null && korisnik.ListaZakupljenihOglasa.Count > 0){
                    korisnik.ListaZakupljenihOglasa.Remove(oglas);
                }  
                // Sačuvaj promene u bazi

                Context.ZakupljeniOglasi.Remove(oglas);

                await Context.SaveChangesAsync();

                return Ok(oglas);


            }

            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        #endregion


        #region Prikaz omiljenih oglasa (idKorisnika)
        [HttpGet("PrikaziSveOmiljeneOglase")]
        public async Task<IActionResult> PrikaziSveOmiljeneOglase()
        {

            try
            {
                int idKorisnika = int.Parse((HttpContext.Items["idKorisnika"] as string)!);

                Korisnik? korisnik = await Context.Korisnici.Include(k => k.ListaOmiljenihOglasaObjekata).FirstOrDefaultAsync(k => k.Id == idKorisnika);

                if (korisnik == null)
                {
                    return BadRequest("Korisnika tim id-jem ne postoji");
                }

                List<OglasObjekta>? omiljenioglasi = korisnik.ListaOmiljenihOglasaObjekata;
                List<OglasObjektaResponse> result = new();

                if (omiljenioglasi == null) return Ok(result);

                foreach (OglasObjekta oglas in omiljenioglasi)
                {
                    result.Add(ObjectCreatorSingleton.Instance.ToOglasResult(oglas));
                }

                return Ok(result);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }

        }
        #endregion


        #region ObrisiKorisnika

        [HttpDelete("ObrisiKorisnika")]
        public async Task<ActionResult> ObrisiKorisnika()
        {
            try
            {
                int idKorisnika = int.Parse((HttpContext.Items["idKorisnika"] as string)!);

                //Korisnik? korisnik = await Context.Korisnici.FindAsync(idKorisnika);

                Korisnik? korisnik = await Context.Korisnici
                    .Include(i => i.ListaObjavljenihOglasaObjekta)// Pretpostavljam da korisnik ima kolekciju oglasa
                    .FirstOrDefaultAsync(k => k.Id == idKorisnika);

                if (korisnik == null)
                {
                    return BadRequest(idKorisnika);
                }


                if (!string.IsNullOrEmpty(korisnik.SlikaProfila))
                {
                    var profilnaSlikaPath = Path.Combine("wwwroot", korisnik.SlikaProfila);
                    if (System.IO.File.Exists(profilnaSlikaPath))
                    {
                        System.IO.File.Delete(profilnaSlikaPath);
                    }
                }

                // Brisanje svih oglasa korisnika i njihovih slika
                foreach (var oglas in korisnik.ListaObjavljenihOglasaObjekta!)
                {
                    var folderPath = Path.Combine("wwwroot", "images", "Oglasi", oglas.Id.ToString());
                    if (Directory.Exists(folderPath))
                    {
                        Directory.Delete(folderPath, true); // true znači da će se obrisati i svi fajlovi i podfolderi
                    }

                    Context.OglasiObjekta.Remove(oglas);
                }

                Context.Korisnici.Remove(korisnik);
                await Context.SaveChangesAsync();

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        #endregion




        // Izmena podataka (idKorisnika)
        #region IzmeniPodatkeOKorisniku
        [HttpPut("IzmeniPodatkeOKorisniku")]
        public async Task<ActionResult> IzmeniPodatkeOKorisniku([FromBody] KorisnikBasic korisnik)
        {
            try
            {
                int idKorisnika = int.Parse((HttpContext.Items["idKorisnika"] as string)!);

                if (idKorisnika != korisnik.id)
                {
                    return BadRequest("nema");
                }

                Korisnik? dboKorisnik = await Context.Korisnici.FindAsync(idKorisnika);

                if (dboKorisnik == null)
                {
                    return BadRequest("nema");
                }

                dboKorisnik.Ime = korisnik.name;
                dboKorisnik.Email = korisnik.email;
                dboKorisnik.BrTel = korisnik.phoneNumber;
                dboKorisnik.Lokacija = korisnik.location;
                dboKorisnik.Prezime = korisnik.lastName;

                await Context.SaveChangesAsync();

                GetKorisnikResult result = ObjectCreatorSingleton.Instance.ToKorisnikResult(dboKorisnik);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        #endregion

        #region PrikaziOglaseKorisnika
        [HttpGet("PrikaziOglaseKorisnika")]
        public async Task<ActionResult> PrikaziOglaseKorisnika()
        {
            try
            {
                int idKorisnika = int.Parse((HttpContext.Items["idKorisnika"] as string)!);

                Korisnik? korisnik = await Context.Korisnici.Include(o => o.ListaObjavljenihOglasaObjekta).FirstOrDefaultAsync(k => k.Id == idKorisnika);

                if (korisnik == null)
                {
                    return BadRequest("Korisnik ne postoji");
                }

                // TODO WHY
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


        // PRovera neka nije bitnooooo

        // #region  PrikaziSveMenije
        // [HttpGet("PrikaziSveMenije/{idKategorije}")]
        // public async Task<IActionResult> PrikaziSveMenije(int idKategorije){
        //     try{

        //         var meniji = await Context.ZahteviZaKetering.Include(i => i.ZakupljeniMeniji).ToListAsync();



        //     if (meniji == null){
        //         return BadRequest("Nema takvih kategorija i agencija zajedno");
        //     }
        //     else {
        //         return Ok(meniji);
        //     }   

        //     }
        //     catch(Exception ex){
        //         return BadRequest(ex.Message);
        //     }

        // }

        // #endregion


        #region PrikaziZakupljeniOglas
        [HttpGet("PrikaziZakupljeniOglas/{idzakupljenogobjekta}")]
        public async Task<IActionResult> PrikaziZakupljeniOglas(int idzakupljenogobjekta)
        {
            try
            {
                var zakupljenioglas = await Context.ZakupljeniOglasi
                                            .Include(x => x.ZahtevZaKetering)
                                            .Where(x => x.Id == idzakupljenogobjekta)
                                            .Select(x => new
                                            {
                                                x.Id,
                                                x.DatumZakupa,
                                                x.ZakupljenOd,
                                                x.ZakupljenDo,
                                                x.ZahtevZaKetering

                                            })
                                            .FirstOrDefaultAsync();

                if (zakupljenioglas == null)
                {
                    return BadRequest("Nema takvog zakupljenog oglasa");
                }

                return Ok(zakupljenioglas);

                // var rez = zakupljenioglas.Select(x => new {
                //     x.Id,
                //    // x.Oglas,
                //    x.DatumZakupa,
                //    x.ZakupljenOd,
                //    x.ZakupljenDo,
                //    ZahtevZaKetering = x.ZahtevZaKetering



                // });





            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }




        #endregion


        [HttpPost("uploadKorisnik")]
        public async Task<IActionResult> UploadSlikaKorisnik(IFormFile file)
        {
            // TODO: popravi da se dodaje samo jedna slika u folderu bez obzira na format slike
            int korisnikid = int.Parse((HttpContext.Items["idKorisnika"] as string)!);

            var korisnik = await Context.Korisnici.FindAsync(korisnikid);
            if (korisnik == null)
            {
                return NotFound("Korisnik nije pronađen.");
            }

            if (file == null || file.Length == 0)
            {
                return BadRequest("Nijedna slika nije poslata.");
            }

            var folderPath = Path.Combine("wwwroot", "images", "Korisnik", korisnikid.ToString());
            if (!Directory.Exists(folderPath))
            {
                Directory.CreateDirectory(folderPath);
            }

            // Obrisi sve postojeće slike u folderu
            var files = Directory.GetFiles(folderPath);
            foreach (var existingFile in files)
            {
                System.IO.File.Delete(existingFile);
            }

            var fileName = "s1.jpg"; // Uvek čuvamo sliku kao s1.jpg
            var filePath = Path.Combine(folderPath, fileName);

            using (var image = Image.Load(file.OpenReadStream()))
            {
                // Konvertuj sliku u JPG format
                image.Save(filePath, new JpegEncoder());
            }

            var relativePath = Path.Combine("images", "Korisnik", korisnikid.ToString(), fileName).Replace("\\", "/");

            korisnik.SlikaProfila = relativePath;
            await Context.SaveChangesAsync();

            return Ok(new { relativePath });
        }

        [HttpPut("AzurirajSlikuKorisnika")]
        public async Task<ActionResult> AzurirajSlikuKorisnika(IFormFile file)
        {
            try
            {
                int korisnikid = int.Parse((HttpContext.Items["idKorisnika"] as string)!);

                var korisnik = await Context.Korisnici.FindAsync(korisnikid);
                if (korisnik == null)
                {
                    return NotFound("Korisnik nije pronađen.");
                }

                if (file == null || file.Length == 0)
                {
                    return BadRequest("Nijedna slika nije poslata.");
                }

                var folderPath = Path.Combine("wwwroot", "images", "Korisnik", korisnikid.ToString());
                if (!Directory.Exists(folderPath))
                {
                    Directory.CreateDirectory(folderPath);
                }

                // Obriši postojeću sliku korisnika ako postoji
                var existingFiles = Directory.GetFiles(folderPath);
                foreach (var existingFile in existingFiles)
                {
                    System.IO.File.Delete(existingFile);
                }

                var fileName = $"s1.jpg"; // Uvek koristi isto ime za sliku (s1.jpg) kako bi se izbegao konflikt sa prethodnim slikama
                var filePath = Path.Combine(folderPath, fileName);

                using (var image = Image.Load(file.OpenReadStream()))
                {
                    // Konvertuj sliku u JPG format
                    image.Save(filePath, new JpegEncoder());
                }

                var relativePath = Path.Combine("images", "Korisnik", korisnikid.ToString(), fileName).Replace("\\", "/");

                korisnik.SlikaProfila = relativePath;
                await Context.SaveChangesAsync();

                return Ok(new { Putanja = relativePath });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        #region UploadujSlikuOglasa
        [HttpPost("uploadOglas/{oglasId}")]
        public async Task<IActionResult> UploadSlikaOglas(int oglasId, IFormFile file)
        {
            // TODO: Proveri da li je oglas od logovanog korisnika
            // Dodato
            int korisnikid = int.Parse((HttpContext.Items["idKorisnika"] as string)!);

            var korisnik = await Context.Korisnici.FindAsync(korisnikid);
            if (korisnik == null)
            {
                return NotFound("Korisnik nije pronađen.");
            }

            var oglas = await Context.OglasiObjekta.Include(i => i.VlasnikOglasa).Where(w => w.VlasnikOglasa!.Id == korisnikid).FirstOrDefaultAsync(f => f.Id == oglasId);

            if (oglas == null)
            {
                return NotFound("Oglas nije pronađen.");
            }

            if (file == null || file.Length == 0)
            {
                return BadRequest("Nijedna slika nije poslata.");
            }

            var folderPath = Path.Combine("wwwroot", "images", "Oglasi", oglasId.ToString());
            if (!Directory.Exists(folderPath))
            {
                Directory.CreateDirectory(folderPath);
            }

            var files = Directory.GetFiles(folderPath);
            var fileCount = files.Length;

            var fileName = $"s{fileCount + 1}.jpg";
            var filePath = Path.Combine(folderPath, fileName);

            using (var image = Image.Load(file.OpenReadStream()))
            {
                // Konvertuj sliku u JPG format
                image.Save(filePath, new JpegEncoder());
            }

            var relativePath = Path.Combine("images", "Oglasi", oglasId.ToString(), fileName).Replace("\\", "/");


            oglas.Slike.Add(relativePath);
            await Context.SaveChangesAsync();

            return Ok(new { Putanja = relativePath });
        }
        #endregion

        // #region UpdateSlikeOglasa - ListaSlika
        // [HttpPost("updateSlikeOglasListaSlika/{oglasId}")]
        // public async Task<IActionResult> UpdateSlikeOglas(int oglasId, [FromBody]List<string> slikeZaBrisanje, [FromBody]List<IFormFile> noveSlike)
        // {
        //     // TODO: Proveri da li je oglas od logovanog korisnika
        //     // Dodato
        //     int korisnikid = int.Parse((HttpContext.Items["idKorisnika"] as string)!);

        //     var korisnik = await Context.Korisnici.FindAsync(korisnikid);
        //     if (korisnik == null)
        //     {
        //         return NotFound("Korisnik nije pronađen.");
        //     }

        //     var oglas = await Context.OglasiObjekta.Include(i => i.VlasnikOglasa).Where(w => w.VlasnikOglasa!.Id == korisnikid).FirstOrDefaultAsync(f => f.Id == oglasId);
        //     if (oglas == null)
        //     {
        //         return NotFound("Oglas nije pronađen.");
        //     }

        //     var folderPath = Path.Combine("wwwroot", "images", "Oglasi", oglasId.ToString());
        //     if (!Directory.Exists(folderPath))
        //     {
        //         Directory.CreateDirectory(folderPath);
        //     }

        //     // Obrisi slike koje su specificirane za brisanje
        //     foreach (var slikaPath in slikeZaBrisanje)
        //     {
        //         var filePath = Path.Combine("wwwroot", slikaPath.Replace("/", "\\"));
        //         if (System.IO.File.Exists(filePath))
        //         {
        //             System.IO.File.Delete(filePath);
        //         }

        //         oglas.Slike.Remove(slikaPath);
        //     }

        //     var existingFiles = Directory.GetFiles(folderPath);
        //     var fileCount = existingFiles.Length;

        //     // Dodaj nove slike
        //     var uploadedPaths = new List<string>();

        //     foreach (var file in noveSlike)
        //     {
        //         if (file.Length > 0)
        //         {
        //             var fileName = $"s{fileCount + 1}.jpg";
        //             var filePath = Path.Combine(folderPath, fileName);

        //             using (var image = Image.Load(file.OpenReadStream()))
        //             {
        //                 // Konvertuj sliku u JPG format
        //                 image.Save(filePath, new JpegEncoder());
        //             }

        //             var relativePath = Path.Combine("images", "Oglasi", oglasId.ToString(), fileName).Replace("\\", "/");
        //             oglas.Slike.Add(relativePath);
        //             uploadedPaths.Add(relativePath);

        //             fileCount++;
        //         }
        //     }

        //     await Context.SaveChangesAsync();

        //     return Ok(new { Putanje = uploadedPaths });
        // }
        // #endregion


        #region UploadujSlikuOglasa-ListaSlika

        [HttpPost("uploadOglasListaSlika/{oglasId}")]
        public async Task<IActionResult> UploadSlikeOglas(int oglasId, [FromBody] List<IFormFile> files)
        {
            // TODO: Proveri da li je oglas od logovanog korisnika
            // Dodato
            int korisnikid = int.Parse((HttpContext.Items["idKorisnika"] as string)!);

            var korisnik = await Context.Korisnici.FindAsync(korisnikid);
            if (korisnik == null)
            {
                return NotFound("Korisnik nije pronađen.");
            }

            var oglas = await Context.OglasiObjekta.Include(i => i.VlasnikOglasa).Where(w => w.VlasnikOglasa!.Id == korisnikid).FirstOrDefaultAsync(f => f.Id == oglasId);

            if (oglas == null)
            {
                return NotFound("Oglas nije pronađen.");
            }

            if (files == null || files.Count == 0)
            {
                return BadRequest("Nijedna slika nije poslata.");
            }

            var folderPath = Path.Combine("wwwroot", "images", "Oglasi", oglasId.ToString());
            if (!Directory.Exists(folderPath))
            {
                Directory.CreateDirectory(folderPath);
            }

            var existingFiles = Directory.GetFiles(folderPath);
            var fileCount = existingFiles.Length;

            var uploadedPaths = new List<string>();

            foreach (var file in files)
            {
                if (file.Length > 0)
                {
                    var fileName = $"s{fileCount + 1}.jpg"; // Uvek koristi .jpg ekstenziju
                    var filePath = Path.Combine(folderPath, fileName);

                    using (var image = Image.Load(file.OpenReadStream()))
                    {
                        // Konvertuj sliku u JPG format
                        image.Save(filePath, new JpegEncoder());
                    }

                    var relativePath = Path.Combine("images", "Oglasi", oglasId.ToString(), fileName).Replace("\\", "/");
                    oglas.Slike.Add(relativePath);
                    uploadedPaths.Add(relativePath);

                    fileCount++;
                }
            }

            await Context.SaveChangesAsync();

            return Ok(new { Putanje = uploadedPaths });
        }
        #endregion


        #region DaLisamOmiljeni
        [HttpGet("DaLiOmiljen/{oglasId}")]
        public async Task<IActionResult> DaLiOmiljen(int oglasId)
        {
            int korisnikid = int.Parse((HttpContext.Items["idKorisnika"] as string)!);

            var korisnik = await Context.Korisnici.Include(i => i.ListaOmiljenihOglasaObjekata).FirstOrDefaultAsync(f => f.Id == korisnikid);

            if (korisnik == null)
            {
                return NotFound("Korisnik nije pronađen.");
            }

            bool dalije = korisnik.ListaOmiljenihOglasaObjekata!.Any(o => o.Id == oglasId);

            return Ok(dalije);
        }

        #endregion

        #region ObrisiSlikuOglasa
        [HttpDelete("obrisiSlikuOglasa/{oglasId}/{slikaPath}")]
        public async Task<IActionResult> ObrisiSlikuOglasa(int oglasId, string slikaPath)
        {
            // TODO: Proveri da li je oglas od logovanog korisnika
            slikaPath = Uri.UnescapeDataString(slikaPath);
            int korisnikid = int.Parse((HttpContext.Items["idKorisnika"] as string)!);

            var korisnik = await Context.Korisnici.FindAsync(korisnikid);
            if (korisnik == null)
            {
                return NotFound("Korisnik nije pronađen.");
            }

            var oglas = await Context.OglasiObjekta.Include(i => i.VlasnikOglasa).Where(w => w.VlasnikOglasa!.Id == korisnikid).FirstOrDefaultAsync(f => f.Id == oglasId);
            if (oglas == null)
            {
                return NotFound("Oglas nije pronađen.");
            }

            // Obrisi sliku koja je specificirana
            // var filePath = Path.Combine("wwwroot", slikaPath.Replace("/", "\\"));
            var filePath = Path.Combine("wwwroot", slikaPath);
            if (System.IO.File.Exists(filePath))
            {
                System.IO.File.Delete(filePath);
            }
            else
            {
                return NotFound("Slika nije pronađena.");
            }

            oglas.Slike.Remove(slikaPath);

            await Context.SaveChangesAsync();

            return Ok();
        }
        #endregion
    }
}
