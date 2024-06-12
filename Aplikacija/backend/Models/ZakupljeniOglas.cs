using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace backend.Models
{
    public class ZakupljeniOglas
    {
        [Key]
        public int Id { get; set; }
        [JsonIgnore]
        public OglasObjekta? Oglas { get; set; }
        [JsonIgnore]
        public Korisnik? Korisnik { get; set; }
        public DateTime DatumZakupa { get; set; }
        public DateTime ZakupljenOd { get; set; }
        public DateTime ZakupljenDo { get; set; }
        public int Cena { get; set; }

        [ForeignKey("ZakupljeniOglas")]
        [JsonIgnore]
        public ZahtevZaKetering? ZahtevZaKetering { get; set; }


    }
}