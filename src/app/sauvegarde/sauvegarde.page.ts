import { Component } from '@angular/core';
import { SqliteService } from '../services/sqlite.service';
import { GoogleDriveService } from '../services/google-drive.service';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-sauvegarde',
  templateUrl: './sauvegarde.page.html',
  styleUrls: ['./sauvegarde.page.scss'],
})
export class SauvegardePage {

  constructor(private sqliteService: SqliteService, private googleDriveService: GoogleDriveService,  public alertController: AlertController) { }

  async doLogin() {
    try {
      // Invitez l'utilisateur à se connecter
      const user = await GoogleAuth.signIn();

      if (user) {
        // L'utilisateur s'est connecté avec succès, appelez à nouveau la méthode d'exportation
        await this.exportDataToDrive();
      } else {
        // L'utilisateur a annulé la connexion, gérez en conséquence
        console.log('Connexion annulée par l\'utilisateur');
      }
    } catch (error) {
      // Gérez les erreurs liées à la connexion, affichez un message à l'utilisateur, etc.
      console.error('Erreur lors de la connexion', error);
      this.presentAlert('Erreur de connexion', 'Une erreur est survenue lors de la connexion. Veuillez réessayer.');
    }
  }

  async exportDataToDrive() {
    try {
      // Vérifiez si l'utilisateur est connecté
      const userData = await GoogleAuth.signIn();

      if (userData.authentication.accessToken) {
        // L'utilisateur est connecté, appelez la méthode d'exportation du service SqliteService
        const exportData = await this.sqliteService.exportData();

        if (exportData) {
          // Appelez la méthode pour télécharger les données vers Google Drive
          const fileId = await this.googleDriveService.uploadDataToDrive(exportData);

          // Affichez un message de succès à l'utilisateur
          console.log('Données exportées avec succès vers Google Drive. ID du fichier:', fileId);
        } else {
          console.error('Aucune donnée à exporter.');
          this.presentAlert('Aucune donnée à exporter', 'Il n\'y a aucune donnée à exporter.');
        }
      } else {
        // L'utilisateur n'est pas connecté, invitez-le à se connecter
        await this.doLogin();
      }
    } catch (error) {
      // Gérez les erreurs, affichez un message à l'utilisateur, etc.
      console.error('Erreur lors de l\'exportation des données', error);
      this.presentAlert('Erreur d\'exportation', 'Une erreur est survenue lors de l\'exportation des données. Veuillez réessayer.');
    }
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
