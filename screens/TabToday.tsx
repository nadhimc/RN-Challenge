import { useIsFocused } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import {  StyleSheet } from 'react-native';
import tailwind from 'tailwind-rn';
import AddTaskModal from '../components/AddTaskModal';
import TaskList from '../components/TaskList';
import { Text, View } from '../components/Themed';
import { auth } from '../firebase';
import getTasks from '../functions/getTasks';
import { RootTabScreenProps } from '../types';

export default function TabToday({ navigation }: RootTabScreenProps<'TabToday'>) {

  const [update, setUpdate] = useState(0)
  const [percentage, setPercentage] = useState(0)

  useEffect(() => {
    async function updatepercentage(){
      let data = await getTasks()
      let tgl = new Date()
      let tglawal = new Date(tgl.getFullYear(),tgl.getMonth(),tgl.getDate())
      let tglakhir = new Date(tgl.getFullYear(),tgl.getMonth(),tgl.getDate()+1)
      data = data.filter((item:any)=>{
          if(item.time>=tglawal && item.time<=tglakhir){
              return(item)
          }
          return null
      })
      let finish = data.filter((item:any)=>item.finish)
      setPercentage(Math.ceil(finish.length/data.length*100))
    }
    updatepercentage()
  }, [update])

  useEffect(() => {
    setUpdate((e:number)=>e+1)
  }, [useIsFocused()])

  return (
    <>
      <AddTaskModal updateTrigger={()=>setUpdate((e:number)=>e+1)} />
      <View style={styles.container}>
        <View style={tailwind("p-5")}>
          <Text style={tailwind("text-3xl")}>Hello, {auth.currentUser?.displayName?auth.currentUser?.displayName:"User"}</Text>
          <View>
            <Text>Progress</Text>
            <View style={tailwind("w-full h-4 rounded-full relative mt-1 overflow-hidden")}>
              <View style={{width: `${percentage}%`,...tailwind("absolute top-0 left-0 bg-green-400 h-full")}} />
            </View>
          </View>
        </View>
        <View style={tailwind("flex-1 px-5")}>
          <TaskList updateTrigger={()=>setUpdate((e:number)=>e+1)} update={update} />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
