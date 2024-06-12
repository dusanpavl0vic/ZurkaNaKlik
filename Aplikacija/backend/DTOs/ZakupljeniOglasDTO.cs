using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.DTOs
{
    public class ZakupljeniOglasDTO
    {
        public int id { get; set; }
        public int? oglasId { get; set; }
        public int? korisnikId { get; set; }
        public DateTime datumZakupa { get; set; }
        public DateTime zakupljenOd { get; set; }
        public DateTime zakupljenDo { get; set; }
        public int? cenaOglasa { get; set; }
        public bool? statusZahtevaZaKetering { get; set; }
        public int idAgencije { get; set; }
        public int cenaKeteringa { get; set; }
        //public bool dostavaDaNe { get; set; }
        public int idZakupljeniKetering { get; set; }
    }
}