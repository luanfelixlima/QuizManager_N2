// src/screens/QuizSetupScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getThemesWithCount } from '../db';

export default function QuizSetupScreen({ navigation }) {
  const [themes, setThemes] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [questionCount, setQuestionCount] = useState(1);
  const [maxQuestions, setMaxQuestions] = useState(1);

  useEffect(() => {
    async function loadThemes() {
      try {
        const temas = await getThemesWithCount();
        setThemes(temas);
        if (temas.length > 0) {
          setSelectedTheme(temas[0].id);
          setMaxQuestions(temas[0].qcount || 1);
          setQuestionCount(Math.min(5, temas[0].qcount || 1)); // valor inicial
        }
      } catch (err) {
        console.error('Erro ao carregar temas:', err);
      }
    }
    loadThemes();
  }, []);

  const onThemeChange = (themeId) => {
    const tema = themes.find(t => t.id === themeId);
    setSelectedTheme(themeId);
    setMaxQuestions(tema.qcount || 1);
    setQuestionCount(Math.min(questionCount, tema.qcount || 1));
  };

  const startQuiz = () => {
    if (!selectedTheme) {
      Alert.alert('Erro', 'Selecione um tema.');
      return;
    }
    if (questionCount < 1) {
      Alert.alert('Erro', 'Escolha pelo menos 1 pergunta.');
      return;
    }

    // Navega para a tela de jogar quiz passando parâmetros
    navigation.navigate('QuizPlay', { themeId: selectedTheme, totalQuestions: questionCount });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Selecione o tema:</Text>
      <Picker
        selectedValue={selectedTheme}
        onValueChange={onThemeChange}
        style={styles.picker}
      >
        {themes.map(t => (
          <Picker.Item key={t.id} label={`${t.name} (${t.qcount} perguntas)`} value={t.id} />
        ))}
      </Picker>

      <Text style={styles.label}>Quantidade de perguntas:</Text>
      <Picker
        selectedValue={questionCount}
        onValueChange={setQuestionCount}
        style={styles.picker}
      >
        {Array.from({ length: maxQuestions }, (_, i) => i + 1).map(n => (
          <Picker.Item key={n} label={`${n}`} value={n} />
        ))}
      </Picker>

      <Button title="Iniciar Quiz" onPress={startQuiz} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  label: { fontWeight: 'bold', marginTop: 12, marginBottom: 6 },
  picker: { borderWidth: 1, borderColor: '#ccc', marginBottom: 12 }
});
