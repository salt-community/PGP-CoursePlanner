﻿// <auto-generated />
using System;
using System.Collections.Generic;
using backend.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace backend.Migrations
{
    [DbContext(typeof(DataContext))]
    partial class DataContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.6")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("backend.Models.AppliedCourse", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("Color")
                        .HasColumnType("text");

                    b.Property<int>("CourseId")
                        .HasColumnType("integer");

                    b.Property<DateTime>("EndDate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Name")
                        .HasColumnType("text");

                    b.Property<DateTime>("StartDate")
                        .HasColumnType("timestamp with time zone");

                    b.HasKey("Id");

                    b.ToTable("AppliedCourses");
                });

            modelBuilder.Entity("backend.Models.AppliedDay", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<int?>("AppliedModuleId")
                        .HasColumnType("integer");

                    b.Property<int>("DayNumber")
                        .HasColumnType("integer");

                    b.Property<string>("Description")
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("AppliedModuleId");

                    b.ToTable("AppliedDays");
                });

            modelBuilder.Entity("backend.Models.AppliedEvent", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<int?>("AppliedDayId")
                        .HasColumnType("integer");

                    b.Property<int?>("DateContentId")
                        .HasColumnType("integer");

                    b.Property<string>("Description")
                        .HasColumnType("text");

                    b.Property<string>("EndTime")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("StartTime")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("AppliedDayId");

                    b.HasIndex("DateContentId");

                    b.ToTable("AppliedEvents");
                });

            modelBuilder.Entity("backend.Models.AppliedModule", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<int?>("AppliedCourseId")
                        .HasColumnType("integer");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("NumberOfDays")
                        .HasColumnType("integer");

                    b.Property<int>("Order")
                        .HasColumnType("integer");

                    b.Property<string[]>("Track")
                        .HasColumnType("text[]");

                    b.HasKey("Id");

                    b.HasIndex("AppliedCourseId");

                    b.ToTable("AppliedModules");
                });

            modelBuilder.Entity("backend.Models.CalendarDate", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<DateTime>("Date")
                        .HasColumnType("timestamp with time zone");

                    b.HasKey("Id");

                    b.ToTable("CalendarDates");
                });

            modelBuilder.Entity("backend.Models.Course", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("NumberOfWeeks")
                        .HasColumnType("integer");

                    b.Property<List<int>>("moduleIds")
                        .IsRequired()
                        .HasColumnType("integer[]");

                    b.HasKey("Id");

                    b.ToTable("Courses");
                });

            modelBuilder.Entity("backend.Models.DateContent", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<int?>("CalendarDateId")
                        .HasColumnType("integer");

                    b.Property<string>("Color")
                        .HasColumnType("text");

                    b.Property<string>("CourseName")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("DayOfModule")
                        .HasColumnType("integer");

                    b.Property<int?>("EventId")
                        .HasColumnType("integer");

                    b.Property<string>("ModuleName")
                        .HasColumnType("text");

                    b.Property<int>("TotalDaysInModule")
                        .HasColumnType("integer");

                    b.Property<int>("appliedCourseId")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("CalendarDateId");

                    b.HasIndex("EventId");

                    b.ToTable("DateContent");
                });

            modelBuilder.Entity("backend.Models.Day", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<int>("DayNumber")
                        .HasColumnType("integer");

                    b.Property<string>("Description")
                        .HasColumnType("text");

                    b.Property<int?>("ModuleId")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("ModuleId");

                    b.ToTable("Days");
                });

            modelBuilder.Entity("backend.Models.Event", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<int?>("DayId")
                        .HasColumnType("integer");

                    b.Property<string>("Description")
                        .HasColumnType("text");

                    b.Property<string>("EndTime")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("StartTime")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("DayId");

                    b.ToTable("Events");
                });

            modelBuilder.Entity("backend.Models.LoggedInUser", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("Refresh_Token")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("LoggedInUser");
                });

            modelBuilder.Entity("backend.Models.Module", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("NumberOfDays")
                        .HasColumnType("integer");

                    b.Property<string[]>("Track")
                        .IsRequired()
                        .HasColumnType("text[]");

                    b.HasKey("Id");

                    b.ToTable("Modules");
                });

            modelBuilder.Entity("CourseModule", b =>
                {
                    b.Property<int>("CourseId")
                        .HasColumnType("integer");

                    b.Property<int>("ModuleId")
                        .HasColumnType("integer");

                    b.HasKey("CourseId", "ModuleId");

                    b.HasIndex("ModuleId");

                    b.ToTable("CourseModules");
                });

            modelBuilder.Entity("backend.Models.AppliedDay", b =>
                {
                    b.HasOne("backend.Models.AppliedModule", null)
                        .WithMany("Days")
                        .HasForeignKey("AppliedModuleId");
                });

            modelBuilder.Entity("backend.Models.AppliedEvent", b =>
                {
                    b.HasOne("backend.Models.AppliedDay", null)
                        .WithMany("Events")
                        .HasForeignKey("AppliedDayId");

                    b.HasOne("backend.Models.DateContent", null)
                        .WithMany("Events")
                        .HasForeignKey("DateContentId");
                });

            modelBuilder.Entity("backend.Models.AppliedModule", b =>
                {
                    b.HasOne("backend.Models.AppliedCourse", null)
                        .WithMany("Modules")
                        .HasForeignKey("AppliedCourseId");
                });

            modelBuilder.Entity("backend.Models.DateContent", b =>
                {
                    b.HasOne("backend.Models.CalendarDate", null)
                        .WithMany("DateContent")
                        .HasForeignKey("CalendarDateId");

                    b.HasOne("backend.Models.Event", null)
                        .WithMany("DateContents")
                        .HasForeignKey("EventId");
                });

            modelBuilder.Entity("backend.Models.Day", b =>
                {
                    b.HasOne("backend.Models.Module", null)
                        .WithMany("Days")
                        .HasForeignKey("ModuleId");
                });

            modelBuilder.Entity("backend.Models.Event", b =>
                {
                    b.HasOne("backend.Models.Day", null)
                        .WithMany("Events")
                        .HasForeignKey("DayId");
                });

            modelBuilder.Entity("CourseModule", b =>
                {
                    b.HasOne("backend.Models.Course", "Course")
                        .WithMany("Modules")
                        .HasForeignKey("CourseId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("backend.Models.Module", "Module")
                        .WithMany("CourseModules")
                        .HasForeignKey("ModuleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Course");

                    b.Navigation("Module");
                });

            modelBuilder.Entity("backend.Models.AppliedCourse", b =>
                {
                    b.Navigation("Modules");
                });

            modelBuilder.Entity("backend.Models.AppliedDay", b =>
                {
                    b.Navigation("Events");
                });

            modelBuilder.Entity("backend.Models.AppliedModule", b =>
                {
                    b.Navigation("Days");
                });

            modelBuilder.Entity("backend.Models.CalendarDate", b =>
                {
                    b.Navigation("DateContent");
                });

            modelBuilder.Entity("backend.Models.Course", b =>
                {
                    b.Navigation("Modules");
                });

            modelBuilder.Entity("backend.Models.DateContent", b =>
                {
                    b.Navigation("Events");
                });

            modelBuilder.Entity("backend.Models.Day", b =>
                {
                    b.Navigation("Events");
                });

            modelBuilder.Entity("backend.Models.Event", b =>
                {
                    b.Navigation("DateContents");
                });

            modelBuilder.Entity("backend.Models.Module", b =>
                {
                    b.Navigation("CourseModules");

                    b.Navigation("Days");
                });
#pragma warning restore 612, 618
        }
    }
}