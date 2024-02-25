import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WeatherEntity, WebApiService } from '../../services/WebApiService';
import { Subject, Subscription, debounceTime } from 'rxjs';

@Component({
  selector: 'app-allweather',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './allweather.component.html',
  styleUrl: './allweather.component.scss',
})
export class AllweatherComponent implements OnDestroy {
  constructor(private fileUploadService: WebApiService) {
    this.concreteYearSubject.pipe(debounceTime(2000)).subscribe(() => {
      this.currentLoader();
    });
    this.subscriber = fileUploadService
      .loadNWeatherFromApi(this.pageSize)
      .subscribe({
        next: (data) => {
          this.weatherData = data;
        },
        error: (er) => {
          console.log(er);
        },
      });
  }
  private concreteYearSubject = new Subject<number>();
  public weatherData: WeatherEntity[] = [];
  private subscriber?: Subscription;
  public concreteMonth: Month = Month.None;
  public concreteNavigationType: NavigationType = NavigationType.None;
  public month = Month;
  public navigationType = NavigationType;
  public currentYear: number = 2009;
  public numberOfCurrentPage: number = 1;
  public pageSize: number = 10;

  public currentLoader() {
    switch (this.concreteNavigationType) {
      case NavigationType.None:
        this.loadNpage();
        break;
      case NavigationType.Month:
        this.loadByMonth();
        break;
      case NavigationType.Year:
        this.loadByYear();
        break;
    }
  }

  public changeCurrentPageNumber(newValue: number) {
    this.numberOfCurrentPage = newValue;
    this.currentLoader();
  }

  public onYearInputChange() {
    this.concreteYearSubject.next(this.currentYear);
  }
  public onMontInputChange() {
    this.currentLoader();
  }

  public navigationTypeChanged() {}
  public loadNpage() {
    this.subscriber?.unsubscribe();
    this.subscriber = this.fileUploadService
      .loadWithPaginationWeatherFromApi(this.numberOfCurrentPage, this.pageSize)
      .subscribe({
        next: (data) => {
          this.weatherData = data;
        },
        error: (er) => {
          console.log(er);
        },
      });
  }
  public loadByYear() {
    this.subscriber?.unsubscribe();
    this.subscriber = this.fileUploadService
      .loadByYearFromApi(
        this.numberOfCurrentPage,
        this.pageSize,
        this.currentYear
      )
      .subscribe({
        next: (data) => {
          this.weatherData = data;
        },
        error: (er) => {
          console.log(er);
        },
      });
  }
  public loadByMonth() {
    this.subscriber?.unsubscribe();
    this.subscriber = this.fileUploadService
      .loadByMonthFromApi(
        this.numberOfCurrentPage,
        this.pageSize,
        CombinedMonth[this.concreteMonth]
      )
      .subscribe({
        next: (data) => {
          this.weatherData = data;
        },
        error: (er) => {
          console.log(er);
        },
      });
  }

  ngOnDestroy(): void {
    this.subscriber?.unsubscribe();
  }
}

export enum NavigationType {
  None = 'none',
  Month = 'По месяцам',
  Year = 'По годам',
}

export enum Month {
  January = 'Январь',
  February = 'Февраль',
  March = 'Март',
  April = 'Апрель',
  May = 'Май',
  June = 'Июнь',
  July = 'Июль',
  August = 'Август',
  September = 'Сентябрь',
  October = 'Октябрь',
  November = 'Ноябрь',
  December = 'Декабрь',
  None = 'none',
}
export enum CombinedMonth {
  Январь = 1,
  Февраль = 2,
  Март = 3,
  Апрель = 4,
  Май = 5,
  Июнь = 6,
  Июль = 7,
  Август = 8,
  Сентябрь = 9,
  Октябрь = 10,
  Ноябрь = 11,
  Декабрь = 12,
  none = 0,
}
