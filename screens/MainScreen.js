

import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Text,
  Button,
  useColorScheme,
  BackHandler,
  Alert,
  View,
  TextInput,
} from 'react-native';
import {widthPercentageToDP, heightPercentageToDP} from '../utills';

import RNPrint from 'react-native-print';
import RNHTMLtoPDF from 'react-native-html-to-pdf-lite';
import {Colors} from '../utills/Colors';
import Layout from '../utills/Layout';

import Snackbar from 'react-native-snackbar';
import fireStore from '@react-native-firebase/firestore';
import {database, ref, set} from 'firebase/database';
import AsyncStorage from '@react-native-community/async-storage';

//import {AsyncStorage} from '@react-native-async-storage/async-storage';
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import { firebase } from '@react-native-firebase/auth';
import LinearGradient from 'react-native-linear-gradient';
const MainScreen = ({navigation}) => {
  const [text, onChangeText] = useState('');
  const [myItems, setMyItems] = useState([]);
  const [mydata, setMydata] = useState([]);
  
  // const [theArray, setTheArray] = useState([]);
  // const addEntryClick = () => {
  //   setTheArray([...theArray, `Entry ${theArray.text}`]);
  // };
  const printPDF = async () => {
    const user = firebase.auth().currentUser;
    const userId =user.uid;
  fireStore().collection('Folders').doc(userId).collection('Folder')
      .onSnapshot(querySnapshot => {
        const users = [];

        querySnapshot.forEach(documentSnapshot => {
          const ab=  documentSnapshot.id
          

          fireStore()
          .collection('Folder')
          .doc(ab)
          .collection('Shops')
          .onSnapshot(querySnapshot => {
            const users = [];
    
            querySnapshot.forEach(documentSnapshot => {
              console.log({documentSnapshot})
              users.push({
                ...documentSnapshot.data(),
                key: documentSnapshot.id,
              });
            });
    
           // setMydata(users);
          });





           console.log({mydata})
          // users.push({
          //   ...documentSnapshot.data(),
          //   key: documentSnapshot.id,

            
            
       //   });
        });
        setMydata(users);
        // setLoading(false);
      });


    const results = await RNHTMLtoPDF.convert({
      html:`
    
      <table style="width:100%;border: 1px solid black; border-collapse: collapse;padding:4px;" >
      <thead>
  <tr>
    <th style="text-align: left;border: 1px solid black;padding:4px;font-size:16px">Folder Name</th>
    <th style="text-align: left;border: 1px solid black;padding:4px;font-size:16px">Shop Name</th>
    <th style="text-align: left;border: 1px solid black;padding:4px;font-size:16px">Shop URL</th>
  </tr>
  </thead>
  <tbody>
  
  ${mydata.map(item=>(
`
    <tr>
    <td style="border: 1px solid black;padding:4px;font-size:14px">${item.folderName}</td>
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
  



  useEffect(() => {
    const backAction = () => {
      Alert.alert("Alert!", "Are you sure you want to exit", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel"
        },
        { text: "YES", onPress: () => BackHandler.exitApp() }
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

//   useEffect(()=>{
//     const user = firebase.auth().currentUser;
//     const userId =user.uid
//     fireStore().collection('Folders').doc(userId).collection('Folder')
//       .onSnapshot(querySnapshot => {
//         const users = [];

//         querySnapshot.forEach(documentSnapshot => {
//           const ab=  documentSnapshot.id
          

//           fireStore()
//           .collection('Folder')
//           .doc(ab)
//           .collection('Shops')
//           .onSnapshot(querySnapshot => {
//             const users = [];
    
//             querySnapshot.forEach(documentSnapshot => {
//               users.push({
//                 ...documentSnapshot.data(),
//                 key: documentSnapshot.id,
//               });
//             });
    
//             setMydata(users);
//           });





//            console.log({mydata})
//           // users.push({
//           //   ...documentSnapshot.data(),
//           //   key: documentSnapshot.id,

            
            
//        //   });
//         });
//         setMydata(users);
//         // setLoading(false);
//       });
  

// },[])


  useEffect(() => {
   const user = firebase.auth().currentUser;
const userId =user.uid
//  if (user) {
//   console.log('User email: ', user.uid);

//  }
    const subscriber = fireStore().collection('Folders').doc(userId).collection('Folder')
      .onSnapshot(querySnapshot => {
        const users = [];

        querySnapshot.forEach(documentSnapshot => {
          const ab=  documentSnapshot.id

          

          console.log({ab})
          users.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,

            
            
          });
        });
        setMydata(users);
        // setLoading(false);
      });

    // Unsubscribe from events when no longer in use
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

  const addItem = item => {
    const user = firebase.auth().currentUser;
    const userId =user.uid
    if (!text) {
    } else {
      var date = new Date().getDate();
      var month = new Date().getMonth() + 1;
      var year = new Date().getFullYear();
     /// console.log('Date', date);
     // console.log('month', month);
     // console.log('year', year);
      item = text;
      myItems.push(item);
      setMyItems([...myItems]);
      // storeData();
      fireStore()
        .collection('Folders').doc(userId).collection('Folder')
        .add({
          folderName: item,
          folderDate: date + '/' + month + '/' + year,
        })
        .then(() => {
          onChangeText('');
          Snackbar.show({
            text: 'Folder added successfully ',

            duration: parseInt(2000),

            action: {
              text: 'Ok',
              textColor: Colors.primary,
              onPress: () => {
                /* Do something. */
              },
            },
          });
        //  console.log('Folder added!');
        });
    }
  };
  // trying to store array myItems using AsyncStorage

  //console.log({mydata})
  const showDateTime = item => {
    // var ab= item.folderDate.toDate()

    return <Text style={{fontSize: 12, top: 4}}>{item.folderDate}</Text>;
   // console.log(ab);
  };

  return (
    <View style={{flex:1}}>
      <StatusBar backgroundColor={Colors.gray} barStyle="light-content" />
      
      <View style={styles.gradientView}>
        <View style={styles.firstView}>
        <Image
              style={styles.foodImage}
              source={require('../assets/ic_logo.png')}
            />
        
          
            <View style={styles.middleView}>
              <Text style={styles.TextLabel}>Create New Folder *</Text>
              <TextInput
                onChangeText={onChangeText}
                value={text}
                autoFocus={false}
                keyboardType="default"
                placeholder="Enter Folder Name"
                style={styles.middleHeading}
              />
            </View>
         

          <Button title="Submit" onPress={() => addItem()} />
        </View>

        <TouchableOpacity
       // onPress={()=>printPDF()}
        style={styles.btnView}>
          <Text style={styles.btnText}>Select Folder</Text>
        </TouchableOpacity>

       
   
      </View>
    
   
      <View style={{height:heightPercentageToDP(55)}} >
      <FlatList
        data={mydata}
        //contentContainerStyle={{paddingBottom:300 }}
        renderItem={({item}) => (
          <TouchableOpacity
          activeOpacity={0.75}
            onPress={() =>
              navigation.navigate('StoreUrl', {
                title: item.folderName,
                folderKey: item.key,
              })
            }
            style={{
              width: '100%',
              flexDirection: 'row',
              margin: 5,
              padding: 5,
              backgroundColor: Colors.white,
              elevation: 1,
            }}>
            <View>
              <MaterialIcons
                name="folder-special"
                style={{color: Colors.black, fontSize: 50}}
              />
            </View>
            <View
              style={{
                flexDirection: 'column',
                marginLeft: 5,
                padding: 5,
                width: Layout.isSmallDevice
                  ? widthPercentageToDP(65)
                  : widthPercentageToDP(75),
              }}>
              <Text style={styles.folderName}>{item.folderName}</Text>
              {showDateTime(item)}
            </View>
            <View style={{justifyContent: 'center'}}>
              <FontAwesome
                name="angle-right"
                style={{color: Colors.black, fontSize: 30}}
              />
            </View>
          </TouchableOpacity>
        )}
      />
</View>

<TouchableOpacity
              onPress={() => logoutHandle()}
              style={styles.signIn}
             >
              
                <Text style={[styles.textSign, {color:Colors.white}]}>Logout</Text>
             
            </TouchableOpacity> 
   
      {/* {myItems.map(entry =>
           <View style={{height:100,width:'100%',margin:5,padding:10,backgroundColor:Colors.orange ,elevation:2}}>
             <MaterialIcons
                     name="folder-special"
                     style={{color: Colors.primary, fontSize: 16}}
                   />
             <Text key={entry}>
             {entry}
               </Text></View>
         )}
           */}
            {/* </View>
      </ScrollView> */}
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

  middleView: {
     width:widthPercentageToDP(58),
     paddingHorizontal:5,
     alignItems:'flex-start',
     justifyContent:'center'
    
  },
  TextLabel: {
    borderBottomColor: Colors.white,
    letterSpacing: 0.04,
    marginLeft:1,
    top:5,
    
    color: Colors.borderColor,
  },
  middleHeading: {
    color: Colors.black,
  },
  middleText: {
    letterSpacing: 0.04,
    marginRight: 10,
    fontSize: Layout.isSmallDevice ? 14 : 16,
    color: Colors.black,
  },
  btnView: {
    height: Layout.isSmallDevice
      ? heightPercentageToDP(4)
      : heightPercentageToDP(4),
    width: widthPercentageToDP(65),
    marginVertical: heightPercentageToDP(1),
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  btnText: {
    color: Colors.black,
    justifyContent: 'center',
    // fontFamily: fonts['OpenSans-SemiBold'],
    alignSelf: 'center',
    marginHorizontal: 10,
    fontWeight: '700',
    letterSpacing: 0.04,
    fontSize: Layout.isSmallDevice ? 14 : 18,
  },
  folderName: {
    color: Colors.black,
    // fontFamily: fonts['OpenSans-SemiBold'],

    fontWeight: '600',
    letterSpacing: 0.04,
    fontSize: Layout.isSmallDevice ? 14 : 16,
  },
  signIn: {
    width: '70%',
    height: 40,
    justifyContent: 'center',
    marginTop:heightPercentageToDP(1),
    marginBottom:heightPercentageToDP(5),
    alignItems: 'center',
    alignSelf:'center',
    borderRadius: 10,
    backgroundColor:Colors.primary
  },
  textSign: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default MainScreen;
