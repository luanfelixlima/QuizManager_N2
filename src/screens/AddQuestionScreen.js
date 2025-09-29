// src/screens/AddQuestionScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // instale: expo install @react-native-picker/picker
import { getThemes, insertQuestion } from '../db';

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
        if (temas.length > 0) {
          setSelectedTheme(temas[0].id); // já seleciona o primeiro
        }
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
    <View style={styles.container}>
      <Text style={styles.label}>Tema:</Text>
      <Picker
        selectedValue={selectedTheme}
        onValueChange={(itemValue) => setSelectedTheme(itemValue)}
        style={styles.picker}
      >
        {themes.map((t) => (
          <Picker.Item key={t.id} label={t.name} value={t.id} />
        ))}
      </Picker>

      <Text style={styles.label}>Pergunta:</Text>
      <TextInput
        value={question}
        onChangeText={setQuestion}
        placeholder="Digite a pergunta"
        style={styles.input}
      />

      {alternatives.map((alt, idx) => (
        <View key={idx} style={styles.altRow}>
          <TextInput
            value={alt}
            onChangeText={(txt) => {
              const newAlts = [...alternatives];
              newAlts[idx] = txt;
              setAlternatives(newAlts);
            }}
            placeholder={`Alternativa ${idx + 1}`}
            style={styles.inputAlt}
          />
          <Button
            title={idx === correctIndex ? '✔' : 'Marcar correta'}
            onPress={() => setCorrectIndex(idx)}
          />
        </View>
      ))}

      <Button title="Salvar Pergunta" onPress={save} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  label: { fontWeight: 'bold', marginTop: 12 },
  picker: { borderWidth: 1, borderColor: '#ccc', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 6, marginBottom: 12 },
  altRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  inputAlt: { flex: 1, borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 6, marginRight: 8 },
});
