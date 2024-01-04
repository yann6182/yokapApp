import { Component,ViewChild  } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { UserSettingService } from 'src/app/service/autres/user-setting.service';
import { IonicSlides } from '@ionic/angular';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';



@Component({
  selector: 'app-slides',
  templateUrl: './slides.page.html',
  styleUrls: ['./slides.page.scss'],
})
export class SlidesPage  {

  userName!: string;
  language!: string;

  showSlides = true;
  slides: any;

  constructor(
    private userSe: UserSettingService,
    private alertController: AlertController,
    private router :Router,
    private userserv:UserSettingService,
    private toastController: ToastController,
    private translateService: TranslateService
  ) {}


  async ngOnInit() {
    if (!this.userserv.isInitialSetupDone()) {
      await this.showLanguageSelector();
      await this.showNamePrompt();
    } else {
      this.showSlides = false;
    }
    this.loadUserSettings();

  }
  ionViewWillEnter() {
    this.loadUserSettings();

  }
  goToprofil() {
    this.router.navigate(['/profil']);
  }

  onSlideChange() {
    this.slides.isEnd().then((isEnd: any) => {
      if (isEnd) {
        this.showSlides = false; // Cache les slides
        this.navigateToDashboard(); 
      }
    });
  }


  async showLanguageSelector() {
    const alert = await this.alertController.create({
      header: 'Choisissez votre langue',

      inputs: [
        { name: 'language', type: 'radio', label: 'Français', value: 'fr', checked: true },
        { name: 'language', type: 'radio', label: 'English', value: 'en' }
      ],
      buttons: [
        {
          text: 'Ok',
          handler: (data) => {
            this.userSe.setLanguage(data);
          }
        }
      ]
    });

    await alert.present();
  }

  async showNamePrompt() {
    const alert = await this.alertController.create({
      header: 'Nom d\'utilisateur',
      inputs: [{ name: 'name', type: 'text', placeholder: 'Votre nom' }],
      buttons: [
        {
          text: 'Ok',
          handler: (data) => {
            this.userSe.setUserName(data.name);
          }
        }
      ]
    });

    await alert.present();
    this.navigateToDashboard();
  }

  navigateToDashboard() {
    this.router.navigateByUrl('/home/dashboard');
  }

  private loadUserSettings() {
    this.userName = this.userserv.getUserName();
    this.language = this.userserv.getLanguage();
  }

   async saveSettings() {
    this.userserv.setUserName(this.userName);
    this.userserv.setLanguage(this.language);

    const toast = await this.toastController.create({
      message: 'Vos paramètres ont été enregistrés.',
      duration: 2000
    });
    toast.present();
  }


  changeLanguage() {
    this.userserv.setLanguage(this.language);
    this.translateService.use(this.language);

   
  }

}
