using System;
using Volo.Abp.Domain.Entities.Auditing;

namespace MeetFloow.Reuniones;

public class Mensaje : CreationAuditedEntity<Guid>
{
    public Guid ReunionId { get; set; }
    public Guid UsuarioId { get; set; }
    public string Contenido { get; set; } = string.Empty;

    public virtual Reunion? Reunion { get; set; }

    protected Mensaje() { }

    public Mensaje(Guid id, Guid reunionId, Guid usuarioId, string contenido) : base(id)
    {
        ReunionId = reunionId;
        UsuarioId = usuarioId;
        Contenido = contenido;
    }
}

