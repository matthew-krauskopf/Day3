import { Component } from '@angular/core';
import { CourseListComponent } from '../course-list/course-list.component';
import { StudentListComponent } from '../student-list/student-list.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [StudentListComponent, CourseListComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

}
