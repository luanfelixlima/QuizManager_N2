// src/screens/ManageThemesAndQuestionsScreen.js
import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getThemesWithCount, deleteTheme, getQuestionsByTheme, deleteQuestion } from '../db';
import { useFocusEffect } from '@react-navigation/native';
import { commonStyles, colors } from './style/styles';

export default function ManageThemesAndQuestionsScreen({ navigation }) {
  const [themes, setThemes] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [questions, setQuestions] = useState([]);

  const loadThemes = async () => {
    const data = await getThemesWithCount();
    setThemes(data);
    if (data.length > 0 && !selectedTheme) {
      setSelectedTheme(data[0].id);
      loadQuestions(data[0].id);
    }
  };

  async function loadQuestions(themeId) {
    const data = await getQuestionsByTheme(themeId);
    setQuestions(data);
  }

  useFocusEffect(
    useCallback(() => {
      loadThemes();
    }, [])
  );

  const onThemeChange = (themeId) => {
    setSelectedTheme(themeId);
    loadQuestions(themeId);
  };

  async function handleDeleteTheme(id) {
    Alert.alert(
      'Confirmação',
      'Deseja realmente remover este tema e todas as perguntas?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'OK',
          onPress: async () => {
            await deleteTheme(id);
            if (id === selectedTheme) setSelectedTheme(null);
            loadThemes();
          },
        },
      ]
    );
  }

  async function handleDeleteQuestion(id) {
    Alert.alert(
      'Confirmação',
      'Deseja realmente remover esta pergunta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'OK',
          onPress: async () => {
            await deleteQuestion(id);
            loadQuestions(selectedTheme);
          },
        },
      ]
    );
  }

  return (
    <View style={commonStyles.container}>
      {/* Botões principais */}
      <TouchableOpacity
        style={commonStyles.button}
        onPress={() => navigation.navigate('AddTheme')}
      >
        <Text style={commonStyles.buttonText}>Adicionar Tema</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[commonStyles.button, { marginTop: 12 }]}
        onPress={() => navigation.navigate('AddQuestion')}
      >
        <Text style={commonStyles.buttonText}>Adicionar Pergunta</Text>
      </TouchableOpacity>

      {/* Seleção de tema */}
      <Text style={[commonStyles.label, { marginTop: 24 }]}>Selecione o tema:</Text>
      <View style={commonStyles.picker}>
        <Picker
          selectedValue={selectedTheme}
          onValueChange={onThemeChange}
          style={{ width: '100%' }}
        >
          {themes.map((t) => (
            <Picker.Item
              key={t.id}
              label={`${t.name} (${t.qcount} perguntas)`}
              value={t.id}
            />
          ))}
        </Picker>
      </View>

      {/* Lista de perguntas e remover tema */}
      {selectedTheme && (
        <>
          <FlatList
            data={questions}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <View style={commonStyles.listItem}>
                <Text style={commonStyles.listItemText}>{item.text}</Text>
                <TouchableOpacity
                  style={[
                    commonStyles.button,
                    commonStyles.buttonError,
                    { paddingHorizontal: 12, paddingVertical: 6 },
                  ]}
                  onPress={() => handleDeleteQuestion(item.id)}
                >
                  <Text style={commonStyles.buttonText}>Excluir</Text>
                </TouchableOpacity>
              </View>
            )}
            ListEmptyComponent={
              <Text style={commonStyles.emptyText}>Nenhuma pergunta cadastrada neste tema</Text>
            }
          />

          <TouchableOpacity
            style={[commonStyles.button, commonStyles.buttonError]}
            onPress={() => handleDeleteTheme(selectedTheme)}
          >
            <Text style={commonStyles.buttonText}>Remover Tema</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}
