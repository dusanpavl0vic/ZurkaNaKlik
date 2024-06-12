using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace backend.Models
{
    public class KorisnikAgencija
    {
        [Key]
        public int Id { get; set; }
        public required string Ime { get; set; }
        [EmailAddress(ErrorMessage = "Email adresa nije u ispravnom formatu.")]
        public required string Email { get; set; }
        [RegularExpression(@"^\+381 \d{9}$")]
        public required string BrTel { get; set; }
        public required string LozinkaHash { get; set; }
        public Roles Role { get; set; }
        public string? SlikaProfila { get; set; }
        public required string Lokacija { get; set; }

        public string RefreshToken { get; set; } = string.Empty;

        public DateTime TokenCreated { get; set; }
        public DateTime TokenExpires { get; set; }
    }
}