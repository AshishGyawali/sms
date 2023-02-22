using Microsoft.AspNetCore.Mvc;
using SMSData.DB;
using SMSData.Repository.Auth;
using SMSData.Repository.Utility;
using System.Data.SqlClient;

namespace SMSPortal.Controllers
{
    public class DataStoreController : Controller
    {
        private readonly DataStoreRepository _dataStoreRepo;

        public DataStoreController(DataStoreRepository dataStoreRepo)
        { 
            _dataStoreRepo = dataStoreRepo; 
        }

        public async Task<IActionResult> GetData(string name, string searchKey, int take, int skip, int? id) {
            var data = await _dataStoreRepo.GetData(name, searchKey, take, skip, id);
            return Ok(data);
        }
    }
}
