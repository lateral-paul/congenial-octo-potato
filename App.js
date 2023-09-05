import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useChatClient } from './src/hooks/useChatClient';
import { OverlayProvider } from 'stream-chat-react-native';

import { chatApiKey, chatUserId, chatUserToken } from './src/config';
import { NoEnvironment } from './src/components/NoEnvironment';
import StackScreen from './src/screens/StackScreen';

const Stack = createNativeStackNavigator();

const NavigationStack = () => {
  const { clientIsReady } = useChatClient();

  if (!clientIsReady) {
    return <Text>Loading chat ...</Text>;
  }

  return (
    <OverlayProvider>
        <Stack.Navigator>
          <Stack.Screen
            name="Stack Screen"
            component={StackScreen}
          />
        </Stack.Navigator>
    </OverlayProvider>
  );
};

const isEnvNotSet = !chatApiKey || !chatUserId || !chatUserToken;

export default () => {
  return !isEnvNotSet ? (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1 }}>
          <NavigationContainer>
            <NavigationStack />
          </NavigationContainer>
        </SafeAreaView>
      </GestureHandlerRootView>
  ) : (
    <NoEnvironment />
  );
};
