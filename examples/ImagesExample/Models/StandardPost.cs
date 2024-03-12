using Piranha.AttributeBuilder;
using Piranha.Models;

namespace ImagesExample.Models
{
    [PostType(Title = "Standard post")]
    public class StandardPost : Post<StandardPost>
    {
    }
}