using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MeetFloow.Migrations
{
    /// <inheritdoc />
    public partial class Reunion_AnfitrionId_Optional : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AppReuniones_AbpUsers_AnfitrionId",
                table: "AppReuniones");

            migrationBuilder.AddForeignKey(
                name: "FK_AppReuniones_AbpUsers_AnfitrionId",
                table: "AppReuniones",
                column: "AnfitrionId",
                principalTable: "AbpUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AppReuniones_AbpUsers_AnfitrionId",
                table: "AppReuniones");

            migrationBuilder.AddForeignKey(
                name: "FK_AppReuniones_AbpUsers_AnfitrionId",
                table: "AppReuniones",
                column: "AnfitrionId",
                principalTable: "AbpUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
