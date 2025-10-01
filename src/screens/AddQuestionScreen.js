// src/screens/AddQuestionScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getThemes, insertQuestion } from '../db';
import { commonStyles, colors } from './style/styles';

export default function AddQuestionScreen({ navigation }) {
  const [themes, setThemes] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [question, setQuestion] = useState('');
  const [alternatives, setAlternatives] = useState(['', '', '', '']);
  const [correctIndex, setCorrectIndex] = useState(0);

  useEffect(() => {
    async function loadThemes() {
      try {
        const temas = await getThemes();
        setThemes(temas);
        if (temas.length > 0) setSelectedTheme(temas[0].id);
      } catch (err) {
        console.error('Erro ao carregar temas:', err);
      }
    }
    loadThemes();
  }, []);

  async function save() {
    if (!selectedTheme || !question.trim()) {
      Alert.alert('Erro', 'Preencha a pergunta e selecione um tema.');
      return;
    }

    if (alternatives.some((alt) => !alt.trim())) {
      Alert.alert('Erro', 'Preencha todas as alternativas.');
      return;
    }

    try {
      await insertQuestion(selectedTheme, question, alternatives, correctIndex);
      Alert.alert('Sucesso', 'Pergunta cadastrada!');
      navigation.goBack();
    } catch (err) {
      console.error('Erro ao inserir pergunta:', err);
      Alert.alert('Erro', err.message || 'Falha ao cadastrar pergunta.');
    }
  }

  return (
    <ScrollView style={commonStyles.container}>
      <Text style={commonStyles.label}>Tema:</Text>
      <View style={commonStyles.picker}>
        <Picker
          selectedValue={selectedTheme}
          onValueChange={(itemValue) => setSelectedTheme(itemValue)}
        >
          {themes.map((t) => (
            <Picker.Item key={t.id} label={t.name} value={t.id} />
          ))}
        </Picker>
      </View>

      <Text style={commonStyles.label}>Pergunta:</Text>
      <TextInput
        value={question}
        onChangeText={setQuestion}
        placeholder="Digite a pergunta"
        style={commonStyles.input}
      />

      {alternatives.map((alt, idx) => {
        const isCorrect = idx === correctIndex;
        return (
          <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <TextInput
              value={alt}
              onChangeText={(txt) => {
                const newAlts = [...alternatives];
                newAlts[idx] = txt;
                setAlternatives(newAlts);
              }}
              placeholder={`Alternativa ${idx + 1}`}
              style={[commonStyles.input, { flex: 1, marginRight: 8 }]}
            />
            <TouchableOpacity
              style={[
                commonStyles.button,
                { paddingHorizontal: 12, backgroundColor: isCorrect ? colors.secondary : colors.primary },
              ]}
              onPress={() => setCorrectIndex(idx)}
            >
              <Text style={commonStyles.buttonText}>{isCorrect ? '✔' : 'Marcar'}</Text>
            </TouchableOpacity>
          </View>
        );
      })}

      <TouchableOpacity style={commonStyles.button} onPress={save}>
        <Text style={commonStyles.buttonText}>Salvar Pergunta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
