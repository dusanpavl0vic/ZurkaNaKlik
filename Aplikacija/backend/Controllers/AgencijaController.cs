using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.DTOs;
using backend.Models;
using backend.Utilities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Jpeg;
using SixLabors.ImageSharp.Processing;


namespace backend.Controllers
{
    [Authorize(Roles = "Agencija")]
    [ApiController]
    [Route("api/[controller]")]


    public class AgencijaController : ControllerBase
    {
        public ZurkaNaKlikDbContext Context { get; set; }
        private readonly IConfiguration _configuration;

        public AgencijaController(ZurkaNaKlikDbContext context, IConfiguration configuration)
        {
            Context = context;
            _configuration = configuration;
        }



        #region VratiKategorije
        [HttpGet("VratiKategorije")]
        public async Task<ActionResult> VratiKategorije()
        {
            try
            {
                int idAgencije = int.Parse((HttpContext.Items["idAgencije"] as string)!);

                Agencija? agencija = await Context.Agencije.FindAsync(idAgencije);
                if (agencija == null)
                {
                    return BadRequest("Ne postoji agencija sa tim id-jem");
                }

                List<Kategorija>? kategorija = await Context.Kategorije.Where(k => k.Agencija!.Id == idAgencije).ToListAsync();

                return Ok(kategorija);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        #endregion

        #region  DodajKategoriju
        //dodavanje kategorije preko rute id agencije = radi
        [HttpPost("DodajKategoriju")]
        public async Task<ActionResult> DodajKategoriju([FromBody] Kategorija kategorija)
        {
            try
            {

                int idAgencije = int.Parse((HttpContext.Items["idAgencije"] as string)!);


                // if (HttpContext.Items.TryGetValue("idAgencije", out var idAgencijeObj))
                // {
                //     idAgencije = int.Parse(idAgencijeObj as string);

                // }

                // if(idAgencije < 0){
                //     return BadRequest("kako si minus");
                // }

                Agencija? agencija = await Context.Agencije.FindAsync(idAgencije);
                if (agencija == null)
                {
                    return BadRequest("Ne postoji agencija sa tim id-jem");
                }

                var k = new Kategorija
                {
                    Naziv = kategorija.Naziv,
                    Agencija = agencija
                };

                await Context.Kategorije.AddAsync(k);
                await Context.SaveChangesAsync();

                KategorijaResult result = ObjectCreatorSingleton.Instance.ToKategorijaResult(k);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        #endregion

        //put i delete
        #region ObrisiKategoriju
        [HttpDelete("ObrisiKategoriju/{KategorijaID}")]
        public async Task<ActionResult> ObrisiKategoriju(int KategorijaID)
        {
            try
            {
                int idAgencije = int.Parse((HttpContext.Items["idAgencije"] as string)!);

                var kategorija = await Context.Kategorije
                    .Include(x => x.ListaMenija)
                    .Where(x => x.Agencija!.Id == idAgencije)
                    .FirstOrDefaultAsync(x => x.Id == KategorijaID);

                if (kategorija == null)
                {
                    return BadRequest("Nema takve kategorije");
                }

                kategorija.ListaMenija!.ForEach(meni =>
                {
                    // Brisanje direktorijuma sa slikama
                    var folderPath = Path.Combine("wwwroot", "images", "Meniji", meni.Id.ToString());
                    if (Directory.Exists(folderPath))
                    {
                        Directory.Delete(folderPath, true); // true znači da će se obrisati i svi fajlovi i podfolderi
                    }

                    Context.MenijiKeteringa.Remove(meni);
                });

                Context.Kategorije.Remove(kategorija);
                await Context.SaveChangesAsync();

                KategorijaResult result = ObjectCreatorSingleton.Instance.ToKategorijaResult(kategorija);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        #endregion

        //ovo vrati sve menije pa ce preko id agencije = novo


        #region DodavanjeMenija
        //radi
        [HttpPost("DodajMeni/{idKategorije}")]
        public async Task<ActionResult> DodajMeni([FromBody] MeniKeteringaBasic meniketeringa, int idKategorije)
        {
            try
            {

                int idAgencije = int.Parse((HttpContext.Items["idAgencije"] as string)!);

                Kategorija? kategorija = await Context.Kategorije.Include(x => x.Agencija).Where(x => x.Id == idKategorije).SingleOrDefaultAsync();
                if (kategorija == null)
                {
                    return BadRequest("Ne postoji kategorija sa tim id-jem");
                }

                MeniKeteringa meni = ObjectCreatorSingleton.Instance.ToMeniKeteringa(meniketeringa);
                meni.Kategorija = kategorija;

                await Context.MenijiKeteringa.AddAsync(meni);
                await Context.SaveChangesAsync();

                MeniKeteringaResult result = ObjectCreatorSingleton.Instance.ToMeniKeteringaResult(meni);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        #endregion


        #region AzurirajMeni

        [HttpPut("AzurirajMeni")]
        public async Task<ActionResult> AzurirajMeni([FromBody] MeniKeteringaResult meni)
        {
            try
            {
                int idAgencije = int.Parse((HttpContext.Items["idAgencije"] as string)!);

                MeniKeteringa? m = await Context.MenijiKeteringa.Include(x => x.Kategorija).Where(x => x.Id == meni.id).Where(x => x.Kategorija!
                .Agencija!.Id == idAgencije).IgnoreQueryFilters().FirstOrDefaultAsync();

                if (m == null)
                {
                    return BadRequest("Meni ne postoji");
                }

                m.CenaMenija = meni.cenaMenija;
                m.Naziv = meni.naziv;
                m.Opis = meni.opis;
                m.SastavMenija = meni.sastavMenija;
                //m.Slika = meni.slika;

                await Context.SaveChangesAsync();

                MeniKeteringaResult result = ObjectCreatorSingleton.Instance.ToMeniKeteringaResult(m);
                return Ok(result);

                // if (meni == null)
                // {
                //     return BadRequest("Pogresno unet meni"); 
                // }

                // meni.CenaMenija = NovaCena; // Ažuriramo cenu menija

                // Context.MenijiKeteringa.Update(meni); // Označavamo meni kao ažuriran

                // await Context.SaveChangesAsync(); // Čuvamo promene u bazi podataka

                // return Ok(meni); // Vraćamo ažurirani meni
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        #endregion

        #region ObrisiMeni
        [HttpDelete("ObrisiMeni/{MeniID}")]
        public async Task<ActionResult> ObrisiMeni(int MeniID)
        {
            try
            {
                int idAgencije = int.Parse((HttpContext.Items["idAgencije"] as string)!);

                var meni = await Context.MenijiKeteringa.Include(i => i.Kategorija!).ThenInclude(t => t.Agencija).Include(i => i.ListaZahetevaZaKetering!).ThenInclude(t => t.ZakupljeniOglas).FirstOrDefaultAsync(f => f.Id == MeniID);

                if (meni == null)
                {
                    return BadRequest("Pogresno unet meni");
                }

                if (meni.Kategorija?.Agencija?.Id != idAgencije)
                {
                    return BadRequest("nisi ti taj bebo");
                }

                var folderPath = Path.Combine("wwwroot", "images", "Meniji", MeniID.ToString());
                if (Directory.Exists(folderPath))
                {
                    Directory.Delete(folderPath, true); // true znači da će se obrisati i svi fajlovi i podfolderi
                }

                meni.ListaZahetevaZaKetering?.ForEach(i => {
                    i.StatusRezervacije = false;
                    i.ZakupljeniOglas!.ZahtevZaKetering = null;
                });

                // var kategorijaMenija = await Context.Kategorije.FindAsync();

                Context.MenijiKeteringa.Remove(meni);
                await Context.SaveChangesAsync();

                MeniKeteringaResult result = ObjectCreatorSingleton.Instance.ToMeniKeteringaResult(meni);
                return Ok(result);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        #endregion


        #region VratiMenijeSaKategorijama
        [HttpGet("VratiMenije")]
        public async Task<ActionResult> VratiMenije()
        {
            try
            {
                int idAgencije = int.Parse((HttpContext.Items["idAgencije"] as string)!);
                List<Kategorija>? kategorije = await Context.Kategorije.Where(k => k.Agencija!.Id == idAgencije).ToListAsync();

                List<VratiMenijeResultElement>? meniKeteringa = new();

                if (kategorije == null)
                {
                    return Ok(meniKeteringa);
                }

                foreach (Kategorija kat in kategorije)
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
        #region ObrisiAgenciju

        [HttpDelete("ObrisiAgenciju")]
        public async Task<ActionResult> ObrisiAgenciju()
        {
            try
            {
                int idAgencije = int.Parse((HttpContext.Items["idAgencije"] as string)!);

                var agencija = await Context.Agencije
                                                .Include(a => a.KategorijeMenija!)
                                                .ThenInclude(k => k.ListaMenija)
                                                .FirstOrDefaultAsync(a => a.Id == idAgencije);

                if (agencija == null)
                {
                    return NotFound("Agencija nije pronađena.");
                }

                // Iteriramo kroz sve kategorije agencije
                agencija.KategorijeMenija!.ForEach(kategorija =>
                {
                    // Iteriramo kroz sve menije unutar kategorije
                    kategorija.ListaMenija!.ForEach(meni =>
                    {
                        // Brisanje direktorijuma sa slikama
                        var folderPath = Path.Combine("wwwroot", "images", "Meniji", meni.Id.ToString());
                        if (Directory.Exists(folderPath))
                        {
                            Directory.Delete(folderPath, true); // true znači da će se obrisati i svi fajlovi i podfolderi
                        }

                        // Uklanjanje menija iz baze podataka
                        Context.MenijiKeteringa.Remove(meni);
                    });

                    // Uklanjanje kategorije iz baze podataka
                    Context.Kategorije.Remove(kategorija);
                });

                // Uklanjanje agencije iz baze podataka
                Context.KorisniciAgencije.Remove(agencija);
                // await Context.SaveChangesAsync();

                return Ok("Agencija je uspešno obrisana.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        #endregion

        //prikazi sve porudzbine
        #region  PrikaziSvePorudzbine
        [HttpGet("PrikaziSvePorudzbine")]
        public async Task<IActionResult> PrikaziSvePorudzbine()
        {
            try
            {
                int idAgencije = int.Parse((HttpContext.Items["idAgencije"] as string)!);

                var zahtevizaketering = await Context.ZahteviZaKetering
                                                                    .Include(i => i.Agencija)
                                                                    .Include(i => i.ZakupljeniMeniji)
                                                                    .Include(i => i.ZakupljeniOglas)
                                                                    .Where(i => i.Agencija!.Id == idAgencije)
                                                                    .IgnoreQueryFilters()
                                                                    .ToListAsync();

                if (zahtevizaketering == null)
                {
                    return BadRequest("Ovaj zahtev nija validan");
                }


                List<ZahtevZaKeteringResult> result = new();

                foreach (ZahtevZaKetering zahtev in zahtevizaketering)
                {
                    result.Add(ObjectCreatorSingleton.Instance.ToZahtevZaKeteringResult(zahtev));
                }

                return Ok(result);
            }
            catch (Exception e)
            {
                return BadRequest(e);
            }
        }
        #endregion

        //odobri porudbinu
        #region  OdobriPorudzbinu
        [HttpPut("OdobriPorudzbinu/{idZahteva}")]
        public async Task<IActionResult> OdobriPorudzbinu(int idZahteva)
        {
            try
            {
                var zahtevizaketering = await Context.ZahteviZaKetering
                                                                .Include(i => i.Agencija)
                                                                .Include(i => i.ZakupljeniMeniji)
                                                                .Include(i => i.ZakupljeniOglas)
                                                                .FirstOrDefaultAsync(x => x.Id == idZahteva);

                if (zahtevizaketering == null)
                {
                    return BadRequest("Ovaj zahtev nija validan");
                }

                if (zahtevizaketering.StatusRezervacije == null)
                {
                    zahtevizaketering.StatusRezervacije = true;
                }
                else if(zahtevizaketering.StatusRezervacije == false){
                    return BadRequest("Porudzbina je vec odbijena");
                }
                
                await Context.SaveChangesAsync();

                ZahtevZaKeteringResult result = ObjectCreatorSingleton.Instance.ToZahtevZaKeteringResult(zahtevizaketering);

                

                return Ok(result);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        #endregion

        #region  OdbijanjePorudzbine
        [HttpGet("OdbijanjePorudzbine/{idZahteva}")]
        public async Task<IActionResult> OdbijanjePorudzbine(int idZahteva)
        {
            try
            {
                var zahtevizaketering = await Context.ZahteviZaKetering
                                                                .Include(i => i.Agencija)
                                                                .Include(i => i.ZakupljeniOglas)
                                                                .Include(i => i.ZakupljeniMeniji)
                                                                .IgnoreQueryFilters()
                                                                .FirstOrDefaultAsync(x => x.Id == idZahteva);

                if (zahtevizaketering == null)
                {
                    return BadRequest("Zahtev nije validan");
                }

                zahtevizaketering.ZakupljeniOglas = null;

                zahtevizaketering.StatusRezervacije = false;
                //Promena ideje
                //Context.ZahteviZaKetering.Remove(zahtevizaketering);
                await Context.SaveChangesAsync();

                ZahtevZaKeteringResult result = ObjectCreatorSingleton.Instance.ToZahtevZaKeteringResult(zahtevizaketering);

                

                return Ok(result);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        #endregion

        #region AzurirajAgenciju

        [HttpPut("AzurirajAgenciju")]
        public async Task<ActionResult> AzurirajAgenciju([FromBody] AgencijaBasic agencija)
        {
            try
            {
                int idAgencije = int.Parse((HttpContext.Items["idAgencije"] as string)!);

                Agencija? pronadjenaAgencija = await Context.Agencije.FindAsync(idAgencije);

                if (pronadjenaAgencija == null)
                {
                    return BadRequest("Ne postoji agencija sa tim id-jem");
                }

                pronadjenaAgencija.Ime = agencija.ime;
                pronadjenaAgencija.Email = agencija.email;
                pronadjenaAgencija.BrTel = agencija.brTel;
                pronadjenaAgencija.SlikaProfila = agencija.slikaProfila;
                pronadjenaAgencija.Lokacija = agencija.lokacija;
                pronadjenaAgencija.Opis = agencija.opis;
                pronadjenaAgencija.MogucnostDostave = agencija.mogucnostDostave;
                pronadjenaAgencija.CenaDostave = agencija.cenaDostave;

                await Context.SaveChangesAsync();
                return Ok(pronadjenaAgencija);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        #endregion

        #region AzurirajKategoriju

        [HttpPut("AzurirajKategoriju")]
        public async Task<ActionResult> AzurirajKategoriju([FromBody] Kategorija kategorija)
        {
            try
            {
                // TODO: treba da se izmeni
                int idAgencije = int.Parse((HttpContext.Items["idAgencije"] as string)!);

                var kategorijaMenija = await Context.Kategorije.Where(w => w.Agencija!.Id == idAgencije).FirstOrDefaultAsync(f => f.Id == kategorija.Id);

                if (kategorijaMenija == null)
                {
                    return NotFound("ne postoji ta kategorija ili ti nisi vlasnik kategorije");
                }

                kategorijaMenija.Naziv = kategorija.Naziv;

                await Context.SaveChangesAsync();
                return Ok(new { kategorijaMenija });


            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        #endregion

        // [HttpPost("uploadAgencije")]
        // public async Task<IActionResult> UploadSlikaAgencije(IFormFile file)
        // {
        //     int idAgencije = int.Parse((HttpContext.Items["idAgencije"] as string)!);

        //     var agencija = await Context.Agencije.FindAsync(idAgencije);
        //     if (agencija == null)
        //     {
        //         return NotFound("Agencija nije pronađen.");
        //     }

        //     if (file == null || file.Length == 0)
        //     {
        //         return BadRequest("Nijedna slika nije poslata.");
        //     }

        //     var folderPath = Path.Combine("wwwroot", "images", "Agencija", idAgencije.ToString());
        //     if (!Directory.Exists(folderPath))
        //     {
        //         Directory.CreateDirectory(folderPath);
        //     }

        //     var files = Directory.GetFiles(folderPath);
        //     var fileCount = files.Length;

        //     var fileName = $"s{fileCount + 1}{Path.GetExtension(file.FileName)}";
        //     var filePath = Path.Combine(folderPath, fileName);

        //     using (var image = Image.Load(file.OpenReadStream()))
        //     {
        //         // Konvertuj sliku u JPG format
        //         image.Save(filePath, new JpegEncoder());
        //     }

        //     var relativePath = Path.Combine("images", "Agencija", idAgencije.ToString(), fileName).Replace("\\", "/");


        //     agencija.SlikaProfila = (relativePath);
        //     await Context.SaveChangesAsync();

        //     return Ok(new { Putanja = relativePath });
        // }

        [HttpPut("AzurirajSlikuAgencije")]
        public async Task<ActionResult> AzurirajSlikuAgencije(IFormFile file)
        {
            try
            {
                int idAgencije = int.Parse((HttpContext.Items["idAgencije"] as string)!);

                var agencija = await Context.Agencije.FindAsync(idAgencije);
                if (agencija == null)
                {
                    return NotFound("Agencija nije pronađen.");
                }

                if (file == null || file.Length == 0)
                {
                    return BadRequest("Nijedna slika nije poslata.");
                }

                var folderPath = Path.Combine("wwwroot", "images", "Agencija", idAgencije.ToString());
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

                var relativePath = Path.Combine("images", "Agencija", idAgencije.ToString(), fileName).Replace("\\", "/");

                agencija.SlikaProfila = relativePath;
                await Context.SaveChangesAsync();

                return Ok(new { Putanja = relativePath });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        #region UploadujSlikuMenija

        [HttpPost("UploadujSlikuMenija/{idmenija}")]
        public async Task<IActionResult> UploadujSlikuMenija(int idmenija, IFormFile file)
        {

            // TODO: proveri da li je oglas od logovane agencije
            int idAgencije = int.Parse((HttpContext.Items["idAgencije"] as string)!);

            var agencija = await Context.Agencije.FindAsync(idAgencije);
            if (agencija == null)
            {
                return NotFound("Agencija nije pronađen.");
            }


            var meni = await Context.MenijiKeteringa.Include(i => i.Kategorija).ThenInclude(t => t!.Agencija).Where(w => w.Kategorija!.Agencija!.Id == idAgencije).FirstOrDefaultAsync(f => f.Id == idmenija);

            if (meni == null)
            {
                return NotFound("Meni nije pronađen.");
            }

            if (file == null || file.Length == 0)
            {
                return BadRequest("Nijedna slika nije poslata.");
            }

            var folderPath = Path.Combine("wwwroot", "images", "Meniji", idmenija.ToString());
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

            var relativePath = Path.Combine("images", "Meniji", idmenija.ToString(), fileName).Replace("\\", "/");


            meni.Slika = relativePath;
            await Context.SaveChangesAsync();

            return Ok(new { Putanja = relativePath });
        }

        #endregion
        //vrati kategorije i menije za neku agenciju(idagencije)







    }



    //prikaz svih agencija

    //sortiranje i filteri





}
