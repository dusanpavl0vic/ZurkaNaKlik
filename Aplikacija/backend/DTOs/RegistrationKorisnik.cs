using System.ComponentModel;

namespace backend.Models

{
    public class RegistrationKorisnik
    {
        public required string name { get; set; }
        public required string lastName { get; set; }
        [EmailAddress(ErrorMessage = "Email adresa nije u ispravnom formatu.")]
        public required string email { get; set; }
        public required string phoneNumber { get; set; }
        public required string password { get; set; }
        public required string repeatPassword { get; set; }
        public Roles role { get; set; } = Roles.Korisnik;
        public required string location { get; set; }

        public static implicit operator RegistrationKorisnik(Korisnik v)
        {
            throw new NotImplementedException();
        }
    }
}