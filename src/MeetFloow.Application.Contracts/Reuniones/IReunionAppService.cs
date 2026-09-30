using System;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace MeetFloow.Reuniones;

public interface IReunionAppService : IApplicationService
{
    Task<PagedResultDto<ReunionDto>> GetListAsync(PagedAndSortedResultRequestDto input);
    Task<ReunionDto> GetAsync(Guid id);
    Task<ReunionDto> CreateAsync(CreateReunionDto input);
    Task<ReunionDto> UpdateAsync(Guid id, CreateReunionDto input);
    Task DeleteAsync(Guid id);
}
