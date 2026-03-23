import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import {
  Colors,
  FontSize,
  Spacing,
  BorderRadius,
  InputHeight,
} from '../constants/theme';

interface PasswordInputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

const EyeIcon: React.FC<{ visible: boolean }> = ({ visible }) => (
  <Text style={styles.eyeIconText}>{visible ? '🙈' : '👁'}</Text>
);

const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  error,
  containerStyle,
  style,
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.inputWrapper, error ? styles.inputWrapperError : null]}>
        <TextInput
          style={[styles.input, style]}
          secureTextEntry={!isVisible}
          placeholderTextColor={Colors.placeholder}
          {...props}
        />
        <TouchableOpacity
          style={styles.eyeButton}
          onPress={() => setIsVisible((prev) => !prev)}
          activeOpacity={0.7}
          accessibilityLabel={isVisible ? 'Şifreyi gizle' : 'Şifreyi göster'}
          accessibilityRole="button"
        >
          <EyeIcon visible={isVisible} />
        </TouchableOpacity>
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: InputHeight.md,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.inputBackground,
    paddingHorizontal: Spacing.lg,
  },
  inputWrapperError: {
    borderColor: Colors.error,
  },
  input: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.text,
    height: '100%',
  },
  eyeButton: {
    padding: Spacing.xs,
    marginLeft: Spacing.sm,
  },
  eyeIconText: {
    fontSize: 18,
  },
  errorText: {
    fontSize: FontSize.xs,
    color: Colors.error,
    marginTop: Spacing.xs,
  },
});

export default PasswordInput;
