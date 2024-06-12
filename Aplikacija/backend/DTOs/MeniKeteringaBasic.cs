using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace backend.Models
{
    public class MeniKeteringaBasic
    {
        public required string naziv { get; set; }
        public required int cenaMenija { get; set; }
        public string? slika { get; set; }
        public required string opis { get; set; }
        public required List<string> sastavMenija { get; set; }
    }
}