import { Component, Input } from '@angular/core';
import { Students } from '../students';
import { Courses } from '../../course/courses';
import { CommonModule } from '@angular/common'; 
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
  imports: [ FormsModule, CommonModule, StudentDetailComponent, MatGridListModule, MatButton, MatDividerModule, MatListModule,
    MatCardModule, MatButtonModule, MatIconModule
  ],
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.scss'
})
export class StudentListComponent {

  @Input() students! : Students[];
  @Input() courses! : Courses[];
  selectedStudent? : Students;

  constructor(public dialog : MatDialog) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(AddStudentDialog);

    dialogRef.afterClosed().subscribe(newStudent => {
      if (newStudent.firstName && newStudent.lastName)
        this.addStudent(newStudent.firstName, newStudent.lastName);
    });
  }

  onSelect(student : Students) : void {
    this.selectedStudent = student;
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
}

export interface NewStudent {
  firstName?: string;
  lastName?: string;
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
  newStudent : NewStudent = {};

  constructor(
    public dialogRef: MatDialogRef<AddStudentDialog>
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}