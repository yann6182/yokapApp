import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class GoogleDriveService {
  private readonly apiUrl = 'https://www.googleapis.com/upload/drive/v3/files';

  constructor(private http: HttpClient, public alertController: AlertController) {}

  async uploadDataToDrive(data: string): Promise<string> {
    try {
      // Créez un fichier JSON temporaire sur Google Drive
      const fileId = await this.createFileOnDrive();

      // Écrivez les données dans le fichier
      await this.writeDataToFile(fileId, data);

      return fileId;
    } catch (error) {
      console.error('Erreur lors de l\'upload des données sur Google Drive', error);
      this.presentAlert('Erreur d\'upload', 'Une erreur est survenue lors de l\'upload des données sur Google Drive. Veuillez réessayer.');
      throw error; // Vous pouvez gérer les erreurs selon vos besoins
    }
  }

  private async createFileOnDrive(): Promise<string> {
    try {
      const createFileUrl = `${this.apiUrl}?uploadType=resumable`;

      // Définir les métadonnées du fichier
      const metadata = {
        name: 'monFichier.json',
        mimeType: 'application/json',
      };

      // Ajouter l'access token aux en-têtes
      const headers = await this.getHeadersWithAccessToken();

      // Envoyer une requête POST pour créer un fichier JSON temporaire sur Google Drive
      const response = await this.http.post(createFileUrl, metadata, { headers, observe: 'response' }).toPromise();

      // Vérifier si la réponse contient l'ID du fichier créé
      const locationHeader = response?.headers.get('location');
      const fileId = locationHeader?.split('/').pop() || '';

      if (!fileId) {
        throw new Error('Impossible de récupérer l\'ID du fichier à partir de l\'en-tête de localisation.');
      }

      return fileId;
    } catch (error) {
      console.error('Erreur lors de la création d\'un fichier sur Google Drive', error);
      this.presentAlert('Erreur de création de fichier', 'Une erreur est survenue lors de la création d\'un fichier sur Google Drive. Veuillez réessayer.');
      throw error;
    }
  }

  private async writeDataToFile(fileId: string, data: string): Promise<void> {
    try {
      const writeDataUrl = `${this.apiUrl}/${fileId}?uploadType=media`;

      // Ajouter l'access token aux en-têtes
      const headers = await this.getHeadersWithAccessToken();

      // Envoyer une requête PUT pour écrire les données dans le fichier
      await this.http.put(writeDataUrl, data, { headers }).toPromise();
    } catch (error) {
      console.error('Erreur lors de l\'écriture des données dans le fichier sur Google Drive', error);
      this.presentAlert('Erreur d\'écriture de données', 'Une erreur est survenue lors de l\'écriture des données dans le fichier sur Google Drive. Veuillez réessayer.');
      throw error;
    }
  }

  private async getHeadersWithAccessToken(): Promise<HttpHeaders> {
    try {
      // Récupérer l'access token de l'utilisateur connecté
      const accessToken = await this.getUserAccessToken();

      // Définir les en-têtes de la requête
      return new HttpHeaders({
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      });
    } catch (error) {
      console.error('Erreur lors de la récupération du token d\'accès de l\'utilisateur', error);
      throw error;
    }
  }

  private async getUserAccessToken(): Promise<string> {
    try {
      // Utiliser GoogleAuth pour récupérer le token d'accès de l'utilisateur
      const user = await GoogleAuth.signIn();
      return user.authentication.accessToken || '';
    } catch (error) {
      console.error('Erreur lors de la récupération du token d\'accès de l\'utilisateur', error);
      throw error;
    }
  }

  private async presentAlert(header: string, message: string): Promise<void> {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
