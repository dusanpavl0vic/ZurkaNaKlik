using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace backend.Models
{
    public class AgencijaBasic
    {
        public int id { get; set; }
        public required string ime { get; set; }
        public required string email { get; set; }
        public required string brTel { get; set; }
        public string? opis { get; set; }
        public required string lokacija { get; set; }
        public int? ocena { get; set; }
        public bool mogucnostDostave { get; set; }
        public int cenaDostave { get; set; }
        public int brojOcena { get; set; } = 0;
        public string? slikaProfila { get; set; }
    }
}

