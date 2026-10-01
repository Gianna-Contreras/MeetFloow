using System;
using System.Collections.Generic;
using Volo.Abp.Domain.Entities.Auditing;

namespace MeetFloow.Reuniones;

public class Reunion : FullAuditedAggregateRoot<Guid>
{
    public string Titulo { get; set; } = string.Empty;
    public string Descripcion { get; set; } = string.Empty;
    public DateTime FechaHora { get; set; }
    public int DuracionMinutos { get; set; } = 60;
    public string Ubicacion { get; set; } = string.Empty;
    public EstadoReunion Estado { get; set; } = EstadoReunion.Pendiente;
    public Guid AnfitrionId { get; set; }
    public string NombreAnfitrion { get; set; } = string.Empty;
    public DateTime? HoraInicio { get; set; }
    public DateTime? HoraFin { get; set; }

    // Navigation properties
    public virtual ConfiguracionReunion? Configuracion { get; set; }
    public virtual ICollection<ParticipanteReunion> Participantes { get; set; } = new List<ParticipanteReunion>();
    public virtual ICollection<SolicitudIngreso> Solicitudes { get; set; } = new List<SolicitudIngreso>();
    public virtual ICollection<Mensaje> Mensajes { get; set; } = new List<Mensaje>();
    public virtual ICollection<EventoConexion> Eventos { get; set; } = new List<EventoConexion>();
    public virtual ICollection<InvitacionReunion> Invitaciones { get; set; } = new List<InvitacionReunion>();

    protected Reunion() { }

    public Reunion(Guid id, string titulo, Guid anfitrionId) : base(id)
    {
        Titulo = titulo;
        AnfitrionId = anfitrionId;
    }
}

