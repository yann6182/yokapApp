import { Injectable } from '@angular/core';

declare var gapi: any;

@Injectable({
  providedIn: 'root'
})
export class GoogleDriveService {

  private clientId = '769661539885-5qra187md4pckm3drp44mqrstver01fv.apps.googleusercontent.com';
  private scope = 'https://www.googleapis.com/auth/drive.file';

  constructor() { 
    gapi.load('client:auth2', () => {
      gapi.client.init({
        clientId: this.clientId,
        scope: this.scope,
      });
    });
  }

  signIn() {
    return new Promise((resolve, reject) => {
      gapi.auth2.getAuthInstance().signIn().then(() => {
        var accessToken = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;
        resolve(accessToken);
      }, (error: Error) => {
        reject(error);
      });
    });
  }

  saveData(data: any) {
    var fileMetadata = {
      'name': 'data.json',
      'mimeType': 'application/json'
    };
    var media = {
      mimeType: 'application/json',
      body: JSON.stringify(data)
    };
    return gapi.client.drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id'
    });
  }
}
