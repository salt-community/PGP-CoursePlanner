using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class addMiscEventListToCourse : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CourseId",
                table: "Events",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Events_CourseId",
                table: "Events",
                column: "CourseId");

            migrationBuilder.AddForeignKey(
                name: "FK_Events_Courses_CourseId",
                table: "Events",
                column: "CourseId",
                principalTable: "Courses",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Events_Courses_CourseId",
                table: "Events");

            migrationBuilder.DropIndex(
                name: "IX_Events_CourseId",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "CourseId",
                table: "Events");
        }
    }
}
