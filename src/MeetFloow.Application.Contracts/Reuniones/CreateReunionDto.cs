using System;
using System.ComponentModel.DataAnnotations;
using MeetFloow.Reuniones;

namespace MeetFloow.Reuniones;

public class CreateReunionDto
{
    [Required]
    [StringLength(256)]
    public string Titulo { get; set; } = string.Empty;

    [StringLength(2000)]
    public string Descripcion { get; set; } = string.Empty;

    [Required]
    public DateTime FechaHora { get; set; }

    public int DuracionMinutos { get; set; } = 60;

    [StringLength(500)]
    public string Ubicacion { get; set; } = string.Empty;

    public EstadoReunion Estado { get; set; } = EstadoReunion.Pendiente;

    [StringLength(100)]
    public string? NombreAnfitrion { get; set; }
}
