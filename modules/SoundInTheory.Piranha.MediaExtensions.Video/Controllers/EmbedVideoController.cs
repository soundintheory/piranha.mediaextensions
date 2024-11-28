using Microsoft.AspNetCore.Mvc;
using SoundInTheory.Piranha.MediaExtensions.Video.Interface;
using SoundInTheory.Piranha.MediaExtensions.Video.Models;

namespace SoundInTheory.Piranha.MediaExtensions.Video.Controllers
{
    /// <summary>
    /// Video embed field controller
    /// </summary>
    [ApiExplorerSettings(IgnoreApi = true)]
    [Route("sit-mediaextensions/video")]
    public class EmbedVideoController : Controller
    {
        [Route("get-details")]
        public async Task<VideoDetails> GetDetails([FromServices] IEnumerable<IVideoProvider> providers, string input)
        {
            VideoDetails videoDetails = null;

            foreach (var prov in providers)
            {
                var videoId = prov.MatchAndReturnID(input);
                if (!string.IsNullOrEmpty(videoId))
                {
                    videoDetails = await prov.GetDetails(videoId);
                }
            }

            return videoDetails;
        }
    }
}
