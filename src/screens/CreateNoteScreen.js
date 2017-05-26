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
import DatePicker from 'react-native-datepicker';
import moment from 'moment';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
	StackNavigator
} from 'react-navigation';

// TO DO - REMOVE STATE FOR EACH NOTE ITEM AND REPLACE FOR REFS ON THE INPUTS

const NavHeader = props => (
	<View style={styles.header}>
		{console.log(props) && null}
		<TouchableOpacity style={styles.headerBack} onPress={() => { props.navigation.goBack(); }}>
			<Icon style={styles.headerBackIcon} name="arrow-back" size={25} color="#FFFFFF" />
		</TouchableOpacity>
		<Text style={styles.headerText}>
			Create to-do
		</Text>
		<TouchableOpacity style={styles.headerTick} onPress={() => {
			const routes = props.navigation.state.routes;
			routes[routes.length - 1].params.onCreateNote();
		}}>
			<Icon style={styles.headerTickIcon} name="done" size={25} color="#FFFFFF" />
		</TouchableOpacity>
	</View>
);

export default class CreateNoteScreen extends Component {
	static navigationOptions = {
		header: NavHeader,
		title: 'Create to-do'
	}
	state = {
		date: '',
		title: '',
		description: '',
		todoList: []
	}
	constructor(props) {
		super(props);

		this.updateDate = this.updateDate.bind(this);
		this.onCreateNote = this.onCreateNote.bind(this);
	}
	componentDidMount() {
		this.props.navigation.setParams({
			onCreateNote: this.onCreateNote
		});
	}
	onCreateNote() {
		let notes = AsyncStorage.getItem('@PlanIt:todoList').then((res) => {
			let todos = JSON.parse(res);
			this.setState({
				todoList: todos || [],
			});

			let todoItems = [].concat(this.state.todoList);
			let currentTodo = {	
				title: this.noteTitle,
				dateEnd: this.state.date,
				dateStart: moment(Date.now()).format('DD-MM-YYYY'),
				description: this.noteDescription,
				completed: false,
				completedDate: ''
			};

			todoItems.push(currentTodo);

			AsyncStorage.setItem('@PlanIt:todoList', JSON.stringify(todoItems)).then(() => {
				this.setState({ todoList: todoItems });
			});

			this.props.navigation.state.params.updateNotes();
		}).catch((err) => {
			console.error(err);
		});

		this.props.navigation.goBack();

	}
	updateDate(date) {
		this.setState({
			date
		});
	}
	render() {
		return (
			<View>
				<View>
					<View style={styles.fieldHolder}>
						<Icon style={styles.fieldIcon} name="create" size={25} color="#D0D0D0" />
						<TextInput
							style={{ height: 55, fontSize: 14}}
							placeholder="Task name"
							underlineColorAndroid='transparent'
							onChangeText={(title) => { this.noteTitle = title; }}
						/>
					</View>
					<View style={styles.fieldHolder}>
						<Icon style={styles.fieldIcon} name="event-note" size={25} color="#D0D0D0" />
						<DatePicker
							date={this.state.date}
							style={{ height: 55, paddingTop: 8 }}
							mode="date"
							placeholder="Select date"
							format="DD-MM-YYYY"
							confirmBtnText="Confirm"
							cancelBtnText="Cancel"
							onDateChange={ (date) => { this.setState({ date }); } }
							customStyles={{dateInput: { borderWidth: 0, alignItems: 'flex-start', height: 55}}}
							showIcon={false}
						/>
					</View>
					<View style={styles.fieldHolder}>
						<Icon style={styles.fieldIcon} name="insert-comment" size={25} color="#D0D0D0" />
						<TextInput
							multiline={true}
							style={{ height: 200, fontSize: 14, paddingTop: 15}}
							placeholder="Description"
							placeholderTextColor='#D0D0D0'
							underlineColorAndroid='transparent'
							onChangeText={(description) => { this.noteDescription = description; }}
						/>
					</View>
				</View>
			</View>
		);
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
	fieldHolder: {
		borderBottomWidth: 1, 
		borderBottomColor: '#E0E0E0', 
		paddingLeft: 50,
		paddingRight: 15,
		backgroundColor: '#FFF', 
		position: 'relative'
	},
	fieldIcon: {
		position: 'absolute', 
		left: 15, 
		top: 15
	}
});