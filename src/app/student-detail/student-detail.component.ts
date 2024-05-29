import { Component, Input } from '@angular/core';
import { Students } from '../students';
import { NgIf, NgFor } from '@angular/common'; 
import { FormsModule } from '@angular/forms';
import { Courses } from '../courses';
import { CourseListComponent } from '../course-list/course-list.component';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';

@Component({
  selector: 'app-student-detail',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, CourseListComponent],
  templateUrl: './student-detail.component.html',
  styleUrl: './student-detail.component.css'
})
export class StudentDetailComponent {

  @Input() student? : Students;
  courses? : Courses[];
  courseToAdd? : number;

  baseUrl : string = 'https://json-server-vercel-matt-krauskopfs-projects.vercel.app/';
  coursesUrl : string = this.baseUrl + "courses";

  constructor(private http : HttpClient) {
    this.initCourses().subscribe(c => this.courses = c);
  }

  private initCourses() : Observable<Courses[]> {
    return this.http.get<Courses[]>(this.coursesUrl)
    .pipe(
      tap(_ => console.log('Fetched Courses')),
      catchError(this.handleError<Courses[]>('initCourses')));
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
    return this.courses!.filter((course) => this.student!.enrolledCourses.includes(course.id));
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);

      console.log(`${operation} failed: ${error.message}`);

      return of(result as T);
    }
  }
}
