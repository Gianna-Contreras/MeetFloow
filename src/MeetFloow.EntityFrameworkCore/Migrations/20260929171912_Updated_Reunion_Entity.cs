using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MeetFloow.Migrations
{
    /// <inheritdoc />
    public partial class Updated_Reunion_Entity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Descripcion",
                table: "AppReuniones",
                type: "TEXT",
                maxLength: 2000,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "DuracionMinutos",
                table: "AppReuniones",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Estado",
                table: "AppReuniones",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "FechaHora",
                table: "AppReuniones",
                type: "TEXT",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "Ubicacion",
                table: "AppReuniones",
                type: "TEXT",
                maxLength: 500,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Descripcion",
                table: "AppReuniones");

            migrationBuilder.DropColumn(
                name: "DuracionMinutos",
                table: "AppReuniones");

            migrationBuilder.DropColumn(
                name: "Estado",
                table: "AppReuniones");

            migrationBuilder.DropColumn(
                name: "FechaHora",
                table: "AppReuniones");

            migrationBuilder.DropColumn(
                name: "Ubicacion",
                table: "AppReuniones");
        }
    }
}
