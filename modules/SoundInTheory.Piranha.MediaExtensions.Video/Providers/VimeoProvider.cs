﻿using SoundInTheory.Piranha.MediaExtensions.Video.Interface;
using SoundInTheory.Piranha.MediaExtensions.Video.Models;
using System.Text.Json;
using System.Text.RegularExpressions;

namespace SoundInTheory.Piranha.MediaExtensions.Video.Providers
{
    public class VimeoProvider : IVideoProvider
    {
        public async Task<VideoDetails> GetDetails(string ID)
        {
            using (var httpClient = new HttpClient()) // Create an instance of HttpClient
            {
                string url = $"https://vimeo.com/api/oembed.json?url=https://vimeo.com/{ID}";

                HttpResponseMessage response = await httpClient.GetAsync(url);
                if (!response.IsSuccessStatusCode)
                {
                    throw new Exception("Failed to fetch Vimeo video info.");
                }

                var jsonResponse = JsonSerializer.Deserialize<OEmbedResponse>(await response.Content.ReadAsStringAsync());

                // Deserialize the JSON response into the OEmbed class
                return new VideoDetails(jsonResponse, ID,"vimeo");
            }
        }

        public string MatchAndReturnID(string input)
        {
            // Regular expression to extract Vimeo video ID
            var regex = new Regex(@"(?:vimeo\.com\/(?:.*\/)?)(\d+)|^(\d+)$");
            var match = regex.Match(input);

            // Check if the match was successful
            if (match.Success)
            {
                return match.Groups[1].Success ? match.Groups[1].Value : match.Groups[2].Value;
            }

            // Return null if no match is found
            return null;
        }
    }
}
