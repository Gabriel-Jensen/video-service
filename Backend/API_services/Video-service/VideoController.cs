using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace Controllers
{
    [ApiController]
    [Route("videos")]
    public class VideoController : ControllerBase
    {

        private readonly VideoDb _db;

        public VideoController(ILogger<VideoController> logger, VideoDb db)
        {
            _db = db;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Video>> GetVideo(long id)
        {
            var video = await _db.Videos.FindAsync(id);

            if (video == null)
            {
                return NotFound();
            }

            return Ok(video);
        }


        [HttpGet]
        [Route("allvideos")]
        public async Task<ActionResult<List<Video>>> GetAllVideos()
        {
            return await _db.Videos.ToListAsync();
        }

        [HttpGet]
        [Route("search")]
        public async Task<ActionResult<List<Video>>> GetAllVideos(string title)
        {
            return await _db.Videos.Where(x => x.Title == title).ToListAsync();
        }

        [HttpPut]
        public async Task<IResult> PutVideo(Video video1)
        {
            var video2 = await _db.Videos.FindAsync(video1.Id);

            if (video2 is null)
                return Results.NotFound();

            video2.Title = video1.Title;
            video2.Description = video1.Description;
            video2.File = video1.File;

            await _db.SaveChangesAsync();

            return Results.NoContent();
        }

        [HttpPut]
        [Route("update")]
        public async Task<IResult> PutVideo2(Video video1)
        {
            _db.Videos.Update(video1);
            await _db.SaveChangesAsync();

            return Results.NoContent();
        }

        [HttpDelete]
        public async Task<IResult> DeleteVideo(long id)
        {
            var video = await _db.Videos.FindAsync(id);

            if (video is null)
                return Results.NotFound();

            _db.Videos.Remove(video);
            await _db.SaveChangesAsync();

            return Results.Ok();
        }

        [Route("create")]
        [HttpPost]
        public async Task<IResult> PostVideo(Video video)
        {
            _db.Videos.Add(video);
            await _db.SaveChangesAsync();
            return Results.Created($"/{video.Id}", video);
        }

    }
}