using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class manytomanymoduletrack : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
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

            migrationBuilder.AddColumn<List<int>>(
                name: "TrackIds",
                table: "Modules",
                type: "integer[]",
                nullable: false);

            migrationBuilder.CreateTable(
                name: "ModuleTrack",
                columns: table => new
                {
                    ModuleId = table.Column<int>(type: "integer", nullable: false),
                    TrackId = table.Column<int>(type: "integer", nullable: false)
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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ModuleTrack");

            migrationBuilder.DropColumn(
                name: "TrackIds",
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
    }
}
