import { Component, OnInit, ViewChild } from '@angular/core';
import { InfoCard } from 'src/app/models/InfoCard.model';
import { IonSlide } from '@ionic/angular';
import { CoursesService } from 'src/app/providers/courses.service';
import Course from 'src/app/models/Course.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  @ViewChild('slides', { static: true }) slider: IonSlide;
  courses: Course[];

  cards: InfoCard[] = [];

  slideOpts = {
    initialSlide: 0,
    speed: 800,
    spaceBetween: -17,
  };

  constructor(private coursesService: CoursesService) {}

  async ngOnInit() {
    this.courses = await this.coursesService.getAll();
    this.cards = [
      {
        title: 'Courses',
        icon: 'school',
        counter: this.courses.length,
      },
      {
        title: 'Teachers',
        icon: 'school',
        counter: this.courses.length,
      },
      {
        title: 'Students',
        icon: 'school',
        counter: this.courses.length,
      },
      {
        title: 'Subjects',
        icon: 'school',
        counter: this.courses.length,
      },
    ];
  }
}
