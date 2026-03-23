import React, {memo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface ProfileInfoProps {
  usernameLabel: string;
  emailLabel: string;
  username: string;
  email: string;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({
  usernameLabel,
  emailLabel,
  username,
  email,
}) => (
  <View style={styles.container}>
    <Row icon="account-outline" label={usernameLabel} value={username} />
    <Row icon="email-outline" label={emailLabel} value={email} />
  </View>
);

interface RowProps {
  icon: string;
  label: string;
  value: string;
}

const Row: React.FC<RowProps> = ({icon, label, value}) => (
  <View style={styles.row}>
    <Icon name={icon} size={22} color="#2E7D32" style={styles.icon} />
    <View style={styles.textContainer}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E8F5E9',
  },
  icon: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 11,
    color: '#757575',
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 16,
    color: '#212121',
    fontWeight: '500',
  },
});

export default memo(ProfileInfo);
