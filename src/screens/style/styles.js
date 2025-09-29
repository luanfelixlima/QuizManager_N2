// src/screens/style/styles.js
import { StyleSheet } from 'react-native';

export const colors = {
  primary: '#6C63FF',
  secondary: '#FFC700',
  background: '#F5F5F5',
  text: '#333',
  error: '#FF5252',
  success: '#4CAF50',
};

export const spacing = {
  s: 8,
  m: 16,
  l: 24,
};

export const fonts = {
  regular: 'System',
  bold: 'System',
};

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.m,
    backgroundColor: colors.background,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: spacing.s,
    color: colors.text,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: spacing.s,
    borderRadius: 6,
    marginBottom: spacing.m,
    backgroundColor: '#fff',
  },
  button: {
    marginVertical: spacing.m,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.s,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  text: {
    flex: 1,
    marginRight: spacing.s,
    color: colors.text,
  },
});
