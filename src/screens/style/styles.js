// src/screens/style/styles.js
import { StyleSheet } from 'react-native';

export const colors = {
  background: '#f4f4f4',
  primary: '#6a1b9a',   // roxo elegante
  secondary: '#ffca28', // amarelo suave
  text: '#333333',
  inputBorder: '#cccccc',
  error: '#e53935',
  white: '#ffffff',
};

// Estilos comuns para formulários, listas, botões etc.
export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },

  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    marginTop: 16,
  },

  input: {
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 8,
    padding: 12,
    backgroundColor: colors.white,
    marginBottom: 16,
    fontSize: 16,
  },

  picker: {
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: colors.white,
  },

  button: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: { width: 1, height: 2 },
    elevation: 3, // Android
  },

  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },

  buttonError: {
    backgroundColor: colors.error,
  },

  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: colors.white,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },

  listItemText: {
    flex: 1,
    marginRight: 8,
    fontSize: 15,
    color: colors.text,
  },

  emptyText: {
    fontSize: 15,
    color: '#777',
    textAlign: 'center',
    marginTop: 20,
  },
});

// Estilos específicos para o quiz
export const quizStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  loading: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  counter: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  questionBox: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 8,
    elevation: 2,
    marginBottom: 12,
  },
  question: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  alt: {
    padding: 14,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 8,
    backgroundColor: colors.white,
    marginBottom: 10,
  },
  altText: {
    fontSize: 16,
    color: colors.text,
  },
  selectedAlt: {
    backgroundColor: colors.secondary,
    borderColor: colors.primary,
  },
  selectedText: {
    fontWeight: 'bold',
    color: colors.primary,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  navButton: {
    flex: 1,
    backgroundColor: colors.primary,
    padding: 14,
    marginHorizontal: 4,
    borderRadius: 8,
    alignItems: 'center',
  },
  navButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  finishButton: {
    backgroundColor: '#28a745',
  },
});
