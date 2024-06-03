import { Component, Input } from '@angular/core';
import { Students } from '../students';
import { NgIf, NgFor } from '@angular/common'; 
import { FormsModule } from '@angular/forms';
import { Courses } from '../courses';
import { CourseListComponent } from '../course-list/course-list.component';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatListModule} from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-student-detail',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, CourseListComponent, MatInputModule, MatFormFieldModule, MatCheckboxModule, MatListModule,
    MatButtonModule
  ],
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

  getStudentsCourses() : Courses[] {
    var courses = this.courseListComponent.courses;
    if (courses) {
      return courses.filter((course) => this.student!.enrolledCourses.includes(course.id));
    } else {
      return [];
    }
  }
}
