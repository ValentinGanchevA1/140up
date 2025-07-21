import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface UserInfoProps {
  username: string;
  email: string;
}

const UserInfo: React.FC<UserInfoProps> = ({ username, email }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.username}>{username}</Text>
      <Text style={styles.email}>{email}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 20,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  email: {
    fontSize: 16,
    color: '#666',
  },
});

export default UserInfo;