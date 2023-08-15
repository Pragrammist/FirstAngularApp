using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ang_app.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class FileController : Controller
    {
        [HttpPost("goals")]
        [Authorize]
        public IActionResult UploadGoalsFiles(IEnumerable<IFormFile> files)
        {
            return Ok(UploadFiles(files, "GoalsFiles"));
        }
        [HttpPost("achievments")]
        [Authorize]
        public IActionResult UploadAchievmentsFiles(IEnumerable<IFormFile> files)
        {   
            return Ok(UploadFiles(files, "AchievmentsFiles"));
        }

        IEnumerable<string> UploadFiles(IEnumerable<IFormFile> files, string folder) => files.Select(s => {
                using var fStream = s.OpenReadStream();
                using var wrStream = System.IO.File.OpenWrite(Path.Combine(folder, s.FileName));
                fStream.CopyTo(wrStream);
                return s.FileName;
            });
    }
}
