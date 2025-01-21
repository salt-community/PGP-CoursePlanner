using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class tracks : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Track",
                table: "Modules");

            migrationBuilder.AddColumn<int>(
                name: "ModuleId",
                table: "Tracks",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Tracks_ModuleId",
                table: "Tracks",
                column: "ModuleId");

            migrationBuilder.AddForeignKey(
                name: "FK_Tracks_Modules_ModuleId",
                table: "Tracks",
                column: "ModuleId",
                principalTable: "Modules",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tracks_Modules_ModuleId",
                table: "Tracks");

            migrationBuilder.DropIndex(
                name: "IX_Tracks_ModuleId",
                table: "Tracks");

            migrationBuilder.DropColumn(
                name: "ModuleId",
                table: "Tracks");

            migrationBuilder.AddColumn<string[]>(
                name: "Track",
                table: "Modules",
                type: "text[]",
                nullable: false,
                defaultValue: new string[0]);
        }
    }
}
