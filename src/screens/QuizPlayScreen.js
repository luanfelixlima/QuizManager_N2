import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { getRandomQuestions } from '../db';

export default function QuizPlayScreen({ route, navigation }) {
  const { themeId, totalQuestions } = route.params;
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  useEffect(() => { loadQuestions(); }, []);

  async function loadQuestions() {
    try {
      const qs = await getRandomQuestions(themeId, totalQuestions);
      setQuestions(qs);
    } catch (err) {
      console.error('Erro ao carregar perguntas:', err);
      Alert.alert('Erro', 'Não foi possível carregar as perguntas');
    }
  }

  function selectAlt(qid, altId) {
    setAnswers(prev => ({ ...prev, [qid]: altId }));
  }

  function finish() {
    if (questions.some(q => !answers[q.id])) {
      Alert.alert('Aviso','Responda todas as perguntas antes de finalizar'); 
      return;
    }
    const details = questions.map(q => {
      const chosen = answers[q.id];
      const chosenAlt = q.alts.find(a => a.id === chosen);
      const correctAlt = q.alts.find(a => a.is_correct === 1);
      return { question: q.text, chosen: chosenAlt?.text || null, correct: correctAlt.text, ok: chosen === correctAlt.id };
    });
    const hits = details.filter(d => d.ok).length;
    navigation.replace('QuizResult', { details, hits, total: questions.length });
  }

  if (questions.length === 0) 
    return <View style={styles.container}><Text>Carregando...</Text></View>;

  const q = questions[index];
  const selectedAltId = answers[q.id];

  return (
    <View style={styles.container}>
      <Text style={styles.counter}>{index + 1} / {questions.length}</Text>
      <Text style={styles.question}>{q.text}</Text>
      <ScrollView style={{ marginTop: 12 }}>
        {q.alts.map(a => {
          const isSelected = a.id === selectedAltId;
          return (
            <TouchableOpacity
              key={a.id}
              style={[styles.alt, isSelected && styles.selectedAlt]}
              onPress={() => selectAlt(q.id, a.id)}
            >
              <Text style={isSelected && styles.selectedText}>{a.text}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.navigation}>
        {index > 0 && <Button title="Anterior" onPress={() => setIndex(index - 1)} />}
        {index < questions.length - 1 
          ? <Button title="Próxima" onPress={() => setIndex(index + 1)} />
          : <Button title="Finalizar Quiz" onPress={finish} />
        }
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  counter: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  question: { fontSize: 18, marginBottom: 12 },
  alt: { 
    padding: 12, 
    borderWidth: 1, 
    borderColor: '#ccc', 
    borderRadius: 6, 
    marginBottom: 8 
  },
  selectedAlt: {
    backgroundColor: '#cce5ff',
    borderColor: '#3399ff',
  },
  selectedText: {
    fontWeight: 'bold',
    color: '#0056b3',
  },
  navigation: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: 16 
  },
});
