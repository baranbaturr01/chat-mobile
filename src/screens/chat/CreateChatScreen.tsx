import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useChats} from '../../hooks/useChats';
import {Colors, Spacing, FontSize, BorderRadius, Shadow} from '../../constants/theme';

const CreateChatScreen: React.FC = () => {
  const navigation = useNavigation();
  const {createChatRoom, isCreating} = useChats();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [nameError, setNameError] = useState('');

  const validate = (): boolean => {
    if (!name.trim()) {
      setNameError('Sohbet adı zorunludur');
      return false;
    }
    if (name.trim().length < 2) {
      setNameError('Sohbet adı en az 2 karakter olmalıdır');
      return false;
    }
    setNameError('');
    return true;
  };

  const handleCreate = useCallback(async () => {
    if (!validate()) {
      return;
    }

    try {
      await createChatRoom({
        name: name.trim(),
        description: description.trim() || undefined,
        memberIds: [],
        isGroup: true,
      });
      navigation.goBack();
    } catch {
      Alert.alert(
        'Hata',
        'Sohbet oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.',
        [{text: 'Tamam'}],
      );
    }
  }, [createChatRoom, name, description, navigation]);

  const handleCancel = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={88}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={styles.formCard}>
          {/* Room name field */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>
              Sohbet Adı <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, nameError ? styles.inputError : null]}
              value={name}
              onChangeText={text => {
                setName(text);
                if (nameError) {
                  setNameError('');
                }
              }}
              placeholder="Sohbet adını girin"
              placeholderTextColor={Colors.textSecondary}
              maxLength={50}
              returnKeyType="next"
              autoCapitalize="words"
              accessibilityLabel="Sohbet adı"
            />
            {nameError ? (
              <Text style={styles.errorText}>{nameError}</Text>
            ) : null}
            <Text style={styles.charCount}>{name.length}/50</Text>
          </View>

          {/* Description field */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Açıklama (opsiyonel)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Sohbet hakkında kısa bir açıklama girin"
              placeholderTextColor={Colors.textSecondary}
              maxLength={200}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              returnKeyType="done"
              accessibilityLabel="Sohbet açıklaması"
            />
            <Text style={styles.charCount}>{description.length}/200</Text>
          </View>
        </View>
      </ScrollView>

      {/* Action buttons */}
      <View style={styles.actionBar}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={handleCancel}
          disabled={isCreating}
          accessibilityRole="button">
          <Text style={styles.cancelButtonText}>İptal</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.createButton, isCreating && styles.createButtonDisabled]}
          onPress={handleCreate}
          disabled={isCreating}
          accessibilityRole="button"
          accessibilityLabel="Sohbet oluştur">
          {isCreating ? (
            <ActivityIndicator size="small" color={Colors.white} />
          ) : (
            <Text style={styles.createButtonText}>Oluştur</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  scrollContent: {
    padding: Spacing.md,
    flexGrow: 1,
  },
  formCard: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadow.sm,
  },
  fieldGroup: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: FontSize.sm + 1,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  required: {
    color: Colors.error,
  },
  input: {
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 4,
    fontSize: FontSize.md,
    color: Colors.text,
    backgroundColor: Colors.background,
  },
  inputError: {
    borderColor: Colors.error,
  },
  textArea: {
    height: 100,
    paddingTop: Spacing.sm + 4,
  },
  errorText: {
    marginTop: Spacing.xs,
    fontSize: FontSize.sm,
    color: Colors.error,
  },
  charCount: {
    marginTop: Spacing.xs,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    textAlign: 'right',
  },
  actionBar: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: Spacing.sm,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: Colors.primary,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  createButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.sm,
  },
  createButtonDisabled: {
    opacity: 0.6,
  },
  createButtonText: {
    color: Colors.white,
    fontSize: FontSize.md,
    fontWeight: '700',
  },
});

export default CreateChatScreen;
