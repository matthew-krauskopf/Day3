import { Component, Input, Inject, AfterContentInit, OnChanges } from '@angular/core';
import { Students } from '../students';
import { NgIf, NgFor } from '@angular/common'; 
import { FormsModule } from '@angular/forms';
import { Courses } from '../../course/courses';
import { CourseListComponent } from '../../course/course-list/course-list.component';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatListModule} from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';

import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-student-detail',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, CourseListComponent, MatInputModule, MatFormFieldModule, MatCheckboxModule, MatListModule,
    MatButtonModule, MatIconModule, MatCardModule
  ],
  templateUrl: './student-detail.component.html',
  styleUrl: './student-detail.component.scss'
})
export class StudentDetailComponent implements AfterContentInit, OnChanges {

  @Input() student! : Students;
  @Input() courses! : Courses[];

  tempEnrolledCourses! : CheckboxCourse[];

  constructor(public dialog : MatDialog) {}

  ngAfterContentInit(): void {
    this.resetTempCourses();
  }

  ngOnChanges(): void {
    this.resetTempCourses();
  }

  openDialog() : void {
    const dialogRef = this.dialog.open(AddCourseDialog, {data : this.unenrolledCourses()});

    dialogRef.afterClosed().subscribe(courseId => {
      if (courseId) {  
        this.addCourse(courseId);
      }
    })
  }

  unenrolledCourses() : Courses[] {
    return this.courses.filter((course) => !this.tempEnrolledCourses.map(c => c.course.id).includes(course.id));
  }

  addCourse(courseId : number) {
    if (this.student!.isActive == true && courseId && courseId != -1) {
       this.tempEnrolledCourses.push(this.checkboxCourseFactory(this.courses.filter(c => c.id === courseId)[0]));
    }
  }

  getStudentsCourses() : Courses[] {
    return this.courses.filter((course) => this.tempEnrolledCourses.map(c => c.course.id).includes(course.id));
  }

  saveCourseUpdates() {
    this.student.enrolledCourses = [];
    for (let c of this.tempEnrolledCourses) {
      if (c.active) {
        this.student.enrolledCourses.push(c.course.id)
      }
    }
    this.resetTempCourses();
  }

  resetTempCourses() {
    this.tempEnrolledCourses = [];
    for (let courseId of this.student.enrolledCourses) {
      this.tempEnrolledCourses.push(this.checkboxCourseFactory(this.courses.filter(c => c.id === courseId)[0]));
    }
  }

  checkboxCourseFactory(course : Courses) : CheckboxCourse {
    let c : CheckboxCourse = {
      "active" : true,
      "course" : course
    }
    return c;
  }

  updateChecked(checked : boolean, course : CheckboxCourse) {
    course.active = checked;
  }
}

interface CheckboxCourse {
  active: boolean,
  course : Courses
}

@Component({
  selector: "dialog-add-course",
  standalone: true,
  templateUrl: "./add-course-dialog.html",
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatSelectModule,
    NgFor
  ]
})
export class AddCourseDialog {
  courseId : number = -1;

  constructor(
    public dialogRef: MatDialogRef<AddCourseDialog>,
    @Inject(MAT_DIALOG_DATA) public courses : Courses[]
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
