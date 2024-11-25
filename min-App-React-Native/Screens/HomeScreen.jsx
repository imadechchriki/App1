import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  BackHandler,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Avatar} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Gender from 'react-native-vector-icons/Foundation';
import Mobile from 'react-native-vector-icons/Entypo';
import Email from 'react-native-vector-icons/MaterialCommunityIcons';
import Profession from 'react-native-vector-icons/AntDesign';
import {DrawerActions, useNavigation} from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';

function HomeScreen(props) {
  const navigation = useNavigation();
  const [userData, setUserData] = useState('');

  // Fonction pour obtenir les données utilisateur depuis le serveur
  async function getData() {
    const token = await AsyncStorage.getItem('token');
    axios
      .post('http://100.73.108.45:5001/userdata', {token: token})
      .then(res => {
        setUserData(res.data.data);
      })
      .catch(err => {
        console.error('Error fetching user data:', err);
      });
  }

  // Gestion du bouton "Back" pour quitter l'application
  const handleBackPress = () => {
    Alert.alert('Exit App', 'Are you sure you want to exit?', [
      {
        text: 'Cancel',
        onPress: () => null,
        style: 'cancel',
      },
      {
        text: 'Exit',
        onPress: () => BackHandler.exitApp(),
      },
    ]);
    return true;
  };

  // Utilisation de useFocusEffect pour mettre à jour les données
  useFocusEffect(
    React.useCallback(() => {
      getData();
      BackHandler.addEventListener('hardwareBackPress', handleBackPress);

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
      };
    }, [])
  );

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View>
        <View style={{position: 'relative'}}>
          <TouchableOpacity
            style={styles.backIcon}
            onPress={() => {
              navigation.dispatch(DrawerActions.openDrawer());
            }}>
            <Mobile name="menu" size={30} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.editIcon}
            onPress={() => {
              navigation.navigate('UpdateProfile', {data: userData});
            }}>
            <Icon name="user-edit" size={24} color={'white'} />
          </TouchableOpacity>
          <Image
            width={100}
            height={60}
            resizeMode="contain"
            style={{
              marginTop: -150,
            }}
            source={require('../assets/wave.png')}
          />
        </View>
        <View style={{alignItems: 'center'}}>
          <Avatar.Image
            size={180}
            style={styles.avatar}
            source={{
              uri: userData === '' || userData === null
                ? 'data:image/png;base64,...' // Placeholder en base64
                : userData.image,
            }}
          />
        </View>

        <View style={{marginTop: -50}}>
          <Text style={styles.nameText}>{userData.name}</Text>
        </View>

        <View style={{marginTop: 20, marginHorizontal: 25}}>
          {/* Email */}
          <View style={styles.infoMain}>
            <View style={styles.infoCont}>
              <View style={[styles.infoIconCont, {backgroundColor: '#ff9500'}]}>
                <Email name="email" size={24} style={{color: 'white'}} />
              </View>
              <View style={styles.infoText}>
                <Text style={styles.infoSmall_Text}>Email</Text>
                <Text style={styles.infoLarge_Text} numberOfLines={1}>
                  {userData.email}
                </Text>
              </View>
            </View>
          </View>

          {/* Genre */}
          <View style={styles.infoMain}>
            <View style={styles.infoCont}>
              <View style={[styles.infoIconCont, {backgroundColor: '#0d7313'}]}>
                <Gender name="torsos-male-female" size={28} style={{color: 'white'}} />
              </View>
              <View style={styles.infoText}>
                <Text style={styles.infoSmall_Text}>Gender</Text>
                <Text style={styles.infoLarge_Text}>
                  {userData.gender || 'Not specified'}
                </Text>
              </View>
            </View>
          </View>

          {/* Profession */}
          <View style={styles.infoMain}>
            <View style={styles.infoCont}>
              <View style={[styles.infoIconCont, {backgroundColor: '#774BBC'}]}>
                <Profession name="profile" size={24} style={{color: 'white'}} />
              </View>
              <View style={styles.infoText}>
                <Text style={styles.infoSmall_Text}>Profession</Text>
                <Text style={styles.infoLarge_Text}>
                  {userData.profession || 'Not specified'}
                </Text>
              </View>
            </View>
          </View>

          {/* Mobile */}
          <View style={styles.infoMain}>
            <View style={styles.infoCont}>
              <View style={[styles.infoIconCont, {backgroundColor: '#f2276e'}]}>
                <Mobile name="mobile" size={24} style={{color: 'white'}} />
              </View>
              <View style={styles.infoText}>
                <Text style={styles.infoSmall_Text}>Mobile</Text>
                <Text style={styles.infoLarge_Text}>{userData.mobile}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  editIcon: {
    zIndex: 1,
    color: 'white',
    position: 'absolute',
    right: 2,
    margin: 15,
  },
  backIcon: {
    zIndex: 1,
    color: 'white',
    position: 'absolute',
    left: 2,
    margin: 15,
  },
  avatar: {
    borderRadius: 100,
    marginTop: -250,
    backgroundColor: 'white',
    height: 200,
    width: 200,
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    elevation: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameText: {
    color: 'black',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  infoMain: {
    marginTop: 10,
  },
  infoCont: {
    width: '100%',
    flexDirection: 'row',
  },
  infoIconCont: {
    justifyContent: 'center',
    height: 40,
    width: 40,
    borderRadius: 20,
    alignItems: 'center',
    backgroundColor: 'black',
  },
  infoText: {
    width: '80%',
    flexDirection: 'column',
    marginLeft: 25,
    borderBottomWidth: 1,
    paddingBottom: 10,
    borderColor: '#e6e6e6',
  },
  infoSmall_Text: {
    fontSize: 13,
    color: '#b3b3b3',
    fontWeight: '500',
  },
  infoLarge_Text: {
    color: 'black',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default HomeScreen;
