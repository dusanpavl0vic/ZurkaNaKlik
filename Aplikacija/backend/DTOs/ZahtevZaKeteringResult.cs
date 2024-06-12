using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Routing.Patterns;

namespace backend.Models
{
    public class ZahtevZaKeteringResult
    {
        public int id { get; set; }
        public int konacnaCena { get; set; }
        public bool? statusRezervacije { get; set; }
        public DateTime datumRezervacije { get; set; }
        public int? idOglasa { get; set; }
        public List<int>? idMenija { get; set; }
        public int? idAgencije { get; set; }
    }
}