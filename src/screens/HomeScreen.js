import React from 'react';
import { View, Button, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Button
        title="Iniciar Quiz"
        onPress={() => navigation.navigate('QuizSetup')}
      />
      <Button
        title="Gerenciar Temas e Perguntas"
        onPress={() => navigation.navigate('ManageThemesAndQuestions')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16 },
});
