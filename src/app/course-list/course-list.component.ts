import { NgFor, NgIf } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { Courses } from '../courses';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { CourseDetailComponent } from '../course-detail/course-detail.component';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatListModule} from '@angular/material/list';
import {MatCardModule} from '@angular/material/card';
import { MatButton, MatButtonModule } from '@angular/material/button';
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
  styleUrl: './course-list.component.css'
})

@Injectable({
  providedIn: 'root'
})
export class CourseListComponent {

  public courses! : Courses[];
  selectedCourse?: Courses;

  baseUrl : string = 'https://json-server-vercel-matt-krauskopfs-projects.vercel.app/';
  coursesUrl : string = this.baseUrl + "courses";

  constructor(private http : HttpClient, public dialog: MatDialog) {
    this.initCourses().subscribe(c => this.courses = c);
  }

  onSelect(course: Courses) : void {
    this.selectedCourse = course;
  }

  private initCourses() : Observable<Courses[]> {
    return this.http.get<Courses[]>(this.coursesUrl)
    .pipe(
      tap(_ => console.log('Fetched Courses')),
      catchError(this.handleError<Courses[]>('initCourses')));
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
  }

  getNewCourseId() : number {
    let max = 0;
    for (let course of this.courses) {
      max = max > course.id ? max : course.id;
    }
    return max+1;
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);

      console.log(`${operation} failed: ${error.message}`);

      return of(result as T);
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