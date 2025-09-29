import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './src/screens/HomeScreen';
import ManageThemesAndQuestionsScreen from './src/screens/ManageThemesAndQuestionsScreen';
import AddThemeScreen from './src/screens/AddThemeScreen';
import AddQuestionScreen from './src/screens/AddQuestionScreen';
import QuizSetupScreen from './src/screens/QuizSetupScreen';
import QuizPlayScreen from './src/screens/QuizPlayScreen';
import QuizResultScreen from './src/screens/QuizResultScreen';

import { initDB, insertTheme, getThemes } from './src/db';

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    async function setup() {
      await initDB();

      // só como teste — você pode comentar depois
      await insertTheme("História");
      const temas = await getThemes();
      console.log("Temas cadastrados:", temas);
    }
    setup();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
  <Stack.Screen name="Home" component={HomeScreen} />
  <Stack.Screen name="QuizSetup" component={QuizSetupScreen} />
  <Stack.Screen name="QuizPlay" component={QuizPlayScreen} />
  <Stack.Screen name="QuizResult" component={QuizResultScreen} />

  {/* REGISTRE A NOVA TELA */}
  <Stack.Screen 
    name="ManageThemesAndQuestions" 
    component={ManageThemesAndQuestionsScreen} 
    options={{ title: 'Gerenciar Temas e Perguntas' }}
  />

  <Stack.Screen name="AddTheme" component={AddThemeScreen} />
  <Stack.Screen name="AddQuestion" component={AddQuestionScreen} />
</Stack.Navigator>

    </NavigationContainer>
  );
}
