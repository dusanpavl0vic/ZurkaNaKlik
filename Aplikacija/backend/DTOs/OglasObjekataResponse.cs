using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json.Serialization;

namespace backend.Models
{
    public class OglasObjektaResponse
    {
        public int id { get; set; }
        public required List<EnumTipProslava> listaTipProslava { get; set; }
        public required List<EnumTipProstora> listaTipProstora { get; set; }
        public required string naziv { get; set; }
        public required string grad { get; set; }
        public required string lokacija { get; set; }
        public required int cenaPoDanu { get; set; }
        public required int brojSoba { get; set; }
        public required int kvadratura { get; set; }
        public required int brojKreveta { get; set; }
        public required int brojKupatila { get; set; }
        public required EnumGrejanje grejanje { get; set; }
        public required List<EnumDodatnaOprema> listDodatneOpreme { get; set; }
        public required string brTel { get; set; }
        public required string opis { get; set; }
        public required List<string> slike { get; set; }
        public double? ocena { get; set; }
        public int brojOcena { get; set; }
        public List<DateTime>? zauzetiDani { get; set; }
        public int? idVlasnika { get; set; }
    }
}