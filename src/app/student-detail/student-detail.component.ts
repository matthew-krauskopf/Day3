import { Component, Input } from '@angular/core';
import { Students } from '../students';
import { NgIf, NgFor } from '@angular/common'; 
import { FormsModule } from '@angular/forms';
import { Courses } from '../courses';
import { CourseListComponent } from '../course-list/course-list.component';

@Component({
  selector: 'app-student-detail',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, CourseListComponent],
  templateUrl: './student-detail.component.html',
  styleUrl: './student-detail.component.css'
})
export class StudentDetailComponent {

  @Input() student? : Students;
  courseToAdd? : number;

  constructor(public courseListComponent : CourseListComponent) {
  }

  removeCourse(removedId : number) : void {
    this.student!.enrolledCourses = this.student!.enrolledCourses.filter(id => id != removedId);
  }

  addCourse() {
    if (this.student!.isActive == true && this.courseToAdd && !this.student!.enrolledCourses.includes(this.courseToAdd)) {
       this.student!.enrolledCourses.push(this.courseToAdd);
    }
  }

  toggleActiveness() : void {
    this.student!.isActive = !this.student!.isActive;
  }

  getStudentsCourses() : Courses[] {
    var courses = this.courseListComponent.courses;
    if (courses) {
      return courses.filter((course) => this.student!.enrolledCourses.includes(course.id));
    } else {
      return [];
    }
  }
}
