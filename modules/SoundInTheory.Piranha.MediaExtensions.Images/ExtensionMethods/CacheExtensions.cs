using Piranha;
using Piranha.Cache;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SoundInTheory.Piranha.MediaExtensions.Images.ExtensionMethods
{
    public static class CacheExtensions
    {
        public static Task RemoveKeyAsync(this ICache cache, string key)
        {
            if (cache == null)
            {
                return Task.CompletedTask;
            }

#if NET8_0_OR_GREATER
            return cache?.RemoveAsync(key);
#else
            cache.Remove(key);
            return Task.CompletedTask;
#endif
        }
    }
}
