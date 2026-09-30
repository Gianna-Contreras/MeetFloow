namespace MeetFloow.Reuniones;

public enum RolParticipante
{
    Participante = 0,
    Anfitrion = 1
}

public enum EstadoSolicitud
{
    Pendiente = 0,
    Aceptada = 1,
    Rechazada = 2
}

public enum TipoEventoConexion
{
    Conexion = 0,
    Desconexion = 1,
    Reconexion = 2
}

public enum EstadoInvitacion
{
    Pendiente = 0,
    Aceptada = 1,
    Rechazada = 2
}

public enum EstadoReunion
{
    Pendiente = 0,
    Programada = 1,
    EnCurso = 2,
    Completada = 3,
    Cancelada = 4
}
