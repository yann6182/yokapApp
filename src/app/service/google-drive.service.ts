import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

declare const gapi: any; 

@Injectable({
  providedIn: 'root',
})
export class GoogleDriveService {
  private authenticated: boolean = false;
  private token: string = '';

  private readonly apiUrl = 'https://www.googleapis.com/drive/v3/files';

  constructor(private http: HttpClient) {
    gapi.load('client:auth2', () => this.initClient());
  }

  private async initClient() {
    try {
      await gapi.client.init({
        apiKey: 'AIzaSyBzrOYT11qkGaScynt2GJ-o5aJHWV8Imvc',
        clientId: '769661539885-9feupi81omge5ksafbn3664j08efouqm.apps.googleusercontent.com',
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
        scope: 'https://www.googleapis.com/auth/drive.file',
      });
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de l\'API Google', error);
      throw error;
    }
  }
  authenticate(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      gapi.auth2.getAuthInstance().signIn().then(
        (user:any) => {
          console.log('Utilisateur authentifié avec succès:', user);
          resolve();
        },
        (error:any) => {
          console.error('Erreur lors de l\'authentification:', error);
          reject(new Error('Erreur lors de l\'authentification'));
        }
      );
    });
  }

  isAuthenticated(): boolean {
    const user = gapi.auth2.getAuthInstance().currentUser.get();
    return user.isSignedIn();
  }

  readFiles(): Promise<any[]> {
   
    return new Promise<any[]>((resolve, reject) => {
      gapi.client.drive.files.list({
        'pageSize': 10,
        'fields': 'files(id, name)',
      }).then((response:any) => {
        const files = response.result.files;
        resolve(files);
      }).catch((error:any) => {
        console.error('Erreur lors de la lecture des fichiers:', error);
        reject(error);
      });
    });
  }

  async createFileWithJSONContent(name: string, data: string): Promise<void> {
    const boundary = '-------314159265358979323846';
    const delimiter = '\r\n--' + boundary + '\r\n';
    const close_delim = '\r\n--' + boundary + '--';

    const contentType = 'application/json';

    const metadata = {
      name: name,
      mimeType: contentType,
    };

    const multipartRequestBody =
      delimiter +
      'Content-Type: application/json\r\n\r\n' +
      JSON.stringify(metadata) +
      delimiter +
      'Content-Type: ' +
      contentType +
      '\r\n\r\n' +
      data +
      close_delim;

    const request = gapi.client.request({
      path: '/upload/drive/v3/files',
      method: 'POST',
      params: { uploadType: 'multipart' },
      headers: {
        'Content-Type': 'multipart/related; boundary="' + boundary + '"',
      },
      body: multipartRequestBody,
    });

    return new Promise<void>((resolve, reject) => {
      request.execute((file:any) => {
        if (file && file.id) {
          console.log('Fichier créé avec succès. ID du fichier:', file.id);
          resolve();
        } else {
          console.error('Erreur lors de la création du fichier:', file);
          reject(new Error('Erreur lors de la création du fichier'));
        }
      });
    });
  }

}
