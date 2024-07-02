using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class AppliedCourseModels : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "DateContentId",
                table: "Events",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "AppliedCourses",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    StartDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    CourseId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppliedCourses", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CalendarDates",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Date = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CalendarDates", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "DateContent",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    ModuleName = table.Column<string>(type: "TEXT", nullable: true),
                    DayOfModule = table.Column<int>(type: "INTEGER", nullable: false),
                    TotalDaysInModule = table.Column<int>(type: "INTEGER", nullable: false),
                    CourseName = table.Column<string>(type: "TEXT", nullable: false),
                    CalendarDateId = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DateContent", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DateContent_CalendarDates_CalendarDateId",
                        column: x => x.CalendarDateId,
                        principalTable: "CalendarDates",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Events_DateContentId",
                table: "Events",
                column: "DateContentId");

            migrationBuilder.CreateIndex(
                name: "IX_DateContent_CalendarDateId",
                table: "DateContent",
                column: "CalendarDateId");

            migrationBuilder.AddForeignKey(
                name: "FK_Events_DateContent_DateContentId",
                table: "Events",
                column: "DateContentId",
                principalTable: "DateContent",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Events_DateContent_DateContentId",
                table: "Events");

            migrationBuilder.DropTable(
                name: "AppliedCourses");

            migrationBuilder.DropTable(
                name: "DateContent");

            migrationBuilder.DropTable(
                name: "CalendarDates");

            migrationBuilder.DropIndex(
                name: "IX_Events_DateContentId",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "DateContentId",
                table: "Events");
        }
    }
}
