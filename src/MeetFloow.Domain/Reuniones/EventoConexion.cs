using System;
using Volo.Abp.Domain.Entities.Auditing;

namespace MeetFloow.Reuniones;

public class EventoConexion : CreationAuditedEntity<Guid>
{
    public Guid ReunionId { get; set; }
    public Guid UsuarioId { get; set; }
    public TipoEventoConexion TipoEvento { get; set; }

    public virtual Reunion? Reunion { get; set; }

    protected EventoConexion() { }

    public EventoConexion(Guid id, Guid reunionId, Guid usuarioId, TipoEventoConexion tipoEvento) : base(id)
    {
        ReunionId = reunionId;
        UsuarioId = usuarioId;
        TipoEvento = tipoEvento;
    }
}

