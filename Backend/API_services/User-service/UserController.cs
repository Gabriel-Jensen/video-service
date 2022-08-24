using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace Controllers
{
    [ApiController]
    [Route("users")]
    public class UserController : ControllerBase
    {

        private readonly UserDb _db;

        public UserController(ILogger<UserController> logger, UserDb db)
        {
            _db = db;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(long id)
        {
            var user = await _db.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }


        [HttpGet]
        [Route("allusers")]
        public async Task<ActionResult<List<User>>> GetAllUsers()
        {
            return await _db.Users.ToListAsync();
        }

        [HttpGet]
        [Route("search")]
        public async Task<ActionResult<List<User>>> GetAllUsers(string username)
        {
            return await _db.Users.Where(x => x.Username == username).ToListAsync();
        }

        [HttpPut]
        public async Task<IResult> PutUser(User user1)
        {
            var user2 = await _db.Users.FindAsync(user1.Id);

            if (user2 is null)
                return Results.NotFound();

            user2.Username = user1.Username;
            user2.Password = user1.Password;

            await _db.SaveChangesAsync();

            return Results.NoContent();
        }

        [HttpPut]
        [Route("update")]
        public async Task<IResult> PutUser2(User user1)
        {
            _db.Users.Update(user1);
            await _db.SaveChangesAsync();

            return Results.NoContent();
        }

        [HttpDelete]
        public async Task<IResult> DeleteUser(long id)
        {
            var user = await _db.Users.FindAsync(id);

            if (user is null)
                return Results.NotFound();

            _db.Users.Remove(user);
            await _db.SaveChangesAsync();

            return Results.Ok();
        }

        [Route("create")]
        [HttpPost]
        public async Task<IResult> PostUser(User user)
        {
            _db.Users.Add(user);
            await _db.SaveChangesAsync();
            return Results.Created($"/{user.Id}", user);
        }

    }
}