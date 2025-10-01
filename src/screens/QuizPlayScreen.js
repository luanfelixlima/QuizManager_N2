import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { getRandomQuestions } from '../db';
import { quizStyles as styles } from '../screens/style/styles';

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
    return <View style={styles.container}><Text style={styles.loading}>Carregando...</Text></View>;

  const q = questions[index];
  const selectedAltId = answers[q.id];

  return (
    <View style={styles.container}>
      {/* Contador */}
      <Text style={styles.counter}>Pergunta {index + 1} de {questions.length}</Text>

      {/* Enunciado */}
      <View style={styles.questionBox}>
        <Text style={styles.question}>{q.text}</Text>
      </View>

      {/* Alternativas */}
      <ScrollView style={{ marginVertical: 12 }}>
        {q.alts.map(a => {
          const isSelected = a.id === selectedAltId;
          return (
            <TouchableOpacity
              key={a.id}
              style={[styles.alt, isSelected && styles.selectedAlt]}
              onPress={() => selectAlt(q.id, a.id)}
              activeOpacity={0.7}
            >
              <Text style={[styles.altText, isSelected && styles.selectedText]}>{a.text}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Navegação */}
      <View style={styles.navigation}>
        {index > 0 && (
          <TouchableOpacity style={styles.navButton} onPress={() => setIndex(index - 1)}>
            <Text style={styles.navButtonText}>◀ Anterior</Text>
          </TouchableOpacity>
        )}

        {index < questions.length - 1 ? (
          <TouchableOpacity style={styles.navButton} onPress={() => setIndex(index + 1)}>
            <Text style={styles.navButtonText}>Próxima ▶</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.navButton, styles.finishButton]} onPress={finish}>
            <Text style={styles.navButtonText}>Finalizar Quiz ✅</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
