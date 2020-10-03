import React from 'react';
import { Button, View } from 'react-native';
// import styles from "../Styles/homeStyles.js";


function Home ({ navigation }){
    return(
      <View style={{ flex: 1, flexDirection:"row",justifyContent:"space-around",alignItems:"center" }}>
        <Button
          title="Log In"
          onPress={() => navigation.navigate('log')}
      />
        <Button
          title="Sign In"
          onPress={() => navigation.navigate('sign')}
        />
      </View>
    )
}

export default Home