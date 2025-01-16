using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class updateDateContent : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "TrackId",
                table: "DateContent",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_DateContent_TrackId",
                table: "DateContent",
                column: "TrackId");

            migrationBuilder.AddForeignKey(
                name: "FK_DateContent_Tracks_TrackId",
                table: "DateContent",
                column: "TrackId",
                principalTable: "Tracks",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DateContent_Tracks_TrackId",
                table: "DateContent");

            migrationBuilder.DropIndex(
                name: "IX_DateContent_TrackId",
                table: "DateContent");

            migrationBuilder.DropColumn(
                name: "TrackId",
                table: "DateContent");
        }
    }
}
