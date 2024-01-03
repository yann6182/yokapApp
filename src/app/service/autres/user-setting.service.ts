import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserSettingService {

  private languageKey = 'appLanguage';
  private userNameKey = 'userName';

  constructor() { }

  setLanguage(language: string) {
    localStorage.setItem(this.languageKey, language);
  }

  getLanguage(): string {
    return localStorage.getItem(this.languageKey) || 'defaultLanguage'; // Remplacez 'defaultLanguage' par votre langue par défaut
  }

  setUserName(name: string) {
    localStorage.setItem(this.userNameKey, name);
  }

  getUserName(): string {
    return localStorage.getItem(this.userNameKey) || '';
  }

  isInitialSetupDone(): boolean {
    return localStorage.getItem(this.userNameKey) !== null && localStorage.getItem(this.languageKey) !== null;
  }
}
