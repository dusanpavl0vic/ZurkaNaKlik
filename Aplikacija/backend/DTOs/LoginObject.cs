using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.DTOs
{
    public class LoginObject
    {
        public required int Id { get; set; }
        public Roles Role { get; set; }
        public DateTime? CurrentTime { get; set; }
    }
}