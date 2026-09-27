using System;
using Volo.Abp.Domain.Entities.Auditing;

namespace MeetFloow.Reuniones;

public class ParticipanteReunion : CreationAuditedEntity<Guid>
{
    public Guid ReunionId { get; set; }
    public Guid UsuarioId { get; set; }
    public RolParticipante Rol { get; set; }

    public virtual Reunion? Reunion { get; set; }

    protected ParticipanteReunion() { }

    public ParticipanteReunion(Guid id, Guid reunionId, Guid usuarioId, RolParticipante rol) : base(id)
    {
        ReunionId = reunionId;
        UsuarioId = usuarioId;
        Rol = rol;
    }
}

