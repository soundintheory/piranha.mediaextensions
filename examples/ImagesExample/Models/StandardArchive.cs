using Piranha.AttributeBuilder;
using Piranha.Models;

namespace ImagesExample.Models
{
    [PageType(Title = "Standard archive", IsArchive = true)]
    public class StandardArchive : Page<StandardArchive>
    {
    }
}