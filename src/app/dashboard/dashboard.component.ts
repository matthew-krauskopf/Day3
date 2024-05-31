import { Component, OnInit } from '@angular/core';
import { CourseListComponent } from '../course-list/course-list.component';
import { StudentListComponent } from '../student-list/student-list.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import {MatButtonModule} from '@angular/material/button';
import { NgIf } from '@angular/common';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatSidenavModule, StudentListComponent, CourseListComponent, NgIf,
    MatButtonModule, MatGridListModule, MatIconModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  ngOnInit() {
    this.studentsPage();
  }

  studentsPage() : void {
    document.getElementById("studentPanel")!.style.display="block";
    document.getElementById("coursePanel")!.style.display="none";
  }

  coursesPage() : void {
    document.getElementById("studentPanel")!.style.display="none";
    document.getElementById("coursePanel")!.style.display="block";
  }


}
