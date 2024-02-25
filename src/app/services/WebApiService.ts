import {
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpEventType,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Observer, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebApiService {
  constructor(private http: HttpClient) {}

  private baseUrl = 'https://localhost:7144/api/Weather';

  public loadNWeatherFromApi(take: number): Observable<WeatherEntity[]> {
    return this.http.get<WeatherEntity[]>(
      this.baseUrl + `/first?takeValue=${take}`,
      {
        responseType: 'json',
      }
    );
  }
  public loadWithPaginationWeatherFromApi(
    pageNumber: number,
    pageSize: number
  ): Observable<WeatherEntity[]> {
    return this.http.get<WeatherEntity[]>(
      this.baseUrl +
        `/withPagination?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      {
        responseType: 'json',
      }
    );
  }

  public loadByMonthFromApi(
    pageNumber: number,
    pageSize: number,
    month: number
  ): Observable<WeatherEntity[]> {
    return this.http.get<WeatherEntity[]>(
      this.baseUrl +
        `/byMonth?pageNumber=${pageNumber}&pageSize=${pageSize}&month=${month}`,
      {
        responseType: 'json',
      }
    );
  }

  public loadByYearFromApi(
    pageNumber: number,
    pageSize: number,
    Year: number
  ): Observable<WeatherEntity[]> {
    return this.http.get<WeatherEntity[]>(
      this.baseUrl +
        `/byYear?pageNumber=${pageNumber}&pageSize=${pageSize}&year=${Year}`,
      {
        responseType: 'json',
      }
    );
  }

  public uploadFile = (files: File[]) => {
    if (files.length === 0) {
      return;
    }
    let filesToUpload: File[] = files;
    const formData = new FormData();

    Array.from(filesToUpload).map((file, index) => {
      return formData.append('file' + index, file, file.name);
    });

    return this.http.post(this.baseUrl + '/load-weather', formData, {
      reportProgress: true,
      observe: 'events',
      responseType: 'text',
      headers: {
        ContentType: 'multipart/form-data',
        accept: '*/*',
      },
    });
  };
}
export interface WeatherEntity {
  id: string;
  date: Date;
  temperature: number;
  relativeHumidity: number;
  dewpoint: number;
  atmosphericPressure: number;
  windDirection: string;
  windSpeed: number;
  cloudiness: number;
  cloudboundary: number;
  horizontalVisibility: string;
  weatherPhenomena: string;
}
