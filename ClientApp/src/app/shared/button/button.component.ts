import { HttpClient } from '@angular/common/http';
import { Component, Input, OnChanges } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class ButtonComponent {
    fileNames:string[] | undefined
    @Output() filesAddedEvent = new EventEmitter<File[]>();
    @Input('uploadedFiles') public uploadedFiles$! : Observable<string[]>;

    constructor(private http: HttpClient) {}
    
    onFileSelected(event: Event) {
      
      const element = event.target as HTMLInputElement;
      const fileList = element.files;
      if(fileList){
        const files = Array.from(fileList)
        this.filesAddedEvent.emit(files);
        this.fileNames = files.map(f => f.name);
      }
    }

    

}
