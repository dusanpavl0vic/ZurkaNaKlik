using System.ComponentModel;

namespace backend.Models

{
    public class VratiMenijeResultElement
    {
        public int id { get; set; }
        public string naziv { get; set; }
        public List<MeniKeteringaResult>? meniKeteringa { get; set; }

        public VratiMenijeResultElement(int id, string naziv){
            this.id = id;
            this.naziv = naziv;
        }
    }
}