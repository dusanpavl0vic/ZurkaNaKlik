using System.Text.Json.Serialization;

namespace backend.Models
{
    public class Kategorija
    {
        [Key]
        public int Id { get; set;}
        public required string Naziv { get; set;} //Slatko/slano/posno

    
        [JsonIgnore]
        public List<MeniKeteringa>? ListaMenija { get; set; }  

        [JsonIgnore]
        public Agencija? Agencija  {get; set;}  
    }
}