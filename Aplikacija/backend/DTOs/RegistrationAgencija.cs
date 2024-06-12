using System.ComponentModel;

namespace backend.Models

{
    public class RegistrationAgencija
    {
        public required string name { get; set; }
        [EmailAddress(ErrorMessage = "Email adresa nije u ispravnom formatu.")]
        public required string email { get; set; }
        public required string phoneNumber { get; set; }
        public required string location { get; set; }
        public required string password { get; set; }
        public required string repeatPassword { get; set; }
        public Roles Role { get; set; } = Roles.Agencija;
    }
}