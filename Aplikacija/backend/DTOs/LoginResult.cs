using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.DTOs
{
    public class LoginResult
    {
        public int id { get; set; }
        public required string name { get; set; }
        public required string email { get; set; }
        public required string phoneNumber { get; set; }
        public required Roles role { get; set; }
    }
}