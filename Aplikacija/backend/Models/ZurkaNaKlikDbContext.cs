namespace WebTemplate.Models;

public class ZurkaNaKlikDbContext : DbContext
{
    public DbSet<KorisnikAgencija> KorisniciAgencije { get; set; }
    public DbSet<Korisnik> Korisnici { get; set; }
    public DbSet<Agencija> Agencije { get; set; }
    public DbSet<OglasObjekta> OglasiObjekta { get; set; }
    public DbSet<ZahtevZaKetering> ZahteviZaKetering { get; set; }
    public DbSet<MeniKeteringa> MenijiKeteringa { get; set; }
    public DbSet<ZakupljeniOglas> ZakupljeniOglasi { get; set; }
    public DbSet<Kategorija> Kategorije { get; set; }



    public ZurkaNaKlikDbContext(DbContextOptions options) : base(options)
    {
        // var discriminatorForKorisnik = .Set<KorisnikAgencija>()
        // .Where(ka => ka.GetType() == typeof(Korisnik))
        // .Select(ka => EF.Property<string>(ka, "Discriminator"))
        // .FirstOrDefault();

        // var discriminatorForAgencija = context.Set<KorisnikAgencija>()
        //     .Where(ka => ka.GetType() == typeof(Agencija))
        //     .Select(ka => EF.Property<string>(ka, "Discriminator"))
        //     .FirstOrDefault();
    }

     
}
