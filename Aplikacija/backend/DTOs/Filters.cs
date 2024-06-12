using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.DTOs
{
    public class Filters
    {
        public List<EnumTipProslava>? tipProslava { get; set; }
        public List<EnumTipProstora>? tipProstora { get; set; }
        public string? grad { get; set; }
        public int? cenaOd { get; set; }
        public int? cenaDo { get; set; }
        public int? kvadraturaOd { get; set; }
        public int? kvadraturaDo { get; set; }
        public List<EnumGrejanje>? grejanje { get; set; }
        public List<EnumDodatnaOprema>? dodatnaOprema { get; set; }
        public DateTime datumOd { get; set; }
        public DateTime datumDo { get; set; }
    }
}