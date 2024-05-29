import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Courses } from '../courses';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [NgIf, FormsModule],
  templateUrl: './course-detail.component.html',
  styleUrl: './course-detail.component.css'
})
export class CourseDetailComponent {
  @Input() course? : Courses;
}
