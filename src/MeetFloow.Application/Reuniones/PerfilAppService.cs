using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Volo.Abp.Application.Services;

namespace MeetFloow.Reuniones;

public class PerfilAppService : ApplicationService, IPerfilAppService
{
    private static string _fotoPerfil = "https://api.dicebear.com/7.x/avataaars/svg?seed=Gianna&backgroundColor=b6e3f4";

    public Task<PerfilDto> GetAsync()
    {
        return Task.FromResult(new PerfilDto
        {
            FotoPerfil = _fotoPerfil,
            NombreCompleto = "Gianna Contreras",
            CorreoElectronico = "gianna.contreras@meetflow.com"
        });
    }

    public Task UpdateFotoAsync(string fotoPerfil)
    {
        _fotoPerfil = fotoPerfil;
        return Task.CompletedTask;
    }
}
