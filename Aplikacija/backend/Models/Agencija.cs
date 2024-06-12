using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace backend.Models
{
    public class Agencija : KorisnikAgencija
    {
        public string? Opis { get; set; }
        [Range(0, 5)]
        public int? Ocena { get; set; }
        public bool MogucnostDostave { get; set; } //true = hoce dostavu ili false nece
        public int CenaDostave { get; set; } //fiksna cena dostave ako je ovo gore true
        public int BrojOcena { get; set; } = 0;
        [JsonIgnore]
        public List<Kategorija>? KategorijeMenija { get; set; } //slatko/slano/posno
        [JsonIgnore]
        public List<ZahtevZaKetering>? ListaZahtevZaKetering { get; set; }

    }
}