using System;
using Volo.Abp.Domain.Entities.Auditing;

namespace MeetFloow.Reuniones;

public class InvitacionReunion : CreationAuditedEntity<Guid>
{
    public Guid ReunionId { get; set; }
    public Guid UsuarioInvitadoId { get; set; }
    public EstadoInvitacion Estado { get; set; }

    public virtual Reunion? Reunion { get; set; }

    protected InvitacionReunion() { }

    public InvitacionReunion(Guid id, Guid reunionId, Guid usuarioInvitadoId) : base(id)
    {
        ReunionId = reunionId;
        UsuarioInvitadoId = usuarioInvitadoId;
        Estado = EstadoInvitacion.Pendiente;
    }
}

