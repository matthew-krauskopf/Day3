import { Component, Input, Inject } from '@angular/core';
import { Students } from '../students';
import { NgIf, NgFor, CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';
import { Courses } from '../courses';
import { CourseListComponent } from '../course-list/course-list.component';
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

@Component({
  selector: 'app-student-detail',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, CourseListComponent, MatInputModule, MatFormFieldModule, MatCheckboxModule, MatListModule,
    MatButtonModule, MatIconModule
  ],
  templateUrl: './student-detail.component.html',
  styleUrl: './student-detail.component.css'
})
export class StudentDetailComponent {

  @Input() student? : Students;

  constructor(public courseListComponent : CourseListComponent, public dialog : MatDialog) {
  }

  openDialog() : void {
    const dialogRef = this.dialog.open(AddCourseDialog, {data : {courseId: -1}});

    dialogRef.afterClosed().subscribe(courseId => {
      if (courseId) {  
        this.addCourse(courseId);
      }
    })
  }

  removeCourse(removedId : number) : void {
    this.student!.enrolledCourses = this.student!.enrolledCourses.filter(id => id != removedId);
  }

  addCourse(courseId : number) {
    if (this.student!.isActive == true && courseId && courseId != -1 && !this.student!.enrolledCourses.includes(courseId)) {
       this.student!.enrolledCourses.push(courseId);
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
  constructor(
    public dialogRef: MatDialogRef<AddCourseDialog>,
    public courseListComponent : CourseListComponent,
    @Inject(MAT_DIALOG_DATA) public courseId: number,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
