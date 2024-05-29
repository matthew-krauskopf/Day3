import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { CommonModule } from '@angular/common';

import { HttpClientModule} from '@angular/common/http';

import { StudentListComponent } from './student-list/student-list.component';
import { CourseListComponent } from './course-list/course-list.component';
import { StudentDetailComponent } from './student-detail/student-detail.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [StudentListComponent, CourseListComponent, StudentDetailComponent,
     RouterOutlet, CommonModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Day2';
}
