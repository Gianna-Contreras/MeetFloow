using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MeetFloow.Migrations
{
    /// <inheritdoc />
    public partial class Reunion_Remove_FK_Anfitrion : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AppReuniones_AbpUsers_AnfitrionId",
                table: "AppReuniones");

            migrationBuilder.DropIndex(
                name: "IX_AppReuniones_AnfitrionId",
                table: "AppReuniones");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_AppReuniones_AnfitrionId",
                table: "AppReuniones",
                column: "AnfitrionId");

            migrationBuilder.AddForeignKey(
                name: "FK_AppReuniones_AbpUsers_AnfitrionId",
                table: "AppReuniones",
                column: "AnfitrionId",
                principalTable: "AbpUsers",
                principalColumn: "Id");
        }
    }
}
