using System;
using Volo.Abp.Domain.Entities.Auditing;

namespace MeetFloow.Reuniones;

public class SolicitudIngreso : CreationAuditedEntity<Guid>
{
    public Guid ReunionId { get; set; }
    public Guid UsuarioId { get; set; }
    public EstadoSolicitud Estado { get; set; }
    public Guid? RespondidoPorId { get; set; }

    public virtual Reunion? Reunion { get; set; }

    protected SolicitudIngreso() { }

    public SolicitudIngreso(Guid id, Guid reunionId, Guid usuarioId) : base(id)
    {
        ReunionId = reunionId;
        UsuarioId = usuarioId;
        Estado = EstadoSolicitud.Pendiente;
    }
}

