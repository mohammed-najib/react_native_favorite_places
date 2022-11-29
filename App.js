import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as SplashScreen from "expo-splash-screen";

import AllPlaces from "./screens/all_places.screen";
import AddPlace from "./screens/add_place.screen";
import IconButton from "./components/ui/icon_button.component";
import { Colors } from "./constants/color.constant";
import Map from "./screens/map.screen";
import { useCallback, useEffect, useState } from "react";
import { init } from "./utils/database.util";
import { StyleSheet, View } from "react-native";
import PlaceDetails from "./screens/place_details.screen";

const Stack = createNativeStackNavigator();

export default function App() {
  const [isDbInitialized, setIsDbInitialized] = useState(false);
  useEffect(() => {
    init()
      .then(() => {
        setIsDbInitialized(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (!isDbInitialized) {
      await SplashScreen.hideAsync();
    }
  }, [isDbInitialized]);

  if (!isDbInitialized) {
    return null;
  }

  return (
    <View style={styles.screen} onLayout={onLayoutRootView}>
      <StatusBar style="dark" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="AllPlaces"
          screenOptions={{
            headerStyle: {
              backgroundColor: Colors.primary500,
            },
            headerTintColor: Colors.gray700,
            contentStyle: {
              backgroundColor: Colors.gray700,
            },
          }}
        >
          <Stack.Screen
            name="AllPlaces"
            component={AllPlaces}
            options={({ navigation }) => ({
              title: "Your Favorite Places",
              headerRight: ({ tintColor }) => (
                <IconButton
                  icon="add"
                  size={24}
                  color={tintColor}
                  onPress={() => navigation.navigate("AddPlace")}
                />
              ),
            })}
          />
          <Stack.Screen
            name="AddPlace"
            component={AddPlace}
            options={{
              title: "Add a new Place",
            }}
          />
          <Stack.Screen name="Map" component={Map} />
          <Stack.Screen name="PlaceDetails" component={PlaceDetails} options={{
            title: 'Loading Place...',
          }} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
