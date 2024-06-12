using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace backend.Models
{
    public class MeniKeteringa
    {
        [Key]
        public int Id { get; set; }
        public required string Naziv { get; set; }// Novogodisnji/Koktel/Svesdki/Silver itd

        public required int CenaMenija { get; set; } //po kg
    
        public string? Slika { get; set; }

        public required string Opis { get; set; }

        // public int KolicinaUKG { get; set; } //?

        public required List<string> SastavMenija {get; set; }// pecivo, cevapi

        [JsonIgnore]
        public  Kategorija? Kategorija { get; set; }//Slatko/slano

        [JsonIgnore]
        public List<ZahtevZaKetering>? ListaZahetevaZaKetering { get; set; }
    }

    
}