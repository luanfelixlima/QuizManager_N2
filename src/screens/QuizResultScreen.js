import React from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';


export default function QuizResultScreen({ route, navigation }){
const { details, hits, total } = route.params;
const percent = Math.round((hits/total)*100);


return (
<View style={styles.container}>
<Text style={styles.title}>Resultado</Text>
<Text style={styles.summary}>Acertos: {hits} / {total} ({percent}%)</Text>
<FlatList data={details} keyExtractor={(i,idx)=>String(idx)} renderItem={({item, index})=> (
<View style={styles.item}>
<Text style={{fontWeight:'600'}}>{index+1}. {item.question}</Text>
<Text>Seu answer: {item.chosen}</Text>
{!item.ok && <Text style={{color:'red'}}>Correta: {item.correct}</Text> }
{item.ok && <Text style={{color:'green'}}>Você acertou</Text>}
</View>
)} />


<Button title="Voltar ao Início" onPress={()=>navigation.popToTop()} />
</View>
);
}


const styles = StyleSheet.create({ container:{flex:1,padding:16}, title:{fontSize:22,fontWeight:'700',marginBottom:8}, summary:{fontSize:16,marginBottom:8}, item:{padding:10,borderBottomWidth:1,borderColor:'#eee'} });
