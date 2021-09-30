import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  Alert,
  FlatList,
  Button,
  useColorScheme,
  BackHandler,
  View,
  TextInput,
} from 'react-native';
import {Linking} from 'react-native';
import Snackbar from 'react-native-snackbar';
import {widthPercentageToDP, heightPercentageToDP} from '../utills';
import {Colors} from '../utills/Colors';
import Layout from '../utills/Layout';
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import fireStore from '@react-native-firebase/firestore';
//import {AsyncStorage} from '@react-native-async-storage/async-storage';
import AsyncStorage from '@react-native-community/async-storage';

import RNPrint from 'react-native-print';
import RNHTMLtoPDF from 'react-native-html-to-pdf-lite';
import { firebase } from '@react-native-firebase/auth';
import LinearGradient from 'react-native-linear-gradient';

const FolderData = ({navigation, route}) => {
  const {title, folderKey} = route.params;
  const [selectedPrinter, setSelectedPrinter] = useState(null);
  const [folderName, setFolderName] = useState(title);
  const [shopName, setShopName] = useState('');
  const [shopUrl, setShopUrl] = useState('');
  const [userId, setUserId] = useState('');
  const [myItems, setMyItems] = useState([]);
  const [mydata, setMydata] = useState([]);
 

  function handleBackButtonClick() {
    navigation.goBack();
    return true;
  }

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
    };
  }, []);

  //fetech data from firebase



  useEffect(() => {
    const user = firebase.auth().currentUser;
   setUserId(user.uid)

    const subscriber = fireStore()
      .collection('Folder')
      .doc(folderKey)
      .collection('Shops')
      .onSnapshot(querySnapshot => {
        const users = [];

        querySnapshot.forEach(documentSnapshot => {
          users.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });

        setMydata(users);
      });

    return () => subscriber();
  }, []);

  //Logout

  const logoutHandle =()=>{
    Alert.alert(
      'Log out',
      'Do you want to logout?',
      [
          { text: 'Cancel', onPress: () => { return null } },
          {
              text: 'Confirm', onPress: () => {
                  AsyncStorage.clear();
                 navigation.navigate('SignInScreen')
              }
          },
      ],
      { cancelable: false }
  )
  }

  //submit data on submit button
  const addUrl = item => {
    if (!shopName || !shopUrl) {
    } else {
      fireStore()
        .collection('Folder')
        .doc(folderKey)
        .collection('Shops')
        .add({
          shopName: shopName,
          shopUrl: shopUrl,
        })
        .then(() => {
          setShopName('');
          setShopUrl('');
          Snackbar.show({
            text: 'Shop added successfully ',

            duration: parseInt(2000),

            action: {
              text: '',
              textColor: Colors.primary,
              onPress: () => {},
            },
          });
        });
    }
  };

  //delete shop

  const deleteShop = item => {
    Alert.alert('Delete Shop', 'Are you sure want to delete shop', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: () => {
          fireStore()
            .collection('Folder')
            .doc(folderKey)
            .collection('Shops')
            .doc(item.key)
            .delete()
            .then(() => {
              Snackbar.show({
                text: 'Shop deleted successfully ',

                duration: parseInt(2000),

                action: {
                  text: 'Ok',
                  textColor: Colors.primary,
                  onPress: () => {},
                },
              });
            });
        },
      },
    ]);
  };

  //Delete folder

  const deleteFolder = item => {
    Alert.alert('Delete Folder', 'Are you sure want to delete Folder', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: () => {
          fireStore()
            .collection('Folders').doc(userId).collection('Folder')
            .doc(folderKey)
            .delete()
            .then(() => {
              Snackbar.show({
                text: 'Folder deleted successfully ',

                duration: parseInt(2000),

                action: {
                  text: ' ',
                  textColor: Colors.primary,
                  onPress: () => {},
                },
              });
              navigation.navigate('Home');
            });
        },
      },
    ]);
  };
  

  //Print shops urls

  const printPDF = async () => {
 


    const results = await RNHTMLtoPDF.convert({
      html:`
      <h2>${folderName}</h2>
      <table style="width:100%;border: 1px solid black; border-collapse: collapse;padding:4px;" >
      <thead>
  <tr>
    <th style="text-align: left;border: 1px solid black;padding:4px;font-size:16px">Shop Name</th>
    <th style="text-align: left;border: 1px solid black;padding:4px;font-size:16px">Shop URL</th>
  </tr>
  </thead>
  <tbody>
  
  ${mydata.map(item=>(
`
    <tr>
    <td style="border: 1px solid black;padding:4px;font-size:14px">${item.shopName}</td>
    <td style="border: 1px solid black;padding:4px;font-size:14px">${item.shopUrl}</td>
  </tr>
`
  ))}
  </tbody>
</table>`
  ,
      fileName: 'test',
      base64: true,
    });

    await RNPrint.print({filePath: results.filePath});
  };
  

  return (
    <View style={{flex:1}}>
      <StatusBar backgroundColor={Colors.gray} barStyle="light-content" />
     <ScrollView style={{flex:1}}>
       <View>
    
      <View style={styles.gradientView}>
        <View style={styles.firstView}>
          <View style={{flexDirection: 'row'}}>
            <Image
              style={styles.foodImage}
              source={require('../assets/ic_logo.png')}
            />
            <View style={styles.middleView}>
              <Text style={styles.middleHeading}>{folderName}</Text>
            </View>
          </View>

          <Button title="Delete Folder" onPress={() => deleteFolder()} />
        </View>

        <View
          style={{
            paddingHorizontal: 12,
          }}>
          <Text style={styles.TextLabel}>Name of Shop*</Text>
          <TextInput
            onChangeText={setShopName}
            value={shopName}
            autoFocus={true}
            keyboardType="default"
            placeholder="Enter Shop Name"
            style={styles.middleHeading}
          />
          <Text style={styles.TextLabel}>Enter Url*</Text>
          <TextInput
            onChangeText={setShopUrl}
            value={shopUrl}
            keyboardType="default"
            placeholder="https://www.amazon.com"
            style={styles.middleHeading}
          />
        </View>
        <View style={styles.btnView}>
          <Button title="Submit" onPress={() => addUrl()} />
        </View>
      </View>
      <View>
        <View
          style={{
            margin: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text style={styles.urlLabel}>Saved Urls</Text>
          <TouchableOpacity activeOpacity={0.75} onPress={() => printPDF()}>
            <MaterialIcons
              name="print"
              style={{color: Colors.gray, fontSize: 30, marginRight:10}}
            />
          </TouchableOpacity>

          {/* <TouchableOpacity
              onPress={() => logoutHandle()}
              style={[styles.signIn,{position:'absolute',backgroundColor:Colors.primary}]}
             >
              
                <Text style={[styles.textSign, {color:Colors.white}]}>Logout</Text>
             
            </TouchableOpacity>  */}
        </View>
        <View>
        <FlatList
          data={mydata}
          renderItem={({item}) => (
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                margin: 5,
                padding: 5,
                backgroundColor: Colors.white,
                elevation: 1,
              }}>
              <View style={{justifyContent: 'center'}}>
                <MaterialIcons
                  name="add-shopping-cart"
                  style={{color: Colors.black, fontSize: 30}}
                />
              </View>
              <TouchableOpacity
                style={styles.flatlistView}
                activeOpacity={0.75}
                onPress={() => Linking.openURL(item.shopUrl)}>
                <Text style={styles.folderName}>{item.shopName}</Text>
                <Text
                  style={[styles.folderName, {color: Colors.primary}]}
                  numberOfLines={1}>
                  {item.shopUrl}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.75}
                onPress={() => {
                  deleteShop(item);
                }}
                style={{
                  justifyContent: 'center',
                  alignItems: 'flex-end',
                  marginHorizontal: 20,
                }}>
                <FontAwesome
                  name="trash-o"
                  style={{color: Colors.black, fontSize: 25}}
                />
              </TouchableOpacity>
            </View>
          )}
        />
        </View>

         
      </View>
    
      </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  gradientView: {
    width: '100%',
    alignSelf: 'center',
    // paddingLeft: 15,
    paddingTop: 15,
    marginTop: 20,
    elevation: 0.5,
    borderBottomRightRadius: 8,
    borderBottomLeftRadius: 8,
  },
  firstView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    alignItems: 'center',
    width: widthPercentageToDP(97),
    alignSelf: 'center',
    shadowOffset: {
      width: 0,
      height: 0,
    },

    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 0.01,
    borderRadius: 8,
    marginVertical: 5,
    padding: 10,
  },
  foodImage: {
    height: 50,

    width: 50,
    // resizeMode: 'contain',
  },
  btnView: {
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
    width: widthPercentageToDP(40),
    padding: 10,
  },
  flatlistView: {
    flexDirection: 'column',
    marginLeft: 5,
    padding: 5,
    width: Layout.isSmallDevice
      ? widthPercentageToDP(60)
      : widthPercentageToDP(70),
  },
  middleView: {
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  middleHeading: {
    letterSpacing: 0.04,
    marginLeft: 10,
    fontSize: Layout.isSmallDevice ? 14 : 16,
    color: Colors.black,
  },
  urlLabel: {
    letterSpacing: 0.04,
    marginLeft: 10,
    fontSize: Layout.isSmallDevice ? 14 : 16,
    color: Colors.gray,
  },
  TextLabel: {
    borderBottomColor: Colors.white,
    letterSpacing: 0.04,
    color: Colors.borderColor,
    top: 7,
    padding: 12,
  },
  middleText: {
    letterSpacing: 0.04,
    marginRight: 10,
    fontSize: Layout.isSmallDevice ? 14 : 16,
    color: Colors.black,
  },

  btnText: {
    color: Colors.primary,
    justifyContent: 'center',
    // fontFamily: fonts['OpenSans-SemiBold'],
    alignSelf: 'center',
    marginHorizontal: 10,
    fontWeight: '700',
    letterSpacing: 0.04,
    fontSize: Layout.isSmallDevice ? 14 : 18,
  },
  folderName: {
    color: Colors.gray,
    // fontFamily: fonts['OpenSans-SemiBold'],

    fontWeight: '600',
    letterSpacing: 0.04,
    fontSize: Layout.isSmallDevice ? 12 : 14,
  },
  folderName: {
    color: Colors.black,
    // fontFamily: fonts['OpenSans-SemiBold'],

    fontWeight: '600',
    letterSpacing: 0.04,
    fontSize: Layout.isSmallDevice ? 14 : 16,
  },
  signIn: {
    width: '40%',
    height: 40,
    justifyContent: 'center',
    marginTop:heightPercentageToDP(50),
    alignItems: 'center',
    alignSelf:'center',
    borderRadius: 10,
    
    borderColor: Colors.primary_dark, borderWidth: 1,
  },
  textSign: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default FolderData;
