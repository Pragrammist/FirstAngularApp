import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable()
export class UploadFilesService{
    constructor(private httpClient : HttpClient)
    {

    }
    uploadFilesToGoalEnpoint(files:File[])
    {
        return this.uploadFiles (files, "goals");
    }
    uploadFilesToGoalAchievments(files:File[])
    {
        return this.uploadFiles (files, "achievments");
    }
    private uploadFiles(files:File[], endpoint: string)
    {
        let fd = new FormData();
        files.forEach(file => {
            fd.append("files", file);
        });

        return this.httpClient.post<string[]>("/file/" + endpoint, fd);
    }
}