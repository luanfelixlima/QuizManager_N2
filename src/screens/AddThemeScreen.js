// src/screens/AddThemeScreen.js
import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, Alert } from 'react-native';
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
      if (err?.message?.includes('UNIQUE') || err?.message?.toLowerCase().includes('unique')) {
        Alert.alert('Erro', 'Já existe um tema com esse nome');
      } else {
        Alert.alert('Erro', err.message || 'Falha ao inserir tema');
      }
    }
  }

  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.label}>Nome do Tema</Text>
      <TextInput
        placeholder="Digite o tema"
        value={name}
        onChangeText={setName}
        style={commonStyles.input}
      />

      <TouchableOpacity style={commonStyles.button} onPress={save} activeOpacity={0.8}>
        <Text style={commonStyles.buttonText}>Salvar</Text>
      </TouchableOpacity>
    </View>
  );
}
