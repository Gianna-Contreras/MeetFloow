using Microsoft.EntityFrameworkCore;
using Volo.Abp.AuditLogging.EntityFrameworkCore;
using Volo.Abp.BackgroundJobs.EntityFrameworkCore;
using Volo.Abp.BlobStoring.Database.EntityFrameworkCore;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.EntityFrameworkCore;
using Volo.Abp.EntityFrameworkCore.Modeling;
using Volo.Abp.FeatureManagement.EntityFrameworkCore;
using Volo.Abp.Identity;
using Volo.Abp.Identity.EntityFrameworkCore;
using Volo.Abp.PermissionManagement.EntityFrameworkCore;
using Volo.Abp.SettingManagement.EntityFrameworkCore;
using Volo.Abp.OpenIddict.EntityFrameworkCore;
using Volo.Abp.TenantManagement;
using Volo.Abp.TenantManagement.EntityFrameworkCore;

namespace MeetFloow.EntityFrameworkCore;

[ReplaceDbContext(typeof(IIdentityDbContext))]
[ReplaceDbContext(typeof(ITenantManagementDbContext))]
[ConnectionStringName("Default")]
public class MeetFloowDbContext :
    AbpDbContext<MeetFloowDbContext>,
    ITenantManagementDbContext,
    IIdentityDbContext
{
    /* Add DbSet properties for your Aggregate Roots / Entities here. */


    #region Entities from the modules

    /* Notice: We only implemented IIdentityProDbContext and ISaasDbContext
     * and replaced them for this DbContext. This allows you to perform JOIN
     * queries for the entities of these modules over the repositories easily. You
     * typically don't need that for other modules. But, if you need, you can
     * implement the DbContext interface of the needed module and use ReplaceDbContext
     * attribute just like IIdentityProDbContext and ISaasDbContext.
     *
     * More info: Replacing a DbContext of a module ensures that the related module
     * uses this DbContext on runtime. Otherwise, it will use its own DbContext class.
     */

    // Identity
    public DbSet<IdentityUser> Users { get; set; }
    public DbSet<IdentityRole> Roles { get; set; }
    public DbSet<IdentityClaimType> ClaimTypes { get; set; }
    public DbSet<OrganizationUnit> OrganizationUnits { get; set; }
    public DbSet<IdentitySecurityLog> SecurityLogs { get; set; }
    public DbSet<IdentityLinkUser> LinkUsers { get; set; }
    public DbSet<IdentityUserDelegation> UserDelegations { get; set; }
    public DbSet<IdentitySession> Sessions { get; set; }

    // Tenant Management
    public DbSet<Tenant> Tenants { get; set; }
    public DbSet<TenantConnectionString> TenantConnectionStrings { get; set; }

    // MeetFloow entities
    public DbSet<MeetFloow.Reuniones.Reunion> Reuniones { get; set; }
    public DbSet<MeetFloow.Reuniones.ParticipanteReunion> ParticipantesReunion { get; set; }
    public DbSet<MeetFloow.Reuniones.SolicitudIngreso> SolicitudesIngreso { get; set; }
    public DbSet<MeetFloow.Reuniones.Mensaje> Mensajes { get; set; }
    public DbSet<MeetFloow.Reuniones.EventoConexion> EventosConexion { get; set; }
    public DbSet<MeetFloow.Reuniones.ConfiguracionReunion> ConfiguracionesReunion { get; set; }
    public DbSet<MeetFloow.Reuniones.InvitacionReunion> InvitacionesReunion { get; set; }

    #endregion

    public MeetFloowDbContext(DbContextOptions<MeetFloowDbContext> options)
        : base(options)
    {

    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        /* Include modules to your migration db context */

        builder.ConfigurePermissionManagement();
        builder.ConfigureSettingManagement();
        builder.ConfigureBackgroundJobs();
        builder.ConfigureAuditLogging();
        builder.ConfigureFeatureManagement();
        builder.ConfigureIdentity();
        builder.ConfigureOpenIddict();
        builder.ConfigureTenantManagement();
        builder.ConfigureBlobStoring();
        
        /* Configure your own tables/entities inside here */

        builder.Entity<MeetFloow.Reuniones.Reunion>(b =>
        {
            b.ToTable(MeetFloowConsts.DbTablePrefix + "Reuniones", MeetFloowConsts.DbSchema);
            b.ConfigureByConvention(); 
            b.Property(x => x.Titulo).IsRequired().HasMaxLength(256);
            b.HasOne<IdentityUser>().WithMany().HasForeignKey(x => x.AnfitrionId).IsRequired();
        });

        builder.Entity<MeetFloow.Reuniones.ParticipanteReunion>(b =>
        {
            b.ToTable(MeetFloowConsts.DbTablePrefix + "ParticipantesReunion", MeetFloowConsts.DbSchema);
            b.ConfigureByConvention();
            b.HasOne(x => x.Reunion).WithMany(x => x.Participantes).HasForeignKey(x => x.ReunionId).IsRequired();
            b.HasOne<IdentityUser>().WithMany().HasForeignKey(x => x.UsuarioId).IsRequired();
            b.HasIndex(x => new { x.ReunionId, x.UsuarioId }).IsUnique();
        });

        builder.Entity<MeetFloow.Reuniones.SolicitudIngreso>(b =>
        {
            b.ToTable(MeetFloowConsts.DbTablePrefix + "SolicitudesIngreso", MeetFloowConsts.DbSchema);
            b.ConfigureByConvention();
            b.HasOne(x => x.Reunion).WithMany(x => x.Solicitudes).HasForeignKey(x => x.ReunionId).IsRequired();
            b.HasOne<IdentityUser>().WithMany().HasForeignKey(x => x.UsuarioId).IsRequired();
            b.HasOne<IdentityUser>().WithMany().HasForeignKey(x => x.RespondidoPorId).IsRequired(false);
        });

        builder.Entity<MeetFloow.Reuniones.Mensaje>(b =>
        {
            b.ToTable(MeetFloowConsts.DbTablePrefix + "Mensajes", MeetFloowConsts.DbSchema);
            b.ConfigureByConvention();
            b.Property(x => x.Contenido).IsRequired().HasMaxLength(2000);
            b.HasOne(x => x.Reunion).WithMany(x => x.Mensajes).HasForeignKey(x => x.ReunionId).IsRequired();
            b.HasOne<IdentityUser>().WithMany().HasForeignKey(x => x.UsuarioId).IsRequired();
        });

        builder.Entity<MeetFloow.Reuniones.EventoConexion>(b =>
        {
            b.ToTable(MeetFloowConsts.DbTablePrefix + "EventosConexion", MeetFloowConsts.DbSchema);
            b.ConfigureByConvention();
            b.HasOne(x => x.Reunion).WithMany(x => x.Eventos).HasForeignKey(x => x.ReunionId).IsRequired();
            b.HasOne<IdentityUser>().WithMany().HasForeignKey(x => x.UsuarioId).IsRequired();
        });

        builder.Entity<MeetFloow.Reuniones.ConfiguracionReunion>(b =>
        {
            b.ToTable(MeetFloowConsts.DbTablePrefix + "ConfiguracionesReunion", MeetFloowConsts.DbSchema);
            b.ConfigureByConvention();
            b.HasOne(x => x.Reunion).WithOne(x => x.Configuracion).HasForeignKey<MeetFloow.Reuniones.ConfiguracionReunion>(x => x.ReunionId).IsRequired();
        });

        builder.Entity<MeetFloow.Reuniones.InvitacionReunion>(b =>
        {
            b.ToTable(MeetFloowConsts.DbTablePrefix + "InvitacionesReunion", MeetFloowConsts.DbSchema);
            b.ConfigureByConvention();
            b.HasOne(x => x.Reunion).WithMany(x => x.Invitaciones).HasForeignKey(x => x.ReunionId).IsRequired();
            b.HasOne<IdentityUser>().WithMany().HasForeignKey(x => x.UsuarioInvitadoId).IsRequired();
        });
    }
}
