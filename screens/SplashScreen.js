import React from 'react';
import {View, Text, StyleSheet,StatusBar, Image, SafeAreaView} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { Colors } from '../utills/Colors';
const SplashScreen = () => {
  return (
   
   
    <View
      style={{flex: 1,backgroundColor:Colors.white, alignContent: 'center', justifyContent: 'center'}}
      // colors={[Colors.primary,Colors.primary_dark]}
      >
           <StatusBar backgroundColor={Colors.white} barStyle="dark-content" />
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <Animatable.Image
          animation="flipInY"
          duraton="2000"
          style={{height:200,width:200}}
          source={require('../assets/ic_logo.png')}
        />
      </View>
    </View>
   
  );
};
export default SplashScreen;
const styles = StyleSheet.create({
  container: {
    alignContent: 'center',
    justifyContent: 'center',
  },
});
