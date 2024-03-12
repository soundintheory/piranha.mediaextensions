using Piranha.Extend.Fields;
using Piranha.Extend;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using SoundInTheory.Piranha.MediaExtensions.Images.Fields;

namespace SoundInTheory.Piranha.Media.Images.Serializers
{
    public class CroppedImageFieldSerializer : ISerializer
    {
        /// <summary>
        /// Serializes the given object.
        /// </summary>
        /// <param name="obj">The object</param>
        /// <returns>The serialized value</returns>
        public string Serialize(object obj)
        {
            return JsonConvert.SerializeObject(obj);
        }

        /// <summary>
        /// Deserializes the given string.
        /// </summary>
        /// <param name="str">The serialized value</param>
        /// <returns>The object</returns>
        public object Deserialize(string str)
        {
            if (string.IsNullOrEmpty(str))
            {
                return new CroppedImageField();
            }

            if (Guid.TryParse(str, out Guid id))
            {
                return new CroppedImageField
                {
                    Id = id
                };
            }

            return JsonConvert.DeserializeObject<CroppedImageField>(str); 
        }
    }
}
