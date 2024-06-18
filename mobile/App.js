import "react-native-gesture-handler";
import React, { useEffect, useMemo, useReducer } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { AUTH_ACTIONS, authInitialState, authReducer } from "./src/context/reducers/authReducer";
import { profileInitialState, profileReducer } from "./src/context/reducers/profileReducer";
import AuthContext from "./src/context/AuthContext";
import ProfileContext from "./src/context/ProfileContext";
import WelcomeStack from "./src/screens/guest/WelcomeStack";
import UserScreen from "./src/screens/user/UserScreen";
import { NativeWindStyleSheet } from "nativewind";
import { ColorSchemeProvider, useColorSchemeContext } from "./src/context/ColorSchemeContext";
import './localization/i18n';

NativeWindStyleSheet.setOutput({
	default: "native",
});

export default function App() {
	const [authState, authDispatch] = useReducer(authReducer, authInitialState);
	const [profileState, profileDispatch] = useReducer(profileReducer, profileInitialState);

	const MyTheme = {
		...DefaultTheme,
		colors: {
			...DefaultTheme.colors,
			primary: "#fff",
			background: "#3476EF",
			card: "#3476EF",
			text: "#fff",
			border: "#1c313a",
			notification: "rgb(254,92,92)",
		},
	};

	useEffect(() => {
		getToken();
	}, []);

	const getToken = async () => {
		let auth;
		try {
			auth = await AsyncStorage.getItem("auth");
		} catch (err) {
			console.log(err);
		}
		authDispatch({
			type: AUTH_ACTIONS.RESTORE_USER,
			auth: JSON.parse(auth),
		});
	};

	const authContextValue = useMemo(() => {
		return { state: authState, dispatch: authDispatch };
	}, [authState, authDispatch]);

	const profileContextValue = useMemo(() => {
		return { profileState, profileDispatch };
	}, [profileState, profileDispatch]);

	return (
		<AuthContext.Provider value={authContextValue}>
			<ProfileContext.Provider value={profileContextValue}>
				<ColorSchemeProvider>
					<NavigationContainer theme={MyTheme}>
						{authState.auth == null ? (
							<WelcomeStack />
						) : (
							<UserScreen />
						)}
					</NavigationContainer>
				</ColorSchemeProvider>
			</ProfileContext.Provider>
		</AuthContext.Provider>
	);
}
