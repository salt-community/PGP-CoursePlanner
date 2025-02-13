using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class removeCourseModules : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CourseModules_Courses_CourseId",
                table: "CourseModules");

            migrationBuilder.DropForeignKey(
                name: "FK_CourseModules_Modules_ModuleId",
                table: "CourseModules");

            migrationBuilder.DropPrimaryKey(
                name: "PK_CourseModules",
                table: "CourseModules");

            migrationBuilder.RenameTable(
                name: "CourseModules",
                newName: "CourseModule");

            migrationBuilder.RenameColumn(
                name: "moduleIds",
                table: "Courses",
                newName: "ModuleIds");

            migrationBuilder.RenameIndex(
                name: "IX_CourseModules_ModuleId",
                table: "CourseModule",
                newName: "IX_CourseModule_ModuleId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_CourseModule",
                table: "CourseModule",
                columns: new[] { "CourseId", "ModuleId" });

            migrationBuilder.AddForeignKey(
                name: "FK_CourseModule_Courses_CourseId",
                table: "CourseModule",
                column: "CourseId",
                principalTable: "Courses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_CourseModule_Modules_ModuleId",
                table: "CourseModule",
                column: "ModuleId",
                principalTable: "Modules",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CourseModule_Courses_CourseId",
                table: "CourseModule");

            migrationBuilder.DropForeignKey(
                name: "FK_CourseModule_Modules_ModuleId",
                table: "CourseModule");

            migrationBuilder.DropPrimaryKey(
                name: "PK_CourseModule",
                table: "CourseModule");

            migrationBuilder.RenameTable(
                name: "CourseModule",
                newName: "CourseModules");

            migrationBuilder.RenameColumn(
                name: "ModuleIds",
                table: "Courses",
                newName: "moduleIds");

            migrationBuilder.RenameIndex(
                name: "IX_CourseModule_ModuleId",
                table: "CourseModules",
                newName: "IX_CourseModules_ModuleId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_CourseModules",
                table: "CourseModules",
                columns: new[] { "CourseId", "ModuleId" });

            migrationBuilder.AddForeignKey(
                name: "FK_CourseModules_Courses_CourseId",
                table: "CourseModules",
                column: "CourseId",
                principalTable: "Courses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_CourseModules_Modules_ModuleId",
                table: "CourseModules",
                column: "ModuleId",
                principalTable: "Modules",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
