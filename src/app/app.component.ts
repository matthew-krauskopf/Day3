import { Component, NgModule } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Students } from './students';
import { Courses } from './courses';

import { CommonModule, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <-- NgModel lives here

import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, tap, of } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, HttpClientModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Day1';

  students! : Students[];
  courses! : Courses[];

  selectedStudent? : Students;
  selectedCourse? : Courses;

  courseToAdd? : number;

  baseUrl : string = 'https://json-server-vercel-matt-krauskopfs-projects.vercel.app/';
  studentsUrl : string = this.baseUrl + "students";
  coursesUrl : string = this.baseUrl + "courses";

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http : HttpClient) {
    this.getStudents().subscribe(s => this.students = s);
    this.getCourses().subscribe(c => this.courses = c);
  }

  private getStudents() : Observable<Students[]> {
    return this.http.get<Students[]>(this.studentsUrl)
    .pipe(
      tap(_ => console.log('Fetched Students')),
      catchError(this.handleError<Students[]>('getStudents')));
  }

  private getCourses() : Observable<Courses[]> {
    return this.http.get<Students[]>(this.coursesUrl)
    .pipe(
      tap(_ => console.log('Fetched Courses')),
      catchError(this.handleError<Students[]>('getCourses')));
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);

      console.log(`${operation} failed: ${error.message}`);

      return of(result as T);
    }
  }

  getStudentsCourses() : Courses[] {
    return this.courses.filter((course) => this.selectedStudent!.enrolledCourses.includes(course.id));
  }

  removeCourse(removedId : number) : void {
    this.selectedStudent!.enrolledCourses = this.selectedStudent!.enrolledCourses.filter(id => id != removedId);
  }

  addCourse() {
    if (this.selectedStudent!.isActive == true && this.courseToAdd && !this.selectedStudent!.enrolledCourses.includes(this.courseToAdd)) {
       this.selectedStudent!.enrolledCourses.push(this.courseToAdd);
    }
  }

  toggleActiveness() : void {
    this.selectedStudent!.isActive = !this.selectedStudent!.isActive;
  }

  deleteStudent(studentToDelete : Students) : void {
    this.students = this.students.filter(s => s != studentToDelete);
    this.selectedStudent = undefined;
  }

  deleteCourse(courseToDelete : Courses) : void {
    this.courses = this.courses.filter(s => s != courseToDelete);
    this.selectedCourse = undefined;
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

  getNewStudentId() : number {
    let max = 0;
    for (let student of this.students) {
      max = max > student.id ? max : student.id;
    }
    return max+1;
  }

  getNewCourseId() : number {
    let max = 0;
    for (let course of this.courses) {
      max = max > course.id ? max : course.id;
    }
    return max+1;
  }
}
