import { Component, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { WebApiService } from '../../services/WebApiService';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-load',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './load.component.html',
  styleUrl: './load.component.scss',
})
export class LoadComponent implements OnDestroy {
  constructor(private fileUploadService: WebApiService) {}
  ngOnDestroy(): void {
    this.subscriber?.unsubscribe();
  }

  public loadProgress: number = 0;
  public loadMessage: string = '';
  public loadErrorStatus: boolean = false;

  private subscriber?: Subscription;

  deleteFileListItem(file: File): void {
    this.filesToUpload.splice(this.filesToUpload.indexOf(file), 1); // Удаляем элемент из массива
  }
  onFormSubmit() {
    this.subscriber = this.fileUploadService
      .uploadFile(this.filesToUpload)
      ?.subscribe({
        next: (event) => {
          if (event.type === HttpEventType.UploadProgress && event.total)
            this.loadProgress = Math.round((100 * event.loaded) / event.total);
          else if (event.type === HttpEventType.Response) {
            this.loadMessage = 'Upload success: ' + event.body?.valueOf();
            this.filesToUpload = [];
          }
        },
        error: (err: HttpErrorResponse) => {
          console.log(err);
          this.loadErrorStatus = true;
        },
      });
  }

  public filesToUpload: File[] = [];

  fileSelected(event: any) {
    let files: File[] = event.target.files;
    for (let i = 0; i < files.length; i++) {
      if (
        files[i].type !== 'application/vnd.ms-excel' &&
        files[i].type !==
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ) {
        alert('Пожалуйста, выберите файл Excel (.xls, .xlsx)');
        return;
      }
    }
    this.filesToUpload.push(...event.target.files);
  }
}
