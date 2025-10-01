// src/screens/QuizResultScreen.js
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { commonStyles, colors } from './style/styles';

export default function QuizResultScreen({ route, navigation }) {
  const { details, hits, total } = route.params;
  const percent = Math.round((hits / total) * 100);

  const renderItem = ({ item, index }) => (
    <View style={styles.item}>
      <Text style={styles.questionText}>{index + 1}. {item.question}</Text>
      <Text>Sua resposta: {item.chosen || '-'}</Text>
      {!item.ok 
        ? <Text style={styles.incorrect}>Correta: {item.correct}</Text>
        : <Text style={styles.correct}>Você acertou</Text>
      }
    </View>
  );

  const ListHeader = () => (
    <View style={{ marginBottom: 16 }}>
      <Text style={styles.title}>Resultado</Text>
      <Text style={styles.summary}>Acertos: {hits} / {total} ({percent}%)</Text>
    </View>
  );

  const ListFooter = () => (
    <TouchableOpacity style={[commonStyles.button, { marginTop: 16 }]} onPress={() => navigation.popToTop()}>
      <Text style={commonStyles.buttonText}>Voltar ao Início</Text>
    </TouchableOpacity>
  );

  return (
    <View style={commonStyles.container}>
      <FlatList
        data={details}
        keyExtractor={(item, idx) => String(idx)}
        renderItem={renderItem}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={ListFooter}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: '700', color: colors.text },
  summary: { fontSize: 16, marginBottom: 8, color: colors.text },
  item: { padding: 12, borderBottomWidth: 1, borderColor: '#eee', borderRadius: 8, backgroundColor: colors.white, marginBottom: 8 },
  questionText: { fontWeight: '600', marginBottom: 4, color: colors.text },
  correct: { color: 'green', marginTop: 4 },
  incorrect: { color: 'red', marginTop: 4 },
});
