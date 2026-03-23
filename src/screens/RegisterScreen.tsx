import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import Input from '../components/Input';
import Button from '../components/Button';
import PasswordInput from '../components/PasswordInput';
import { useAuth } from '../context/AuthContext';
import {
  Colors,
  FontSize,
  Spacing,
  BorderRadius,
  Shadows,
} from '../constants/theme';
import { AuthStackParamList } from '../navigation';

type RegisterScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'Register'
>;

interface Props {
  navigation: RegisterScreenNavigationProp;
}

interface FormState {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const validateForm = (values: FormState): FormErrors => {
  const errors: FormErrors = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!values.username.trim()) {
    errors.username = 'Kullanıcı adı gereklidir.';
  } else if (values.username.trim().length < 3) {
    errors.username = 'Kullanıcı adı en az 3 karakter olmalıdır.';
  }

  if (!values.email.trim()) {
    errors.email = 'E-posta adresi gereklidir.';
  } else if (!emailRegex.test(values.email.trim())) {
    errors.email = 'Geçerli bir e-posta adresi girin.';
  }

  if (!values.password) {
    errors.password = 'Şifre gereklidir.';
  } else if (values.password.length < 6) {
    errors.password = 'Şifre en az 6 karakter olmalıdır.';
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Şifre tekrarı gereklidir.';
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = 'Şifreler eşleşmiyor.';
  }

  return errors;
};

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const { register } = useAuth();

  const [form, setForm] = useState<FormState>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: keyof FormState) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleRegister = async () => {
    const validationErrors = validateForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      await register({
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Kayıt olurken bir hata oluştu.';
      Alert.alert('Kayıt Hatası', message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>✨</Text>
            </View>
            <Text style={styles.title}>Hesap Oluştur</Text>
            <Text style={styles.subtitle}>
              Topluluğumuza katılmak için kayıt ol
            </Text>
          </View>

          {/* Form Card */}
          <View style={styles.card}>
            <Input
              label="Kullanıcı Adı"
              placeholder="kullanici_adi"
              value={form.username}
              onChangeText={handleChange('username')}
              error={errors.username}
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="username"
              returnKeyType="next"
            />

            <Input
              label="E-posta"
              placeholder="ornek@email.com"
              value={form.email}
              onChangeText={handleChange('email')}
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              returnKeyType="next"
            />

            <PasswordInput
              label="Şifre"
              placeholder="En az 6 karakter"
              value={form.password}
              onChangeText={handleChange('password')}
              error={errors.password}
              returnKeyType="next"
            />

            <PasswordInput
              label="Şifre Tekrarı"
              placeholder="Şifrenizi tekrar girin"
              value={form.confirmPassword}
              onChangeText={handleChange('confirmPassword')}
              error={errors.confirmPassword}
              returnKeyType="done"
              onSubmitEditing={handleRegister}
            />

            <Button
              title="Kayıt Ol"
              onPress={handleRegister}
              loading={isLoading}
              style={styles.registerButton}
            />
          </View>

          {/* Footer link */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Zaten hesabın var mı? </Text>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Text style={styles.linkText}>Giriş Yap</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
  header: {
    alignItems: 'center',
    paddingTop: Spacing.giant,
    paddingBottom: Spacing.xxxl,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.xxl,
    backgroundColor: Colors.primaryExtraLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
    ...Shadows.md,
  },
  logoText: {
    fontSize: 40,
  },
  title: {
    fontSize: FontSize.xxxl,
    fontWeight: '700',
    color: Colors.primaryDark,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    ...Shadows.md,
  },
  registerButton: {
    marginTop: Spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.xxl,
  },
  footerText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  linkText: {
    fontSize: FontSize.md,
    color: Colors.primary,
    fontWeight: '600',
  },
});

export default RegisterScreen;
