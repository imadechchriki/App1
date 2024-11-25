import 'react-native-gesture-handler';
import {
  NavigationContainer,
  useNavigation,
  DrawerActions,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import SplashScreen from 'react-native-splash-screen';

import HomeScreen from './Screens/HomeScreen';
import ProfileScreen from './Screens/ProfileScreen';
import Home_ludo from './Screens/Home_ludo/Home_ludo';
import LoginPage from './Screens/Login&Register/Login';
import RegisterPage from './Screens/Login&Register/Register';
import UpdateProfile from './Screens/UpdateProfile/UpdateProfile';
import AdminScreen from './Screens/AdminScreen';
import DrawerContent from './DrawerContent';
import Icon from 'react-native-vector-icons/Entypo';

// Configuration de Toast personnalisé
const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: 'green', borderRightColor: 'green', borderWidth: 7, width: '90%', height: 70 }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{ fontSize: 17, fontWeight: '700' }}
      text2Style={{ fontSize: 14 }}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: 'red', borderRightColor: 'red', borderWidth: 7, width: '90%', height: 70 }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{ fontSize: 17, fontWeight: '700' }}
      text2Style={{ fontSize: 14 }}
    />
  ),
};

// Configuration de la pile commune
const defaultStackOptions = {
  statusBarColor: '#0163d2',
  headerStyle: { backgroundColor: '#0163d2' },
  headerTintColor: '#fff',
  headerTitleAlign: 'center',
};

// Création du Stack Navigator pour les utilisateurs réguliers
const StackNav = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator screenOptions={{ ...defaultStackOptions, headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="UpdateProfile" component={UpdateProfile} />
      <Stack.Screen name="LoginUser" component={LoginNav} />
      <Stack.Screen name="Home_ludo" component={Home_ludo} />
    </Stack.Navigator>
  );
};

// Création du Drawer Navigator
const DrawerNav = () => {
  const Drawer = createDrawerNavigator();
  return (
    <Drawer.Navigator drawerContent={(props) => <DrawerContent {...props} />} screenOptions={{ headerShown: false }}>
      <Drawer.Screen name="Home" component={StackNav} />
    </Drawer.Navigator>
  );
};

// Création du Stack Navigator pour l'admin
const AdminStack = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator screenOptions={defaultStackOptions}>
      <Stack.Screen
        name="AdminScreen"
        component={AdminScreen}
        options={{ headerShown: true, headerBackVisible: false }}
      />
      <Stack.Screen name="Login" component={LoginNav} />
    </Stack.Navigator>
  );
};

// Création du Stack Navigator pour la partie Login/Register
const LoginNav = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginPage} />
      <Stack.Screen name="Register" component={RegisterPage} />
      <Stack.Screen name="Home" component={DrawerNav} />
      <Stack.Screen name="AdminScreen" component={AdminStack} />
      <Stack.Screen name="Home_ludo" component={Home_ludo} />

    </Stack.Navigator>
  );
};

// Composant principal App
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null);

  // Fonction asynchrone pour récupérer les données de connexion
  const getData = async () => {
    const loggedIn = await AsyncStorage.getItem('isLoggedIn');
    const storedUserType = await AsyncStorage.getItem('userType');
    setIsLoggedIn(loggedIn === 'true'); // Vérifie si l'utilisateur est connecté
    setUserType(storedUserType);
  };

  useEffect(() => {
    getData(); // Appelle les données de connexion
    SplashScreen.hide(); // Cache l'écran de démarrage après 900ms
  }, []);

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        userType === 'Admin' ? (
          <AdminStack />
        ) : (
          <DrawerNav />
        )
      ) : (
        <LoginNav />
      )}
      <Toast config={toastConfig} />
    </NavigationContainer>
  );
}

export default App;
