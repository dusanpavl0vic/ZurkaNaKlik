using System.ComponentModel;
using System.Text.Json.Serialization;

namespace backend.Models
{
    public class Korisnik : KorisnikAgencija
    {

        public required string Prezime { get; set; }

        [InverseProperty("VlasnikOglasa")]

        [JsonIgnore]
        public List<OglasObjekta>? ListaObjavljenihOglasaObjekta { get; set; }

        [InverseProperty("ListaKorisnikaOmiljeniOglas")]

        [JsonIgnore]
        public List<OglasObjekta>? ListaOmiljenihOglasaObjekata { get; set; }

        [JsonIgnore]
        public List<ZakupljeniOglas>? ListaZakupljenihOglasa { get; set; }

    }
}