using System.ComponentModel;

namespace backend.Models

{
    public class Login
    {
        [EmailAddress(ErrorMessage = "Email adresa nije u ispravnom formatu.")]
        public required string email { get; set; }
        public required string password { get; set; }
    }
}