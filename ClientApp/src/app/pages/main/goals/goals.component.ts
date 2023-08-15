import { Component, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { UploadFilesService } from 'src/app/core/home/upload-files.service';


@Component({
  selector: 'app-goals',
  templateUrl: './goals.component.html',
  styleUrls: ['./goals.component.css']
})
export class GoalsComponent {
  
  uploadedFiles$! : Observable<string[]>;
  constructor(private uploadFilesService : UploadFilesService){
    
  }
  uploadFiles(files:File[]){
    this.uploadedFiles$ = this.uploadFilesService.uploadFilesToGoalEnpoint(files);
  }
  
  
}
