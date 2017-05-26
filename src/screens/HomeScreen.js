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
	AsyncStorage,
	Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import {
	StackNavigator
} from 'react-navigation';

import Note from '../components/Note';

/**
* 	We must pass in any params from the class we wish to use in the nav header, through navigation setParams in componentDidMount()
**/
const NavHeader = props => (
	<View style={styles.header}>
		<View style={styles.headerBack}></View>
		<Text style={styles.headerText}>
			Todo List
		</Text>
		<TouchableOpacity style={styles.headerTick} onPress={() => { 
			const routes = props.navigation.state.routes;

			props.navigation.navigate('CreateNoteScreen', { updateNotes: routes[routes.length - 1].params.updateNotes }); 
		}}>
		<Icon style={styles.headerTickIcon} name="add" size={25} color="#FFFFFF" />
		</TouchableOpacity>
	</View>
);

export default class HomeScreen extends Component {
	static navigationOptions = {
		header: NavHeader,
		title: 'PlanIt'
	}
	state = {
		todoList: [],
	}
	constructor(props) {
		super(props);

		this.updateNotes = this.updateNotes.bind(this);
		this.getCompletedTasks = this.getCompletedTasks.bind(this);
	}
	updateNotes() {
		let notes = AsyncStorage.getItem('@PlanIt:todoList').then((res) => {
			todos = JSON.parse(res);

			let something = todos.filter((item) => {
				return item.completed == false
			});

			this.setState({
				todoList: todos || [],
			});

		}).catch((err) => {
			console.error(err);
		});
	}
	componentDidMount() {
		this.updateNotes();

		this.props.navigation.setParams({
			updateNotes: this.updateNotes
		});
	}
	render() {
		let notes = [];

		if (this.state.todoList) {
			notes = this.state.todoList.map((val, key) => {
				return 	<Note key={key} keyval={key} val={val} completed={val['completed']} 
							completeTodo={ () => this.completeTodo(key) } deleteTodo={ () => this.deleteTodo(key) } 
							navigation={this.props.navigation} 
						/>
			});
		}

		let getStarted = (
			<TouchableOpacity style={{padding: 30, backgroundColor: '#FFF'}} onPress={() => {this.props.navigation.navigate('CreateNoteScreen', { updateNotes: this.updateNotes })}}>
				<Text style={{textAlign: 'center', color: '#333'}}>+ Add a to-do to get started</Text>
			</TouchableOpacity>
		);

		
		
		return (
			<View style={styles.container}>
				<ScrollView style={styles.scrollContainer}>
					{(notes.length == 0) ? getStarted : notes}
				</ScrollView>
			</View>
		)
	}
	getCompletedTasks() {
		let count = 0;
		this.state.todoList.map((key,val) => {
			if (key['completed']) count++;
		});

		return count;
	}
	completeTodo(key) {
		Alert.alert(
            'Complete To-do',
            'Are you sure you want to complete this todo?',
            [
                {
                    text: 'Yes', onPress: () => 
                    {
						let todos = [].concat(this.state.todoList);

						todos[key]['completed'] = true;
						todos[key]['completedDate'] = moment(Date.now()).format('DD-MM-YYYY');

						AsyncStorage.setItem('@PlanIt:todoList', JSON.stringify(todos)).then(() => {
							this.setState({ todoList: todos });							
						});
                    }
                },
                { 
                	text: 'No', onPress : () => { /* do nothing */ }
                }
            ]
        );
	}
	deleteTodo(key) {
		Alert.alert(
            'Delete To-do',
            'Are you sure you want to delete this todo? This can not be undone',
            [
                {
                    text: 'Yes', onPress: () => 
                    {
						let todos = [].concat(this.state.todoList);

						todos.splice(key, 1);

						AsyncStorage.setItem('@PlanIt:todoList', JSON.stringify(todos)).then(() => {
							this.setState({ todoList: todos });
						});
					},
				},
				{
					text: 'No', onPress: () => { /* do nothing */ }
				}
			]
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
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
	scrollContainer: {
		flex: 1,
	},
})