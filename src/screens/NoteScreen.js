import React, { Component } from 'react';
import {
	View,
	Text,
	Button,
	ListView,
	ScrollView,
	TouchableOpacity,
	TextInput,
	StyleSheet,
	AsyncStorage
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import {
	StackNavigator
} from 'react-navigation';

const NavHeader = props => (
	<View style={styles.header}>
		<TouchableOpacity style={styles.headerBack} onPress={() => { props.navigation.goBack(); }}>
			<Icon style={styles.headerBackIcon} name="arrow-back" size={25} color="#FFFFFF" />
		</TouchableOpacity>
		<Text style={styles.headerText}>
			{props.navigation.state.params.title}
		</Text>
		<TouchableOpacity style={styles.headerTick} onPress={() => {
			const routes = props.navigation.state.routes;
			routes[routes.length - 1].params.title;
		}}>
			<Icon style={styles.headerTickIcon} name="edit" size={25} color="#FFFFFF" />
		</TouchableOpacity>
	</View>
);

export default class NoteScreen extends Component {
	static navigationOptions = ({ navigation }) => {
		return {
			header: <NavHeader navigation={navigation} />,
			title: 'PlanIt'
		}
	}
	constructor(props) {
		super(props);

		this.getTimeScale = this.getTimeScale.bind(this);
	}
	getTimeScale() {
		const { params } = this.props.navigation.state;

		let startDate = params.dateStart.split('-');
		let startDateObj = new Date(startDate[2], startDate[1] - 1, startDate[0]);

		let endDate = params.dateEnd.split('-');
		let endDateObj = new Date(endDate[2], endDate[1] - 1, endDate[0]);


		let startDateMo = moment(startDateObj);
		let endDateMo = moment(endDateObj);

		let diff = endDateMo.diff(startDateObj, 'days') + 1;

		if (diff <= 0) {
			return 'Submitted late (' + Math.abs((diff-1)) + ' days)';
		} else {
			return 'Submitted on time';
		}
	}
	render() {
		const { params } = this.props.navigation.state;
		var todos = [];
		let notes = AsyncStorage.getItem('@PlanIt:todoList').then((res) => {
			todos = JSON.parse(res);
		}).catch((err) => {
			console.error(err);
		});

		return (
			<View>
				<Text>Start date: {params.dateStart}</Text>
				<Text>Target date: {params.dateEnd}</Text>
				<Text>description: {params.description}</Text>
				<Text>Complete: {(params.completed) ? 'Yes' : 'No'}</Text>
				<Text>{(params.completedDate) ? 'Completed Date: '+params.completedDate: ''}</Text>
				<Text>{(params.completedDate) ? 'Status: ' + this.getTimeScale() : ''}</Text>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	header: {
		flexDirection: 'row',
		backgroundColor: '#3498DB',
		alignItems: 'center',
		justifyContent: 'center',
		borderBottomWidth: 2,
		borderBottomColor: '#2980B9',
	},
	headerBack: {
		flex: 1,
		paddingTop: 13
	},
	headerBackIcon: {
		textAlign: 'center'
	},
	headerText: {
		flex:4,
		fontFamily: 'helvetica',
		fontWeight: 'bold',
		color: '#FFFFFF',
		fontSize: 22,
		padding: 22,
		paddingTop: 32,
		textAlign: 'center'
	},
	headerTick: {
		flex: 1,
		paddingTop: 13,
	},
	headerTickIcon: {
		textAlign: 'center',
	},
});