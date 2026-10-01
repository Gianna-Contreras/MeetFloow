using System.Threading.Tasks;
using Volo.Abp.Application.Services;

namespace MeetFloow.Reuniones;

public interface IPerfilAppService : IApplicationService
{
    Task<PerfilDto> GetAsync();
    Task UpdateFotoAsync(string fotoPerfil);
}
