import { Component } from '@angular/core';
import { SqlService } from 'src/app/service/providers/sql.service';
import { GoogleDriveService } from 'src/app/service/google-drive.service'; 
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-sauvegarde',
  templateUrl: './sauvegarde.page.html',
  styleUrls: ['./sauvegarde.page.scss'],
})
export class SauvegardePage {
  constructor(
    private sqliteService: SqlService,
    private googleDriveService: GoogleDriveService,
    private alertController: AlertController
  ) {}

  async doLogin() {
    try {
      // Attendre l'authentification avec Google Drive
       this.googleDriveService.authenticate();

      // L'utilisateur s'est connecté avec succès, appelez à nouveau la méthode d'exportation
      await this.exportDataToDrive();
    } catch (error) {
      // Gérez les erreurs liées à la connexion, affichez un message à l'utilisateur, etc.
      console.error('Erreur lors de la connexion', error);
    }
  }

  async exportDataToDrive() {
    try {
      this.googleDriveService.authenticate();

      // Vérifier si l'utilisateur est connecté
      if (this.googleDriveService.isAuthenticated()) {
        // L'utilisateur est connecté, appelez la méthode d'exportation du service SqliteService
        const exportData = await this.sqliteService.exportData();

        if (exportData) {
          // Appeler la méthode pour télécharger les données vers Google Drive
          const fileId = await this.googleDriveService.createFileWithJSONContent('yokap' ,exportData);

          // Afficher un message de succès à l'utilisateur
          console.log('Données exportées avec succès vers Google Drive. ID du fichier:', fileId);
        } else {
          console.error('Aucune donnée à exporter.');
          await this.presentAlert('Aucune donnée à exporter', 'Il n\'y a aucune donnée à exporter.');
        }
      } else {
        // L'utilisateur n'est pas connecté, invitez-le à se connecter
        this.doLogin();
      }
    } catch (error) {
      // Gérez les erreurs, affichez un message à l'utilisateur, etc.
      console.error('Erreur lors de l\'exportation des données', error);
      await this.presentAlert('Erreur d\'exportation', 'Une erreur est survenue lors de l\'exportation des données. Veuillez réessayer.');
    }
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
