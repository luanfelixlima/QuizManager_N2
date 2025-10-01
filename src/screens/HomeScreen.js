// src/screens/HomeScreen.js
import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { commonStyles, colors } from './style/styles';

export default function HomeScreen({ navigation }) {
  return (
    <View style={[commonStyles.container, { justifyContent: 'space-around' }]}>
      
      {/* Logo / Header */}
      <View style={{ alignItems: 'center' }}>
        {/* Se tiver um logo, pode substituir o Text abaixo por <Image source={require('../assets/logo.png')} /> */}
        <Text style={{
          fontSize: 36,
          fontWeight: '800',
          color: colors.primary,
          textAlign: 'center',
          marginBottom: 8,
        }}>
          Quiz Master
        </Text>
        <Text style={{
          fontSize: 16,
          color: '#666',
          textAlign: 'center',
          paddingHorizontal: 16,
        }}>
          Teste seus conhecimentos de forma divertida e desafiadora
        </Text>
      </View>

      {/* Botões principais */}
      <View style={{ width: '100%', paddingHorizontal: 32 }}>
        <TouchableOpacity
          style={[commonStyles.button, { marginBottom: 16 }]}
          onPress={() => navigation.navigate('QuizSetup')}
          activeOpacity={0.85}
        >
          <Text style={commonStyles.buttonText}>Iniciar Quiz</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[commonStyles.button, { backgroundColor: colors.secondary }]}
          onPress={() => navigation.navigate('ManageThemesAndQuestions')}
          activeOpacity={0.85}
        >
          <Text style={[commonStyles.buttonText, { color: colors.text }]}>
            Gerenciar Temas e Perguntas
          </Text>
        </TouchableOpacity>
      </View>

      {/* Footer / Rodapé */}
      <View style={{ alignItems: 'center', marginTop: 40 }}>
        <Text style={{ color: '#999', fontSize: 12 }}>
          Desenvolvido com React Native
        </Text>
      </View>
    </View>
  );
}
