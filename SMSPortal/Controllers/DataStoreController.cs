using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SMSData.DB;
using SMSData.Repository.Auth;
using SMSData.Repository.Utility;
using System.Data.SqlClient;

namespace SMSPortal.Controllers
{
    [Authorize]
    public class DataStoreController : Controller
    {
        private readonly DataStoreRepository _dataStoreRepo;

        public DataStoreController(DataStoreRepository dataStoreRepo)
        { 
            _dataStoreRepo = dataStoreRepo; 
        }

        public async Task<IActionResult> GetData(string name, string searchKey, int take, int skip, int? id, int? parentId = null) {
            var data = await _dataStoreRepo.GetData(name, searchKey, take ==0 ? 10 : take, skip, id, parentId);
            return Ok(data);
        }
    }
}
