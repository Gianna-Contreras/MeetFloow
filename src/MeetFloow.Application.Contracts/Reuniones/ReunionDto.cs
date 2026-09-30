using System;
using MeetFloow.Reuniones;
using Volo.Abp.Application.Dtos;

namespace MeetFloow.Reuniones;

public class ReunionDto : AuditedEntityDto<Guid>
{
    public string Titulo { get; set; } = string.Empty;
    public string Descripcion { get; set; } = string.Empty;
    public DateTime FechaHora { get; set; }
    public int DuracionMinutos { get; set; }
    public string Ubicacion { get; set; } = string.Empty;
    public EstadoReunion Estado { get; set; }
    public Guid AnfitrionId { get; set; }
    public string? AnfitrionNombre { get; set; }
}
