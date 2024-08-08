using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class EditsEventDaysModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImportantDate",
                table: "Events");

            migrationBuilder.AddColumn<bool>(
                name: "ImportantDate",
                table: "Days",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImportantDate",
                table: "Days");

            migrationBuilder.AddColumn<bool>(
                name: "ImportantDate",
                table: "Events",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);
        }
    }
}
