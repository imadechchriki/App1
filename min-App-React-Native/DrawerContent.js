import React from 'react';
import {View, StyleSheet} from 'react-native';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Liste des éléments du drawer
const DrawerList = [
  {icon: 'home-outline', label: 'Home', navigateTo: 'Home'},
  {icon: require('./assets/friends.png'), label: 'Mes Amis', navigateTo: 'Profile'},
  {icon: 'game-controller', label: 'game', navigateTo: 'Home_ludo'},
];

// Composant pour chaque élément du drawer
const DrawerLayout = ({icon, label, navigateTo}) => {
  const navigation = useNavigation();
  return (
    <DrawerItem
      icon={({color, size}) => <Icon name={icon} color={color} size={size} />}
      label={label}
      onPress={() => navigation.navigate(navigateTo)}
    />
  );
};

// Composant qui génère la liste d'éléments du drawer
const DrawerItems = () => {
  return DrawerList.map((item, index) => (
    <DrawerLayout
      key={index}
      icon={item.icon}
      label={item.label}
      navigateTo={item.navigateTo}
    />
  ));
};

function DrawerContent(props) {
  const navigation = useNavigation();

  // Fonction pour déconnexion et suppression des données
  const signOut = async () => {
    await AsyncStorage.multiRemove(['isLoggedIn', 'token']);
    navigation.navigate('LoginUser');
  };

  return (
    <View style={styles.container}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContent}>
          <TouchableOpacity activeOpacity={0.8}>
            {/* Ici tu peux ajouter l'avatar ou d'autres infos de l'utilisateur */}
          </TouchableOpacity>
          <View style={styles.drawerSection}>
            <DrawerItems />
          </View>
        </View>
      </DrawerContentScrollView>
      <View style={styles.bottomDrawerSection}>
        <DrawerItem
          icon={({color, size}) => (
            <Icon name="exit-to-app" color={color} size={size} />
          )}
          label="Sign Out"
          onPress={signOut}
        />
      </View>
    </View>
  );
}

export default DrawerContent;

// Styles optimisés
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  drawerContent: {
    flex: 1,
  },
  drawerSection: {
    marginTop: 15,
    borderBottomColor: '#dedede',
    borderBottomWidth: 1,
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: '#dedede',
    borderTopWidth: 1,
  },
});
