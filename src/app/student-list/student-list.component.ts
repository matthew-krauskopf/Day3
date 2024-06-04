import { Component, Inject } from '@angular/core';
import { Students } from '../students';
import { NgFor, NgIf } from '@angular/common'; 
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, tap, of } from 'rxjs';
import { FormsModule } from '@angular/forms'; // <-- NgModel lives here
import { StudentDetailComponent } from '../student-detail/student-detail.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButton } from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';
import {MatCardModule} from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

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
  selector: 'app-student-list',
  standalone: true,
  imports: [ FormsModule, NgIf, NgFor, StudentDetailComponent, MatGridListModule, MatButton, MatDividerModule, MatListModule ,
    MatCardModule, MatButtonModule, MatIconModule
  ],
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.css'
})
export class StudentListComponent {

  students! : Students[];
  selectedStudent? : Students;

  baseUrl : string = 'https://json-server-vercel-matt-krauskopfs-projects.vercel.app/';
  studentsUrl : string = this.baseUrl + "students";

  constructor(private http : HttpClient, public dialog : MatDialog) {
    this.getStudents().subscribe(s => this.students = s);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddStudentDialog, {data : {firstName: "", lastName: ""}});

    dialogRef.afterClosed().subscribe(newStudent => {
      this.addStudent(newStudent.firstName, newStudent.lastName);
    });
  }

  onSelect(student : Students) : void {
    this.selectedStudent = student;
  }

  private getStudents() : Observable<Students[]> {
    return this.http.get<Students[]>(this.studentsUrl)
    .pipe(
      tap(_ => console.log('Fetched Students')),
      catchError(this.handleError<Students[]>('getStudents')));
  }

  addStudent(firstName : String, lastName : String) {
    const trimmedFirstName : string = firstName.trim();
    const trimmedLastName : string = lastName.trim();
    if (trimmedFirstName && trimmedLastName) {
      let newStudent : Students = {
        "firstName" : trimmedFirstName,
        "lastName": trimmedLastName,
        "id": this.getNewStudentId(),
        "isActive": true,
        "enrolledCourses": []
      }

      this.students.push(newStudent);
    }
  }

  deleteStudent(studentToDelete : Students) : void {
    this.students = this.students.filter(s => s != studentToDelete);
  }

  getNewStudentId() : number {
    let max = 0;
    for (let student of this.students) {
      max = max > student.id ? max : student.id;
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

export interface NewStudent {
  firstName: string;
  lastName: string;
}

@Component({
  selector: "dialog-add-student",
  standalone: true,
  templateUrl: "./add-student-dialog.html",
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
export class AddStudentDialog {
  constructor(
    public dialogRef: MatDialogRef<AddStudentDialog>,
    @Inject(MAT_DIALOG_DATA) public newStudent: NewStudent,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}