
import React from 'react';
import { ThemeProvider } from 'styled-components';
// import { Dashboard } from './src/components/Dashboard';
//import {CategorySelect} from './src/screens/CategorySelect'
import AppLoading from 'expo-app-loading'
import 'intl'
import 'intl/locale-data/jsonp/pt-BR';
import {StatusBar} from 'react-native'

import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_700Bold } from '@expo-google-fonts/poppins'

import theme from './src/global/theme'

import { Routes } from './src/routes/';

import { AuthProvider, useAuth } from './src/hooks/auth'

export default function App() {
	const { userStorageLoading } = useAuth();

	const [fontsLoaded] = useFonts({
		Poppins_400Regular,
		Poppins_500Medium,
		Poppins_700Bold
	});

	if(!fontsLoaded || userStorageLoading){
		return <AppLoading />
	}

  return (
	<ThemeProvider theme={theme}>
			<StatusBar barStyle={'light-content'} />
				<AuthProvider>
					<Routes />
				</AuthProvider>

	</ThemeProvider>
  );
}
