﻿// <auto-generated />
using System;
using Backend.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace Backend.Migrations
{
    [DbContext(typeof(DataContext))]
    partial class DataContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder.HasAnnotation("ProductVersion", "8.0.6");

            modelBuilder.Entity("Backend.Models.AppliedCourse", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("Color")
                        .HasColumnType("TEXT");

                    b.Property<int>("CourseId")
                        .HasColumnType("INTEGER");

                    b.Property<DateTime>("EndDate")
                        .HasColumnType("TEXT");

                    b.Property<DateTime>("StartDate")
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.ToTable("AppliedCourses");
                });

            modelBuilder.Entity("Backend.Models.CalendarDate", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<DateTime>("Date")
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.ToTable("CalendarDates");
                });

            modelBuilder.Entity("Backend.Models.Course", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<int>("NumberOfWeeks")
                        .HasColumnType("INTEGER");

                    b.Property<string>("moduleIds")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.ToTable("Courses");
                });

            modelBuilder.Entity("Backend.Models.DateContent", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<int?>("CalendarDateId")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Color")
                        .HasColumnType("TEXT");

                    b.Property<string>("CourseName")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<int>("DayOfModule")
                        .HasColumnType("INTEGER");

                    b.Property<string>("ModuleName")
                        .HasColumnType("TEXT");

                    b.Property<int>("TotalDaysInModule")
                        .HasColumnType("INTEGER");

                    b.Property<int>("appliedCourseId")
                        .HasColumnType("INTEGER");

                    b.HasKey("Id");

                    b.HasIndex("CalendarDateId");

                    b.ToTable("DateContent");
                });

            modelBuilder.Entity("Backend.Models.Day", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<int>("DayNumber")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Description")
                        .HasColumnType("TEXT");

                    b.Property<int?>("ModuleId")
                        .HasColumnType("INTEGER");

                    b.HasKey("Id");

                    b.HasIndex("ModuleId");

                    b.ToTable("Days");
                });

            modelBuilder.Entity("Backend.Models.Event", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<int?>("DayId")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Description")
                        .HasColumnType("TEXT");

                    b.Property<string>("EndTime")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("StartTime")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.HasIndex("DayId");

                    b.ToTable("Events");
                });

            modelBuilder.Entity("Backend.Models.Module", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<int>("NumberOfDays")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Track")
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.ToTable("Modules");
                });

            modelBuilder.Entity("CourseModule", b =>
                {
                    b.Property<int>("CourseId")
                        .HasColumnType("INTEGER");

                    b.Property<int>("ModuleId")
                        .HasColumnType("INTEGER");

                    b.HasKey("CourseId", "ModuleId");

                    b.HasIndex("ModuleId");

                    b.ToTable("CourseModules");
                });

            modelBuilder.Entity("DateContentEvent", b =>
                {
                    b.Property<int>("DateContentsId")
                        .HasColumnType("INTEGER");

                    b.Property<int>("EventsId")
                        .HasColumnType("INTEGER");

                    b.HasKey("DateContentsId", "EventsId");

                    b.HasIndex("EventsId");

                    b.ToTable("DateContentEvent");
                });

            modelBuilder.Entity("Backend.Models.DateContent", b =>
                {
                    b.HasOne("Backend.Models.CalendarDate", null)
                        .WithMany("DateContent")
                        .HasForeignKey("CalendarDateId");
                });

            modelBuilder.Entity("Backend.Models.Day", b =>
                {
                    b.HasOne("Backend.Models.Module", null)
                        .WithMany("Days")
                        .HasForeignKey("ModuleId");
                });

            modelBuilder.Entity("Backend.Models.Event", b =>
                {
                    b.HasOne("Backend.Models.Day", null)
                        .WithMany("Events")
                        .HasForeignKey("DayId");
                });

            modelBuilder.Entity("CourseModule", b =>
                {
                    b.HasOne("Backend.Models.Course", "Course")
                        .WithMany("Modules")
                        .HasForeignKey("CourseId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Backend.Models.Module", "Module")
                        .WithMany("CourseModules")
                        .HasForeignKey("ModuleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Course");

                    b.Navigation("Module");
                });

            modelBuilder.Entity("DateContentEvent", b =>
                {
                    b.HasOne("Backend.Models.DateContent", null)
                        .WithMany()
                        .HasForeignKey("DateContentsId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Backend.Models.Event", null)
                        .WithMany()
                        .HasForeignKey("EventsId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Backend.Models.CalendarDate", b =>
                {
                    b.Navigation("DateContent");
                });

            modelBuilder.Entity("Backend.Models.Course", b =>
                {
                    b.Navigation("Modules");
                });

            modelBuilder.Entity("Backend.Models.Day", b =>
                {
                    b.Navigation("Events");
                });

            modelBuilder.Entity("Backend.Models.Module", b =>
                {
                    b.Navigation("CourseModules");

                    b.Navigation("Days");
                });
#pragma warning restore 612, 618
        }
    }
}
