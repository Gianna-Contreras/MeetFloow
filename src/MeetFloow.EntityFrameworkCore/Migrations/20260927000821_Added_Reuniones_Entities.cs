using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MeetFloow.Migrations
{
    /// <inheritdoc />
    public partial class Added_Reuniones_Entities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AppReuniones",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Titulo = table.Column<string>(type: "TEXT", maxLength: 256, nullable: false),
                    AnfitrionId = table.Column<Guid>(type: "TEXT", nullable: false),
                    ExtraProperties = table.Column<string>(type: "TEXT", nullable: false),
                    ConcurrencyStamp = table.Column<string>(type: "TEXT", maxLength: 40, nullable: false),
                    CreationTime = table.Column<DateTime>(type: "TEXT", nullable: false),
                    CreatorId = table.Column<Guid>(type: "TEXT", nullable: true),
                    LastModificationTime = table.Column<DateTime>(type: "TEXT", nullable: true),
                    LastModifierId = table.Column<Guid>(type: "TEXT", nullable: true),
                    IsDeleted = table.Column<bool>(type: "INTEGER", nullable: false, defaultValue: false),
                    DeleterId = table.Column<Guid>(type: "TEXT", nullable: true),
                    DeletionTime = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppReuniones", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppReuniones_AbpUsers_AnfitrionId",
                        column: x => x.AnfitrionId,
                        principalTable: "AbpUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AppConfiguracionesReunion",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    ReunionId = table.Column<Guid>(type: "TEXT", nullable: false),
                    PermitirChat = table.Column<bool>(type: "INTEGER", nullable: false),
                    RequerirAprobacion = table.Column<bool>(type: "INTEGER", nullable: false),
                    CreationTime = table.Column<DateTime>(type: "TEXT", nullable: false),
                    CreatorId = table.Column<Guid>(type: "TEXT", nullable: true),
                    LastModificationTime = table.Column<DateTime>(type: "TEXT", nullable: true),
                    LastModifierId = table.Column<Guid>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppConfiguracionesReunion", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppConfiguracionesReunion_AppReuniones_ReunionId",
                        column: x => x.ReunionId,
                        principalTable: "AppReuniones",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AppEventosConexion",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    ReunionId = table.Column<Guid>(type: "TEXT", nullable: false),
                    UsuarioId = table.Column<Guid>(type: "TEXT", nullable: false),
                    TipoEvento = table.Column<int>(type: "INTEGER", nullable: false),
                    CreationTime = table.Column<DateTime>(type: "TEXT", nullable: false),
                    CreatorId = table.Column<Guid>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppEventosConexion", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppEventosConexion_AbpUsers_UsuarioId",
                        column: x => x.UsuarioId,
                        principalTable: "AbpUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AppEventosConexion_AppReuniones_ReunionId",
                        column: x => x.ReunionId,
                        principalTable: "AppReuniones",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AppInvitacionesReunion",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    ReunionId = table.Column<Guid>(type: "TEXT", nullable: false),
                    UsuarioInvitadoId = table.Column<Guid>(type: "TEXT", nullable: false),
                    Estado = table.Column<int>(type: "INTEGER", nullable: false),
                    CreationTime = table.Column<DateTime>(type: "TEXT", nullable: false),
                    CreatorId = table.Column<Guid>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppInvitacionesReunion", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppInvitacionesReunion_AbpUsers_UsuarioInvitadoId",
                        column: x => x.UsuarioInvitadoId,
                        principalTable: "AbpUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AppInvitacionesReunion_AppReuniones_ReunionId",
                        column: x => x.ReunionId,
                        principalTable: "AppReuniones",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AppMensajes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    ReunionId = table.Column<Guid>(type: "TEXT", nullable: false),
                    UsuarioId = table.Column<Guid>(type: "TEXT", nullable: false),
                    Contenido = table.Column<string>(type: "TEXT", maxLength: 2000, nullable: false),
                    CreationTime = table.Column<DateTime>(type: "TEXT", nullable: false),
                    CreatorId = table.Column<Guid>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppMensajes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppMensajes_AbpUsers_UsuarioId",
                        column: x => x.UsuarioId,
                        principalTable: "AbpUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AppMensajes_AppReuniones_ReunionId",
                        column: x => x.ReunionId,
                        principalTable: "AppReuniones",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AppParticipantesReunion",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    ReunionId = table.Column<Guid>(type: "TEXT", nullable: false),
                    UsuarioId = table.Column<Guid>(type: "TEXT", nullable: false),
                    Rol = table.Column<int>(type: "INTEGER", nullable: false),
                    CreationTime = table.Column<DateTime>(type: "TEXT", nullable: false),
                    CreatorId = table.Column<Guid>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppParticipantesReunion", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppParticipantesReunion_AbpUsers_UsuarioId",
                        column: x => x.UsuarioId,
                        principalTable: "AbpUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AppParticipantesReunion_AppReuniones_ReunionId",
                        column: x => x.ReunionId,
                        principalTable: "AppReuniones",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AppSolicitudesIngreso",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    ReunionId = table.Column<Guid>(type: "TEXT", nullable: false),
                    UsuarioId = table.Column<Guid>(type: "TEXT", nullable: false),
                    Estado = table.Column<int>(type: "INTEGER", nullable: false),
                    RespondidoPorId = table.Column<Guid>(type: "TEXT", nullable: true),
                    CreationTime = table.Column<DateTime>(type: "TEXT", nullable: false),
                    CreatorId = table.Column<Guid>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppSolicitudesIngreso", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppSolicitudesIngreso_AbpUsers_RespondidoPorId",
                        column: x => x.RespondidoPorId,
                        principalTable: "AbpUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_AppSolicitudesIngreso_AbpUsers_UsuarioId",
                        column: x => x.UsuarioId,
                        principalTable: "AbpUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AppSolicitudesIngreso_AppReuniones_ReunionId",
                        column: x => x.ReunionId,
                        principalTable: "AppReuniones",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AppConfiguracionesReunion_ReunionId",
                table: "AppConfiguracionesReunion",
                column: "ReunionId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AppEventosConexion_ReunionId",
                table: "AppEventosConexion",
                column: "ReunionId");

            migrationBuilder.CreateIndex(
                name: "IX_AppEventosConexion_UsuarioId",
                table: "AppEventosConexion",
                column: "UsuarioId");

            migrationBuilder.CreateIndex(
                name: "IX_AppInvitacionesReunion_ReunionId",
                table: "AppInvitacionesReunion",
                column: "ReunionId");

            migrationBuilder.CreateIndex(
                name: "IX_AppInvitacionesReunion_UsuarioInvitadoId",
                table: "AppInvitacionesReunion",
                column: "UsuarioInvitadoId");

            migrationBuilder.CreateIndex(
                name: "IX_AppMensajes_ReunionId",
                table: "AppMensajes",
                column: "ReunionId");

            migrationBuilder.CreateIndex(
                name: "IX_AppMensajes_UsuarioId",
                table: "AppMensajes",
                column: "UsuarioId");

            migrationBuilder.CreateIndex(
                name: "IX_AppParticipantesReunion_ReunionId_UsuarioId",
                table: "AppParticipantesReunion",
                columns: new[] { "ReunionId", "UsuarioId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AppParticipantesReunion_UsuarioId",
                table: "AppParticipantesReunion",
                column: "UsuarioId");

            migrationBuilder.CreateIndex(
                name: "IX_AppReuniones_AnfitrionId",
                table: "AppReuniones",
                column: "AnfitrionId");

            migrationBuilder.CreateIndex(
                name: "IX_AppSolicitudesIngreso_RespondidoPorId",
                table: "AppSolicitudesIngreso",
                column: "RespondidoPorId");

            migrationBuilder.CreateIndex(
                name: "IX_AppSolicitudesIngreso_ReunionId",
                table: "AppSolicitudesIngreso",
                column: "ReunionId");

            migrationBuilder.CreateIndex(
                name: "IX_AppSolicitudesIngreso_UsuarioId",
                table: "AppSolicitudesIngreso",
                column: "UsuarioId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppConfiguracionesReunion");

            migrationBuilder.DropTable(
                name: "AppEventosConexion");

            migrationBuilder.DropTable(
                name: "AppInvitacionesReunion");

            migrationBuilder.DropTable(
                name: "AppMensajes");

            migrationBuilder.DropTable(
                name: "AppParticipantesReunion");

            migrationBuilder.DropTable(
                name: "AppSolicitudesIngreso");

            migrationBuilder.DropTable(
                name: "AppReuniones");
        }
    }
}
