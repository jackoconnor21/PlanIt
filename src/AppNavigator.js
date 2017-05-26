import React from 'react';
import { StackNavigator } from 'react-navigation';

import HomeScreen from './screens/HomeScreen';
import NoteScreen from './screens/NoteScreen';
import CreateNoteScreen from './screens/CreateNoteScreen';

export default AppNavigator = StackNavigator({
	Home: {
		screen: HomeScreen
	},
	CreateNoteScreen: {
		screen: CreateNoteScreen
	},
	NoteScreen: {
		screen: NoteScreen
	}
});