using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.VisualBasic;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Utility
{
    public static class ModelStateError
    {
        public static string GetError(this ModelStateDictionary state)
        {
            var error = state.Values.SelectMany(v => v.Errors);
            return string.Join(",", error);
        }
    }
}
