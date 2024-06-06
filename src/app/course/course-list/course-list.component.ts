import { NgFor, NgIf } from '@angular/common';
import { Component, Inject, Input } from '@angular/core';
import { Courses } from '../courses';
import { Injectable } from '@angular/core';
import { CourseDetailComponent } from '../course-detail/course-detail.component';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatListModule} from '@angular/material/list';
import {MatCardModule} from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms'; // <-- NgModel lives here

import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [NgFor, CourseDetailComponent, MatGridListModule, MatCardModule, MatButtonModule, MatIconModule, MatListModule,
    NgIf
  ],
  templateUrl: './course-list.component.html',
  styleUrl: './course-list.component.scss'
})

@Injectable({
  providedIn: 'root'
})
export class CourseListComponent {

  @Input() courses! : Courses[];
  selectedCourse?: Courses;

  constructor(public dialog: MatDialog) {}

  onSelect(course: Courses) : void {
    this.selectedCourse = course;
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddCourseDialog);

    dialogRef.afterClosed().subscribe(newCourse => {
      this.addNewCourse(newCourse);
    });
  }

  addNewCourse(name : String) {
    const trimmedName : string = name.trim();
    if (trimmedName) {
      let newCourse : Courses = {
        "name" : trimmedName,
        "id": this.getNewCourseId(),
      }
      this.courses.push(newCourse);
    }
  }

  deleteCourse(courseToDelete : Courses) : void {
    this.courses = this.courses.filter(s => s != courseToDelete);
    this.selectedCourse = undefined;
  }

  getNewCourseId() : number {
    let max = 0;
    for (let course of this.courses) {
      max = max > course.id ? max : course.id;
    }
    return max+1;
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
  ]
})
export class AddCourseDialog {
  constructor(
    public dialogRef: MatDialogRef<AddCourseDialog>,
    @Inject(MAT_DIALOG_DATA) public newCourse: string,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}