import React, {Component, useContext, useState} from 'react';
import {ActivityIndicator, StatusBar, TextInput} from 'react-native';
import {View, Text, StyleSheet, Alert,ScrollView, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import * as Animatable from 'react-native-animatable';

import fireStore from '@react-native-firebase/firestore';
//import AsyncStorage from '@react-native-async-storage/async-storage';
import Feather from 'react-native-vector-icons/Feather';
//import * as firebase from 'firebase';
import auth from '@react-native-firebase/auth';
import Snackbar from 'react-native-snackbar';
//import {Green} from '../values/color';
import {AuthContext} from '../components/context';
import { Colors } from '../../utills/Colors';
import {widthPercentageToDP, heightPercentageToDP} from '../../utills';
export default class SignUpScreen extends Component {
  constructor() {
    super();
    this.state = {
      displayName: '',
      email: '',
      password: '',
      isLoading: false,
      check_textInputChange: false,
      secureTextEntry: true,
      confirm_secureTextEntry: true,
      isValidUser: true,
      isValidPassword: true,
      isValidPassword1: true,
    };
  }

  ValidateEmail = mail => {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/.test(mail)) {
      return true;
    }
    return false;
  };

  textInputChange = val => {
    if (val.trim().length >= 4) {
      const state = {
        email: val,
        check_textInputChange: true,
        isValidUser: true,
      };
      this.setState(state);
    } else {
      const state = {
        email: val,
        check_textInputChange: false,
        isValidUser: false,
      };
      this.setState(state);
    }
  };
  handlePasswordChange = val => {
    if (val.trim().length >= 4) {
      const state = {
        password: val,
        isValidPassword: true,
      };
      this.setState(state);
    } else {
      const state = {
        password: val,
        isValidPassword: false,
      };
      this.setState(state);
    }
  };
  updateSecureTextEntry = () => {
    const state = {
      secureTextEntry: !this.state.secureTextEntry,
    };
    this.setState(state);
  };
  handleConfirmPasswordChange = val => {
    if (val.trim().length >= 4) {
      const state = {
        password: val,
        isValidPassword1: true,
      };
      this.setState(state);
    } else {
      const state = {
        password: val,
        isValidPassword1: false,
      };
      this.setState(state);
    }
  };
  updateSecureConfirmTextEntry = () => {
    const state = {
      confirm_secureTextEntry: !this.state.confirm_secureTextEntry,
    };
    this.setState(state);
  };
  signUpHandle = async () => {
    if (this.state.email === '' && this.state.password === '') {
      Alert.alert('Enter details to signup!');
    }else if(!this.ValidateEmail(this.state.email)) {
      this.setState({emailError : true})
    } else {
      this.setState({
        isLoading: true,
        emailError: false
      });

      
      auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(res => {
          fireStore()
          .collection('users')
          .add({
            userEmail: res.user.email,
            userPassword:this.state.password,
            uId:res.user.uid
          })
          Snackbar.show({
            text: 'User registered successfully!',

            duration: parseInt(2000),

            action: {
              text: '',
              textColor: Colors.primary,
              onPress: () => {},
            },
          });
          this.setState({
            displayName: '',
            email: '',
            password: '',
            isLoading: false,
            check_textInputChange: false,
            secureTextEntry: true,
            confirm_secureTextEntry: true,
            isValidUser: true,
            isValidPassword: true,
            isValidPassword1: true,
          });
          this.props.navigation.navigate('SignInScreen');
        })
        .catch(error => {
          // Handle Errors here.
          var errorCode = error.code;
          // var errorMessage = error.message;
          if (errorCode == 'auth/weak-password') {
              this.setState({isLoading: false});
            Snackbar.show({
              text: 'The password is too weak.',
  
              duration: parseInt(5000),
  
              action: {
                text: '',
                textColor: Colors.primary,
                onPress: () => {},
              },
            });
          

          } else if (errorCode == 'auth/email-already-in-use')  {
            Snackbar.show({
              text: 'This email already in use ',
  
              duration: parseInt(5000),
  
              action: {
                text: '',
                textColor: Colors.primary,
                onPress: () => {},
              },
            });
            this.setState({
             
              isLoading: false,
              
            });

          } else if (errorCode == 'auth/network-request-failed') {
            Snackbar.show({
              text: 'Make sure you have internet connection ',
  
              duration:Snackbar.LENGTH_INDEFINITE,
  
              action: {
                text: 'Ok',
                textColor: Colors.primary,
                onPress: () => {},
              },
            });
            this.setState({
             
              isLoading: false,
              
            });
          }
         // console.log(error);
        });

    }
    
  };
  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.preloader}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      );
    }
    return (
      <View style={styles.container}>
         <ScrollView style={{flex:1}}>
        <View>
        {/* <StatusBar backgroundColor={Green} barStyle="light-content" /> */}
        <View style={styles.header}>
          <Text style={styles.text_header}>Register Now!</Text>
        </View>

        <Animatable.View style={styles.footer} animation="fadeInUpBig">
          <Text style={styles.text_footer}>Email</Text>
          <View style={styles.action}>
            <FontAwesomeIcon name="user-o" color="#05375a" size={20} />
            <TextInput
              placeholder="Your Email"
              style={styles.textInput}
              autoCapitalize="none"
              onChangeText={val => this.textInputChange(val)}
            />
          
          </View>
          {!this.state.emailError ? null : (
            <Animatable.View animation="fadeInLeft" duration={500}>
              <Text style={styles.errorMsg}>
                Not Valid Email
              </Text>
            </Animatable.View>
          )}

          <Text style={[styles.text_footer, {marginTop: 30}]}>Password</Text>
          <View style={styles.action}>
            <FontAwesomeIcon name="lock" color="#05375a" size={20} />
            <TextInput
              placeholder="Your Password"
              secureTextEntry={this.state.secureTextEntry ? true : false}
              style={styles.textInput}
              onChangeText={val => this.handlePasswordChange(val)}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={this.updateSecureTextEntry}>
              {this.state.secureTextEntry ? (
                <Feather name="eye-off" color="grey" size={20} />
              ) : (
                <Feather name="eye" color="grey" size={20} />
              )}
            </TouchableOpacity>
          </View>
          {this.state.isValidPassword ? null : (
            <Animatable.View animation="fadeInLeft" duration={500}>
              <Text style={styles.errorMsg}>
                Password must 6 character long
              </Text>
            </Animatable.View>
          )}
          <Text style={[styles.text_footer, {marginTop: 30}]}>
            Confirm Password
          </Text>
          <View style={styles.action}>
            <FontAwesomeIcon name="lock" color="#05375a" size={20} />
            <TextInput
              placeholder="Confirm Password"
              secureTextEntry={
                this.state.confirm_secureTextEntry ? true : false
              }
              style={styles.textInput}
              onChangeText={val => this.handleConfirmPasswordChange(val)}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={this.updateSecureConfirmTextEntry}>
              {this.state.confirm_secureTextEntry ? (
                <Feather name="eye-off" color="grey" size={20} />
              ) : (
                <Feather name="eye" color="grey" size={20} />
              )}
            </TouchableOpacity>
          </View>
          {this.state.isValidPassword1 ? null : (
            <Animatable.View animation="fadeInLeft" duration={500}>
              <Text style={styles.errorMsg}>
                Password must 8 character long
              </Text>
            </Animatable.View>
          )}
          <View style={styles.button}>
            <TouchableOpacity
              onPress={() => this.signUpHandle()}
              colors={[Colors.primary, Colors.primary_dark]}
              style={styles.signIn}>
              <LinearGradient
                colors={[Colors.primary, Colors.primary_dark]}
                style={styles.signIn}>
                <Text style={[styles.textSign, {color: '#fff'}]}>SignUp</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('SignInScreen')}
              style={[
                styles.signIn,
                {borderColor: Colors.primary, borderWidth: 1, marginTop: 15},
              ]}>
              <Text style={[styles.textSign, {color:Colors.primary}]}>SignIn</Text>
            </TouchableOpacity>
          </View>
        </Animatable.View>
        </View>
        </ScrollView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  header: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: widthPercentageToDP(5),
    marginVertical:heightPercentageToDP(5),
    paddingBottom:heightPercentageToDP(1),
  },
  footer: {
    flex: 3,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  text_header: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 30,
  },
  text_footer: {
    color: '#05375a',
    fontSize: 18,
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FF0000',
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#05375a',
  },
  errorMsg: {
    color: '#FF0000',
    fontSize: 14,
  },
  button: {
    alignItems: 'center',
    marginTop: 50,
  },
  signIn: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  preloader: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  textSign: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
