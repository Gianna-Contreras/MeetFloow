using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MeetFloow.Reuniones;
using Volo.Abp;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Identity;

namespace MeetFloow.Reuniones;

public class ReunionAppService : ApplicationService,
    IReunionAppService
{
    private readonly IRepository<Reunion, Guid> _reunionRepository;
    private readonly IIdentityUserRepository _userRepository;

    public ReunionAppService(
        IRepository<Reunion, Guid> reunionRepository,
        IIdentityUserRepository userRepository)
    {
        _reunionRepository = reunionRepository;
        _userRepository = userRepository;
    }

    public async Task<PagedResultDto<ReunionDto>> GetListAsync(PagedAndSortedResultRequestDto input)
    {
        var queryable = await _reunionRepository.GetQueryableAsync();

        var totalCount = queryable.Count();

        var reuniones = queryable
            .OrderByDescending(x => x.CreationTime)
            .Skip(input.SkipCount)
            .Take(input.MaxResultCount)
            .ToList();

        var reunionDtos = reuniones.Select(MapToDto).ToList();

        var userIds = reunionDtos.Select(r => r.AnfitrionId).Distinct().ToList();
        var users = new List<IdentityUser>();
        foreach (var userId in userIds)
        {
            var user = await _userRepository.FindAsync(userId);
            if (user != null)
            {
                users.Add(user);
            }
        }

        foreach (var dto in reunionDtos)
        {
            var user = users.FirstOrDefault(u => u.Id == dto.AnfitrionId);
            dto.AnfitrionNombre = user?.Name ?? user?.UserName ?? "Desconocido";
        }

        return new PagedResultDto<ReunionDto>(totalCount, reunionDtos);
    }

    public async Task<ReunionDto> GetAsync(Guid id)
    {
        var reunion = await _reunionRepository.GetAsync(id);
        var dto = MapToDto(reunion);

        var user = await _userRepository.GetAsync(dto.AnfitrionId);
        dto.AnfitrionNombre = user?.Name ?? user?.UserName ?? "Desconocido";

        return dto;
    }

    public async Task<ReunionDto> CreateAsync(CreateReunionDto input)
    {
        var reunion = new Reunion(
            GuidGenerator.Create(),
            input.Titulo,
            CurrentUser.Id ?? Guid.Empty
        )
        {
            Descripcion = input.Descripcion,
            FechaHora = input.FechaHora,
            DuracionMinutos = input.DuracionMinutos,
            Ubicacion = input.Ubicacion,
            Estado = input.Estado,
            NombreAnfitrion = input.NombreAnfitrion ?? "Usuario"
        };

        await _reunionRepository.InsertAsync(reunion);

        return MapToDto(reunion);
    }

    public async Task<ReunionDto> UpdateAsync(Guid id, CreateReunionDto input)
    {
        var reunion = await _reunionRepository.GetAsync(id);

        reunion.Titulo = input.Titulo;
        reunion.Descripcion = input.Descripcion;
        reunion.FechaHora = input.FechaHora;
        reunion.DuracionMinutos = input.DuracionMinutos;
        reunion.Ubicacion = input.Ubicacion;
        reunion.Estado = input.Estado;
        reunion.ParticipantesNombres = input.Participantes ?? new List<string>();

        await _reunionRepository.UpdateAsync(reunion);

        return MapToDto(reunion);
    }

    public async Task DeleteAsync(Guid id)
    {
        await _reunionRepository.DeleteAsync(id);
    }

    public async Task<ReunionDto> FinishAsync(Guid id)
    {
        var reunion = await _reunionRepository.GetAsync(id);
        reunion.HoraFin = DateTime.Now;
        reunion.Estado = EstadoReunion.Completada;
        await _reunionRepository.UpdateAsync(reunion);
        return MapToDto(reunion);
    }

    public async Task<ReunionDto> StartAsync(Guid id)
    {
        var reunion = await _reunionRepository.GetAsync(id);
        reunion.HoraInicio = DateTime.Now;
        reunion.Estado = EstadoReunion.EnCurso;
        await _reunionRepository.UpdateAsync(reunion);
        return MapToDto(reunion);
    }

    private static ReunionDto MapToDto(Reunion reunion)
    {
        return new ReunionDto
        {
            Id = reunion.Id,
            Titulo = reunion.Titulo,
            Descripcion = reunion.Descripcion,
            FechaHora = reunion.FechaHora,
            DuracionMinutos = reunion.DuracionMinutos,
            Ubicacion = reunion.Ubicacion,
            Estado = reunion.Estado,
            AnfitrionId = reunion.AnfitrionId,
            NombreAnfitrion = reunion.NombreAnfitrion,
            HoraInicio = reunion.HoraInicio,
            HoraFin = reunion.HoraFin,
            Participantes = reunion.ParticipantesNombres,
            CreationTime = reunion.CreationTime
        };
    }
}
