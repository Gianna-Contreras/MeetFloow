using System.Collections.Generic;
using System.Linq;
using Riok.Mapperly.Abstractions;
using Volo.Abp.Mapperly;
using MeetFloow.Reuniones;

namespace MeetFloow;

[Mapper]
public partial class MeetFloowApplicationMappers
{
    public partial ReunionDto Map(Reunion source);
    public partial void Map(CreateReunionDto source, Reunion destination);

    public List<ReunionDto> MapList(List<Reunion> source)
    {
        return source.Select(Map).ToList();
    }
}
