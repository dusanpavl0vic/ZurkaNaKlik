using System.Text.Json.Serialization;

namespace backend.Models
{
    public class KategorijaResult
    {
        public int id { get; set;}
        public required string naziv { get; set;} 
        public int? idAgencije  {get; set;}  
    }
}