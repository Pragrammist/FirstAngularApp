import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { UploadFilesService } from 'src/app/core/home/upload-files.service';

@Component({
  selector: 'app-achievements',
  templateUrl: './achievements.component.html',
  styleUrls: ['./achievements.component.css']
})
export class AchievementsComponent {
  uploadedFiles$! : Observable<string[]>;
  constructor(private uploadFilesService : UploadFilesService){
    
  }
  uploadFiles(files:File[]){
    this.uploadedFiles$ = this.uploadFilesService.uploadFilesToGoalAchievments(files);
  }
  
}
