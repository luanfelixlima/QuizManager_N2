import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getThemesWithCount, deleteTheme, getQuestionsByTheme, deleteQuestion } from '../db';
import { useFocusEffect } from '@react-navigation/native';


export default function ManageThemesAndQuestionsScreen({ navigation }) {
  const [themes, setThemes] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [questions, setQuestions] = useState([]);
  const loadThemes = async () => {
      const data = await getThemesWithCount();
      setThemes(data);
    };



  // Carrega perguntas de um tema
  async function loadQuestions(themeId) {
    const data = await getQuestionsByTheme(themeId);
    setQuestions(data);
  }

  useFocusEffect(
    useCallback(() => {
      loadThemes();
    }, [])
  );

  // Atualiza perguntas ao trocar tema
  const onThemeChange = (themeId) => {
    setSelectedTheme(themeId);
    loadQuestions(themeId);
  };

  // Remove tema
  async function handleDeleteTheme(id) {
    Alert.alert(
      'Confirmação',
      'Deseja realmente remover este tema e todas as perguntas?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'OK', onPress: async () => {
            await deleteTheme(id);
            if (id === selectedTheme) setSelectedTheme(null);
            loadThemes();
          }}
      ]
    );
  }

  // Remove pergunta
  async function handleDeleteQuestion(id) {
    Alert.alert(
      'Confirmação',
      'Deseja realmente remover esta pergunta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'OK', onPress: async () => {
            await deleteQuestion(id);
            loadQuestions(selectedTheme);
          }}
      ]
    );
  }

  return (
    <View style={styles.container}>
      <Button title="Adicionar Tema" onPress={() => navigation.navigate('AddTheme')} />

      <Text style={styles.label}>Selecione o tema:</Text>
      <Picker selectedValue={selectedTheme} onValueChange={onThemeChange} style={styles.picker}>
        {themes.map(t => (
          <Picker.Item key={t.id} label={`${t.name} (${t.qcount} perguntas)`} value={t.id} />
        ))}
      </Picker>

      {selectedTheme && (
        <>
          <Button title="Adicionar Pergunta" onPress={() => navigation.navigate('AddQuestion', { themeId: selectedTheme })} />
          <FlatList
            data={questions}
            keyExtractor={item => String(item.id)}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <Text style={styles.text}>{item.text}</Text>
                <Button title="Excluir" color="red" onPress={() => handleDeleteQuestion(item.id)} />
              </View>
            )}
            ListEmptyComponent={<Text>Nenhuma pergunta cadastrada neste tema</Text>}
          />
          <Button title="Remover Tema" color="red" onPress={() => handleDeleteTheme(selectedTheme)} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  label: { fontWeight: 'bold', marginBottom: 8, marginTop: 16 },
  picker: { borderWidth: 1, borderColor: '#ccc', marginBottom: 16 },
  item: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 8, borderBottomWidth: 1, borderColor: '#ddd' },
  text: { flex: 1, marginRight: 8 },
});
