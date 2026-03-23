import {loadSavedLanguage} from '@/context/LanguageContext';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

const AsyncStorage =
  require('@react-native-async-storage/async-storage') as jest.Mocked<
    typeof import('@react-native-async-storage/async-storage').default
  >;

describe('loadSavedLanguage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns "tr" when nothing is stored', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);
    const lang = await loadSavedLanguage();
    expect(lang).toBe('tr');
  });

  it('returns "en" when "en" is stored', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce('en');
    const lang = await loadSavedLanguage();
    expect(lang).toBe('en');
  });

  it('returns "tr" when "tr" is stored', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce('tr');
    const lang = await loadSavedLanguage();
    expect(lang).toBe('tr');
  });

  it('returns "tr" when an invalid value is stored', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce('fr');
    const lang = await loadSavedLanguage();
    expect(lang).toBe('tr');
  });

  it('returns "tr" when storage throws', async () => {
    AsyncStorage.getItem.mockRejectedValueOnce(new Error('storage error'));
    const lang = await loadSavedLanguage();
    expect(lang).toBe('tr');
  });
});
