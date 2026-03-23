import {getTranslations} from '@/i18n';

describe('i18n translations', () => {
  it('returns Turkish translations for "tr"', () => {
    const t = getTranslations('tr');
    expect(t.profile.title).toBe('Profilim');
    expect(t.settings.logout).toBe('Çıkış Yap');
    expect(t.language.turkish).toBe('Türkçe');
    expect(t.language.english).toBe('İngilizce');
    expect(t.common.loading).toBe('Yükleniyor...');
  });

  it('returns English translations for "en"', () => {
    const t = getTranslations('en');
    expect(t.profile.title).toBe('My Profile');
    expect(t.settings.logout).toBe('Log Out');
    expect(t.language.turkish).toBe('Turkish');
    expect(t.language.english).toBe('English');
    expect(t.common.loading).toBe('Loading...');
  });

  it('has all required profile keys in both languages', () => {
    const keys: Array<keyof ReturnType<typeof getTranslations>['profile']> = [
      'title',
      'username',
      'email',
      'editPhoto',
      'choosePhoto',
      'takePhoto',
      'cancel',
      'save',
      'saving',
      'photoUpdated',
      'photoUpdateFailed',
      'loadFailed',
    ];
    const tr = getTranslations('tr');
    const en = getTranslations('en');
    for (const key of keys) {
      expect(tr.profile[key]).toBeTruthy();
      expect(en.profile[key]).toBeTruthy();
    }
  });

  it('has all required settings keys in both languages', () => {
    const keys: Array<keyof ReturnType<typeof getTranslations>['settings']> = [
      'title',
      'language',
      'logout',
      'logoutConfirmTitle',
      'logoutConfirmMessage',
      'logoutConfirm',
      'logoutCancel',
    ];
    const tr = getTranslations('tr');
    const en = getTranslations('en');
    for (const key of keys) {
      expect(tr.settings[key]).toBeTruthy();
      expect(en.settings[key]).toBeTruthy();
    }
  });
});
