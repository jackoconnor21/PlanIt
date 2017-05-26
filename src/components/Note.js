import React, { Component } from 'react';
import {
	View,
	Text,
	Button,
	ListView,
	ScrollView,
	TouchableWithoutFeedback,
	TextInput,
	StyleSheet
} from 'react-native';
import {
	StackNavigator
} from 'react-navigation';
import moment from 'moment';
import Swipeout from 'react-native-swipeout';
import Icon from 'react-native-vector-icons/MaterialIcons';
import NoteScreen from '../screens/NoteScreen';

export default class Note extends Component {
	constructor(props) {
		super(props);

		this.getTimeScale = this.getTimeScale.bind(this);
	}
	getTimeScale() {
		let eventdate = this.props.val.dateEnd.split('-');
		let dateObj = new Date(eventdate[2], eventdate[1] - 1, eventdate[0]);

		let endDate = moment(dateObj);
		let today = moment(Date.now());

		let diff = endDate.diff(today, 'days') + 1;

		if (diff == 1) {
			return 'orange';
		} else if (diff <= 0) {
			return 'red';
		} else {
			return '#2ECC71';
		}
	}
	render() {
		let deleteBtn = [
			{
				text: <Icon name="delete-forever" size={25} color="#FFFFFF" />,
				backgroundColor: '#E74C3C',
				color: '#FFFFFF',
				onPress: this.props.deleteTodo,
			}
		];
		let completeBtn = [
			{
				text: <Icon name="done" size={25} color="#FFFFFF" />,
				backgroundColor: '#2ECC71',
				color: '#FFFFFF',
				onPress: this.props.completeTodo
			}
		];
		return (
			<Swipeout style={styles.swipeRow} right={deleteBtn} left={(this.props.val.completed) ? undefined : completeBtn} autoClose={true}>
				<TouchableWithoutFeedback onPress={() => this.props.navigation.navigate('NoteScreen', this.props.val )}>
					<View key={this.props.keyval} style={styles.note}>

						<View style={styles.noteHolder}>
							<Text style={styles.dateText}>
								{this.props.val.dateEnd}
							</Text>

							<Text style={styles.noteTitle}>
								{this.props.val.title}
							</Text>
						</View>
						<View style={styles.noteComplete}>
							<Icon name={(this.props.val.completed) ? 'done' : 'access-alarm'} size={30} color={(this.props.val.completed) ? '#2ECC71' : this.getTimeScale()} />
						</View>

					</View>
				</TouchableWithoutFeedback>
			</Swipeout>
		)
	}
}

const ModalStack = StackNavigator({
	NoteScreen: {
		screen: NoteScreen
	}
});

const styles = StyleSheet.create({
	swipeRow: {
		backgroundColor: '#FFFFFF'
	},
	note: {
		position: 'relative',
		padding: 20,
		paddingRight: 100,
		borderBottomWidth: 2,
		borderBottomColor: '#EDEDED',
	},
	noteTitle: {
		paddingLeft: 20,
		color: '#333'
	},
	dateText: {
		paddingLeft: 20,
		color: '#AAAAAA'
	},
	noteHolder: {
		borderLeftWidth: 10,
		borderLeftColor: '#2980B9',
	},
	noteComplete: {
		position: 'absolute',
		justifyContent: 'center',
		alignItems: 'center',
		padding: 10,
		top: 10,
		bottom: 10,
		right: 10,
	},
	noteCompleteText: {
		color: '#FFFFFF',
	}
});