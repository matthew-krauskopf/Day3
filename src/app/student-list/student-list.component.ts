import { Component, Input } from '@angular/core';
import { Students } from '../students';
import { NgFor, NgIf } from '@angular/common'; 
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, tap, of } from 'rxjs';
import { FormsModule } from '@angular/forms'; // <-- NgModel lives here
import { StudentDetailComponent } from '../student-detail/student-detail.component';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [ FormsModule, NgIf, NgFor, StudentDetailComponent ],
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.css'
})
export class StudentListComponent {

  students! : Students[];
  selectedStudent? : Students;

  baseUrl : string = 'https://json-server-vercel-matt-krauskopfs-projects.vercel.app/';
  studentsUrl : string = this.baseUrl + "students";

  constructor(private http : HttpClient) {
    this.getStudents().subscribe(s => this.students = s);
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

  addStudent(name : String) {
    const trimmedName : string = name.trim();
    if (trimmedName) {
      let newStudent : Students = {
        "name" : trimmedName,
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

