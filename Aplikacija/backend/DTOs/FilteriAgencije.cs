using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.DTOs
{
    public class FilteriAgencije
    {
        public List<string>? listaKategorija { get; set; }
        public int? cenaDostaveOd { get; set; }
        public int? cenaDostaveDo { get; set; }
        public bool mogucnostDostave { get; set; }
        public string? grad { get; set; }
    }
}