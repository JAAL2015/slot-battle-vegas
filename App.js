import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { Button, View } from "react-native";
import Slider from "./src/components/Slider";
import { colors } from "./src/components/custom-styles";


const players = [
  { player_number: 1, player_name: 'Alice' },
  { player_number: 2, player_name: 'Bob' },
  { player_number: 3, player_name: 'Dave' },
];

function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      
      <Slider players={players}></Slider>
    
    </View>
  );
}

function NotificationsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Button onPress={navigation.openDrawer} title="Open navigation drawer" />

    </View>
  );
}

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
       <Drawer.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.primary, // Set your desired color here
            elevation: 0, // Remove shadow on Android
            shadowOpacity: 0, // Remove shadow on iOS
          },
          headerTintColor: '#fff', // Set the color of the header text and icons
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          
        }}
      >
        <Drawer.Screen name="The Strip" component={HomeScreen} />
        <Drawer.Screen name="Notifications" component={NotificationsScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
