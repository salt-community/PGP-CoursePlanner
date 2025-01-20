using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class moduletrack : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ModuleTrack");

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

            migrationBuilder.CreateTable(
                name: "ModuleTrack",
                columns: table => new
                {
                    TrackId = table.Column<int>(type: "integer", nullable: false),
                    ModuleId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ModuleTrack", x => new { x.TrackId, x.ModuleId });
                    table.ForeignKey(
                        name: "FK_ModuleTrack_Modules_ModuleId",
                        column: x => x.ModuleId,
                        principalTable: "Modules",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ModuleTrack_Tracks_TrackId",
                        column: x => x.TrackId,
                        principalTable: "Tracks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ModuleTrack_ModuleId",
                table: "ModuleTrack",
                column: "ModuleId");
        }
    }
}
