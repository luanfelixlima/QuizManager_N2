// src/screens/AddThemeScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { insertTheme } from '../db';
import { commonStyles, colors } from './style/styles';

export default function AddThemeScreen({ navigation }) {
  const [name, setName] = useState('');

  async function save() {
    const trimmed = name.trim();
    if (!trimmed) {
      Alert.alert('Erro', 'Nome do tema é obrigatório');
      return;
    }

    try {
      await insertTheme(trimmed);
      Alert.alert('Sucesso', 'Tema cadastrado');
      navigation.goBack();
    } catch (err) {
      console.log('insertTheme error:', err);
      // erro comum: UNIQUE constraint failed -> tema duplicado
      if (err?.message?.includes('UNIQUE') || err?.message?.toLowerCase().includes('unique')) {
        Alert.alert('Erro', 'Já existe um tema com esse nome');
      } else {
        Alert.alert('Erro', err.message || 'Falha ao inserir tema');
      }
    }
  }

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Nome do tema"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <Button title="Salvar" onPress={save} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 12, borderRadius: 6 }
});
