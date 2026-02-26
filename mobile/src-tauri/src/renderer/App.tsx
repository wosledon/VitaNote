// This file is the renderer entry point for Tauri mobile
// It's used for iOS and Android platforms

import { useState } from 'react'
import { View, Text, Button, ScrollView, SafeAreaView } from 'react-native'

const App = () => {
  const [count, setCount] = useState(0)

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <ScrollView>
        <View style={{ padding: 20 }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
            VitaNote Mobile
          </Text>
          
          <View style={{ marginVertical: 20 }}>
            <Text style={{ fontSize: 18, marginBottom: 10 }}>
              Count: {count}
            </Text>
            <Button title="Increment" onPress={() => setCount(count + 1)} />
          </View>
          
          <View style={{ marginVertical: 20 }}>
            <Button title="Navigation Test" onPress={() => {}} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default App
