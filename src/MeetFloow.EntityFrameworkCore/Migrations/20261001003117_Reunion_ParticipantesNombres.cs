using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MeetFloow.Migrations
{
    /// <inheritdoc />
    public partial class Reunion_ParticipantesNombres : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ParticipantesNombres",
                table: "AppReuniones",
                type: "TEXT",
                nullable: false,
                defaultValue: "[]");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ParticipantesNombres",
                table: "AppReuniones");
        }
    }
}
