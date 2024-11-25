using SoundInTheory.Piranha.MediaExtensions.Video.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SoundInTheory.Piranha.MediaExtensions.Video.Interface
{
    public interface IVideoProvider
    {
        string MatchAndReturnID(string input);

        Task<VideoDetails> GetDetails(string ID);

    }
}
