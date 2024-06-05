import { Component, OnInit } from '@angular/core';
import { CourseListComponent } from '../course-list/course-list.component';
import { StudentListComponent } from '../student-list/student-list.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import {MatButtonModule} from '@angular/material/button';
import { NgIf } from '@angular/common';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatIconModule} from '@angular/material/icon';
import { Students } from '../students';
import { Courses } from '../courses';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatSidenavModule, StudentListComponent, CourseListComponent, NgIf,
    MatButtonModule, MatGridListModule, MatIconModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  baseUrl : string = 'https://json-server-vercel-matt-krauskopfs-projects.vercel.app/';
  studentsUrl : string = this.baseUrl + "students";
  coursesUrl : string = this.baseUrl + "courses";

  constructor(private http : HttpClient) {
    this.initStudents().subscribe(s => this.students = s);
    this.initCourses().subscribe(c => this.courses = c);
  }

  ngOnInit() {
    this.studentsPage(); 
  }

  students! : Students[];
  courses! : Courses[];

  studentsPage() : void {
    document.getElementById("studentPanel")!.style.display="block";
    document.getElementById("coursePanel")!.style.display="none";
  }

  coursesPage() : void {
    document.getElementById("studentPanel")!.style.display="none";
    document.getElementById("coursePanel")!.style.display="block";
  }

  private initStudents() : Observable<Students[]> {
    return this.http.get<Students[]>(this.studentsUrl)
    .pipe(
      tap(_ => console.log('Fetched Students')),
      catchError(this.handleError<Students[]>('getStudents')));
  }

  private initCourses() : Observable<Courses[]> {
    return this.http.get<Courses[]>(this.coursesUrl)
    .pipe(
      tap(_ => console.log('Fetched Courses')),
      catchError(this.handleError<Courses[]>('initCourses')));
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);

      console.log(`${operation} failed: ${error.message}`);

      return of(result as T);
    }
  }
}
