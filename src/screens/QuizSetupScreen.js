// src/screens/QuizSetupScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getThemesWithCount } from '../db';
import { commonStyles, colors } from './style/styles';

export default function QuizSetupScreen({ navigation }) {
  const [themes, setThemes] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [questionCount, setQuestionCount] = useState(0);
  const [maxQuestions, setMaxQuestions] = useState(0);

  useEffect(() => {
    async function loadThemes() {
      try {
        const data = await getThemesWithCount();
        setThemes(data);
        if (data.length > 0) {
          const firstTema = data.find(t => t.qcount > 0) || data[0];
          setSelectedTheme(firstTema.id);
          setMaxQuestions(firstTema.qcount || 0);
          setQuestionCount(firstTema.qcount > 0 ? Math.min(5, firstTema.qcount) : 0);
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
    setMaxQuestions(tema.qcount || 0);
    setQuestionCount(tema.qcount > 0 ? Math.min(5, questionCount) : 0);
  };

  const startQuiz = () => {
    const tema = themes.find(t => t.id === selectedTheme);
    if (!tema || tema.qcount === 0) {
      Alert.alert('Erro', 'Este tema não possui perguntas.');
      return;
    }
    navigation.navigate('QuizPlay', { themeId: selectedTheme, totalQuestions: questionCount });
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} style={commonStyles.container}>
      <View style={{ width: '100%', alignItems: 'center' }}>
        <Text style={[commonStyles.label, { fontSize: 22, marginBottom: 16 }]}>Escolha o tema</Text>
        <View style={{ width: '80%' }}>
          <Picker
            selectedValue={selectedTheme}
            onValueChange={onThemeChange}
            style={commonStyles.picker}
          >
            {themes.map(t => (
              <Picker.Item
                key={t.id}
                label={`${t.name} (${t.qcount} perguntas)`}
                value={t.id}
              />
            ))}
          </Picker>
        </View>

        {selectedTheme && (
          <>
            <Text style={[commonStyles.label, { fontSize: 22, marginTop: 24, marginBottom: 16 }]}>Quantidade de perguntas</Text>
            <View style={{ width: '50%' }}>
              <Picker
                selectedValue={questionCount}
                onValueChange={setQuestionCount}
                enabled={maxQuestions > 0}
                style={commonStyles.picker}
              >
                {Array.from({ length: maxQuestions }, (_, i) => i + 1).map(n => (
                  <Picker.Item key={n} label={`${n}`} value={n} />
                ))}
              </Picker>
            </View>

            <TouchableOpacity
              style={[commonStyles.button, { marginTop: 32, width: '60%' }]}
              onPress={startQuiz}
              activeOpacity={0.85}
              disabled={maxQuestions === 0}
            >
              <Text style={commonStyles.buttonText}>Iniciar Quiz</Text>
            </TouchableOpacity>

            {maxQuestions === 0 && (
              <Text style={{ textAlign: 'center', color: colors.error, marginTop: 20 }}>
                Este tema não possui perguntas disponíveis.
              </Text>
            )}
          </>
        )}
      </View>
    </ScrollView>
  );
}
