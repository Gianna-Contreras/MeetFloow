using System;
using Volo.Abp.Domain.Entities.Auditing;

namespace MeetFloow.Reuniones;

public class ConfiguracionReunion : AuditedEntity<Guid>
{
    public Guid ReunionId { get; set; }
    public bool PermitirChat { get; set; } = true;
    public bool RequerirAprobacion { get; set; } = false;

    public virtual Reunion? Reunion { get; set; }

    protected ConfiguracionReunion() { }

    public ConfiguracionReunion(Guid id, Guid reunionId) : base(id)
    {
        ReunionId = reunionId;
    }
}

