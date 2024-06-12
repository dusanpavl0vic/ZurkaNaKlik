using System.ComponentModel;
using System.Text.Json.Serialization;

namespace backend.Models
{
    public class GetKorisnikResult
    {
        public int id { get; set; }
        public required string name { get; set; }
        public required string lastName { get; set; }
        public required string email { get; set; }
        public required string phoneNumber { get; set; }
        public Roles role { get; set; }
        public string? profilePhoto  { get; set; }
        public required string location { get; set; }
    }
}