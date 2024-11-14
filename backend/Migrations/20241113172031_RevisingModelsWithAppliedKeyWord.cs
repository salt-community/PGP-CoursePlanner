using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class RevisingModelsWithAppliedKeyWord : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DateContent_Events_EventId",
                table: "DateContent");

            migrationBuilder.DropTable(
                name: "AppliedEvents");

            migrationBuilder.DropTable(
                name: "AppliedDays");

            migrationBuilder.DropTable(
                name: "AppliedModules");

            migrationBuilder.DropTable(
                name: "AppliedCourses");

            migrationBuilder.DropIndex(
                name: "IX_DateContent_EventId",
                table: "DateContent");

            migrationBuilder.DropColumn(
                name: "EventId",
                table: "DateContent");

            migrationBuilder.AddColumn<bool>(
                name: "IsApplied",
                table: "Modules",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "Order",
                table: "Modules",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "IsApplied",
                table: "Events",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsApplied",
                table: "Days",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Courses",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddColumn<string>(
                name: "Color",
                table: "Courses",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "EndDate",
                table: "Courses",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<bool>(
                name: "IsApplied",
                table: "Courses",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "StartDate",
                table: "Courses",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.CreateTable(
                name: "DateContentEvent",
                columns: table => new
                {
                    DateContentsId = table.Column<int>(type: "integer", nullable: false),
                    EventsId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DateContentEvent", x => new { x.DateContentsId, x.EventsId });
                    table.ForeignKey(
                        name: "FK_DateContentEvent_DateContent_DateContentsId",
                        column: x => x.DateContentsId,
                        principalTable: "DateContent",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DateContentEvent_Events_EventsId",
                        column: x => x.EventsId,
                        principalTable: "Events",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DateContentEvent_EventsId",
                table: "DateContentEvent",
                column: "EventsId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DateContentEvent");

            migrationBuilder.DropColumn(
                name: "IsApplied",
                table: "Modules");

            migrationBuilder.DropColumn(
                name: "Order",
                table: "Modules");

            migrationBuilder.DropColumn(
                name: "IsApplied",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "IsApplied",
                table: "Days");

            migrationBuilder.DropColumn(
                name: "Color",
                table: "Courses");

            migrationBuilder.DropColumn(
                name: "EndDate",
                table: "Courses");

            migrationBuilder.DropColumn(
                name: "IsApplied",
                table: "Courses");

            migrationBuilder.DropColumn(
                name: "StartDate",
                table: "Courses");

            migrationBuilder.AddColumn<int>(
                name: "EventId",
                table: "DateContent",
                type: "integer",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Courses",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.CreateTable(
                name: "AppliedCourses",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Color = table.Column<string>(type: "text", nullable: true),
                    CourseId = table.Column<int>(type: "integer", nullable: false),
                    EndDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: true),
                    StartDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppliedCourses", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AppliedModules",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    AppliedCourseId = table.Column<int>(type: "integer", nullable: true),
                    Name = table.Column<string>(type: "text", nullable: false),
                    NumberOfDays = table.Column<int>(type: "integer", nullable: false),
                    Order = table.Column<int>(type: "integer", nullable: false),
                    Track = table.Column<string[]>(type: "text[]", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppliedModules", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppliedModules_AppliedCourses_AppliedCourseId",
                        column: x => x.AppliedCourseId,
                        principalTable: "AppliedCourses",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "AppliedDays",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    AppliedModuleId = table.Column<int>(type: "integer", nullable: true),
                    DayNumber = table.Column<int>(type: "integer", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppliedDays", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppliedDays_AppliedModules_AppliedModuleId",
                        column: x => x.AppliedModuleId,
                        principalTable: "AppliedModules",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "AppliedEvents",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    AppliedDayId = table.Column<int>(type: "integer", nullable: true),
                    DateContentId = table.Column<int>(type: "integer", nullable: true),
                    Description = table.Column<string>(type: "text", nullable: true),
                    EndTime = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    StartTime = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppliedEvents", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppliedEvents_AppliedDays_AppliedDayId",
                        column: x => x.AppliedDayId,
                        principalTable: "AppliedDays",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_AppliedEvents_DateContent_DateContentId",
                        column: x => x.DateContentId,
                        principalTable: "DateContent",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_DateContent_EventId",
                table: "DateContent",
                column: "EventId");

            migrationBuilder.CreateIndex(
                name: "IX_AppliedDays_AppliedModuleId",
                table: "AppliedDays",
                column: "AppliedModuleId");

            migrationBuilder.CreateIndex(
                name: "IX_AppliedEvents_AppliedDayId",
                table: "AppliedEvents",
                column: "AppliedDayId");

            migrationBuilder.CreateIndex(
                name: "IX_AppliedEvents_DateContentId",
                table: "AppliedEvents",
                column: "DateContentId");

            migrationBuilder.CreateIndex(
                name: "IX_AppliedModules_AppliedCourseId",
                table: "AppliedModules",
                column: "AppliedCourseId");

            migrationBuilder.AddForeignKey(
                name: "FK_DateContent_Events_EventId",
                table: "DateContent",
                column: "EventId",
                principalTable: "Events",
                principalColumn: "Id");
        }
    }
}
