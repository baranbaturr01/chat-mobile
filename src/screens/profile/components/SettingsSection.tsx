import React, {memo} from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import type {Language} from '@/types/user';
import type {TranslationKeys} from '@/i18n';

interface SettingsSectionProps {
  t: TranslationKeys;
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  onLogout: () => void;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({
  t,
  currentLanguage,
  onLanguageChange,
  onLogout,
}) => {
  const handleLanguagePress = () => {
    Alert.alert(
      t.language.title,
      undefined,
      [
        {
          text: t.language.turkish,
          onPress: () => onLanguageChange('tr'),
        },
        {
          text: t.language.english,
          onPress: () => onLanguageChange('en'),
        },
        {text: t.profile.cancel, style: 'cancel'},
      ],
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{t.settings.title}</Text>

      <TouchableOpacity
        style={styles.row}
        onPress={handleLanguagePress}
        accessibilityRole="button"
        accessibilityLabel={t.settings.language}>
        <Icon name="translate" size={22} color="#2E7D32" style={styles.icon} />
        <Text style={styles.rowText}>{t.settings.language}</Text>
        <Text style={styles.rowValue}>
          {currentLanguage === 'tr'
            ? t.language.turkish
            : t.language.english}
        </Text>
        <Icon name="chevron-right" size={20} color="#BDBDBD" />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.row, styles.logoutRow]}
        onPress={onLogout}
        accessibilityRole="button"
        accessibilityLabel={t.settings.logout}>
        <Icon name="logout" size={22} color="#D32F2F" style={styles.icon} />
        <Text style={[styles.rowText, styles.logoutText]}>
          {t.settings.logout}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2E7D32',
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingVertical: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E8F5E9',
  },
  icon: {
    marginRight: 12,
  },
  rowText: {
    flex: 1,
    fontSize: 16,
    color: '#212121',
  },
  rowValue: {
    fontSize: 14,
    color: '#757575',
    marginRight: 4,
  },
  logoutRow: {
    borderBottomWidth: 0,
  },
  logoutText: {
    color: '#D32F2F',
    fontWeight: '500',
  },
});

export default memo(SettingsSection);
