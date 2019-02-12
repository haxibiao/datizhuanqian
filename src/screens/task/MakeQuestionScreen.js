/*
* @flow
* created by wyk made in 2019-02-12 10:29:25
*/
import React, { Component } from 'react';
import { StyleSheet, Platform,View, ScrollView, Image, Text, TouchableOpacity, Keyboard } from 'react-native';
import { DivisionLine, Header, Screen, LoadingError,CustomTextInput, DropdownMenu,ImagePickerView } from '../../components';
import { Colors, Config, Divice } from '../../constants';
import { connect } from 'react-redux';
import actions from '../../store/actions';
import { TasksQuery, ReceiveTaskMutation, CompleteTaskMutation } from '../../graphql/task.graphql';
import { Query, Mutation } from 'react-apollo';

import TaskType from './TaskType';
import KeyboardSpacer from 'react-native-keyboard-spacer';

let HOME_INDICATOR = 0;
if(Divice.isIos&&Divice.height>=Divice.width*2){
	HOME_INDICATOR = 30;
}

const questions = [
	[
	'世界知识',
	'娱乐相关',
	'体育基地',
	'驾考知识',
	'健康养生',
	'文学知识',
	'金融知识'
	]
];

const ANSWERS = ['A','B','C','D'];

class ChooseItem extends Component {

	render() {
		const { option,isAnswer,reduceAnswer } = this.props;
		return (
			<TouchableOpacity style={styles.option} onPress={() => reduceAnswer(ANSWERS[option.index])}>
				<View style={[styles.chooseLabel,{borderColor: isAnswer ? Colors.theme: Colors.tintGray}]}>
					<Text style={[styles.chooseLabelText,{color:isAnswer ? Colors.theme: Colors.tintGray}]}>{ANSWERS[option.index]}</Text>
				</View>
				<View style={styles.optionContent}>
					<Text style={styles.optionContentText}>{option.value}</Text>
				</View>
			</TouchableOpacity>
		);
	}
}

class MakeQuestionScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			classify:null,
			question:null,
			pictures:[],
			option:null,
			answers:new Set(),
			options:new Set()
		};
	}

	addOption = ()=> {
		if(this.state.option){
			let options = this.state.options.add(this.state.option)
			this.setState({options});
		}
		this.setState({option:null});
		Keyboard.dismiss();
	}

	removeOption = (text)=> {
		let options = this.state.options.delete(text);
		this.setState({options});
	}

	reduceAnswer = (answer)=> {
		let {answers} = this.state;
		if(answers.has(answer)){
			answers.delete(answer);
		}else {
			answers.add(answer);
		}
		answers = new Set([...answers].sort());
		this.setState({answers})
	}

	render() {
		let { navigation, user, login } = this.props;
		let { classify, question, pictures,options,option,answers } = this.state;
		let disableAddButton = options.size>=4 || !option;
		return (
			<Screen header>
				<Header
					customStyle={{
						backgroundColor: Colors.theme,
						borderBottomWidth: 0,
						borderBottomColor: 'transparent'
					}}
				/>
				<View style={styles.container}>
					<DropdownMenu
					  dropStyle={{paddingHorizontal: 15}}
			          dropItemStyle={{alignItems: 'flex-end'}}
			          lable={<Text style={styles.lableText}>题目分类</Text>}
			          bgColor={'white'}
			          tintColor={'#666666'}
			          activityTintColor={Colors.theme}
			          // arrowImg={}      
			          // checkImage={}   
			          // optionTextStyle={{color: '#333333'}}
			          // titleStyle={{color: '#333333'}} 
			          // maxHeight={300} 
			          handler={(selection, row) => this.setState({classify: questions[selection][row]})}
			          data={questions}
			        >
			          <ScrollView style={styles.container} contentContainerStyle={{paddingBottom: HOME_INDICATOR+50}}>
			          	<DivisionLine />
			          	<View style={{marginBottom: 15}}>
			          	  <View>
			          	  	<CustomTextInput 
			          	  		style={styles.questionInput}
			          	  		onChangeText={text => this.setState({ question: text })}
			          	  		multiline
			          	  		textAlignVertical="top"
			          	  		placeholder="请添加问题描述"
			          	  	/>
			          	  </View>
	      	              <View style={{marginLeft: -10}}>
	      	  	          	<ImagePickerView
	      	  	          		onResponse={images => {
	      	  	          			this.setState({ pictures: images });
	      	  	          		}}
	      	  	          	/>
	      	              </View>
			          	</View>
			          	<DivisionLine />
			          	<View style={styles.answers}>
			          		<Text style={styles.answerText}>正确答案: </Text>
			          		<Text style={[styles.answerText,{color:Colors.blue}]}>{[...answers].join(',')}</Text>
			          	</View>
			          	<View style={styles.options}>
			          		{[...options].map((value, index) => {
			          			return <ChooseItem key={index} option={{value,index}} isAnswer={answers.has(ANSWERS[index])} reduceAnswer={this.reduceAnswer}></ChooseItem>
			          		})}
			          	</View>
			          </ScrollView>
			          <View style={styles.bottom}>
				          <View style={styles.inputContainer}>
				          	<CustomTextInput 
				          		style={styles.chooseInput}
				          		maxLength={80}
				          		value={option}
				          	  	onChangeText={text => this.setState({ option: text })}
				          		placeholder="请添加答案选项"
				          	/>
				          	<TouchableOpacity disabled={disableAddButton} style={[styles.button,!disableAddButton&&{backgroundColor: Colors.blue}]} onPress={this.addOption}>
				          		<Text style={styles.addText}>添 加</Text>
				          	</TouchableOpacity>
				          </View>
			          </View>
			          {Platform.OS == 'ios' && <KeyboardSpacer />}
			        </DropdownMenu>
				</View>
			</Screen>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff'
	},
	lableText: {
		fontSize: 14,
		color:'#A0A0A0'
	},
	questionInput: {
		fontSize: 15,
		lineHeight: 20,
		color: '#212121',
		height: 120,
		paddingHorizontal: 15,
		backgroundColor: '#fff'
	},
	answers:{
		padding: 15,
		flexDirection: 'row',
		alignItems: 'center'
	},
	answerText:{
		fontSize: 15,
		color:'#A0A0A0',
	},
	options: {
		paddingTop: 15,
		paddingHorizontal: 10
	},
	option:{
		flexDirection: 'row',
		padding: 12,
	},
	chooseLabel:{
		marginRight: 15,
		width: 36,
		height: 36,
		borderRadius: 18,
		borderWidth: 2,
		borderColor: Colors.blue,
		justifyContent: 'center',
		alignItems: 'center'
	},
	chooseLabelText:{
		fontSize: 17,
		fontWeight: '500',
		color: Colors.blue
	},
	optionContent:{
		flex:1,
		minHeight: 36,
		justifyContent: 'center'
	},
	optionContentText: {
		fontSize: 16,
		lineHeight: 18,
		color: Colors.tintFont
	},
	bottom:{
		paddingBottom: HOME_INDICATOR,
		backgroundColor: '#f7f7f7',
	},
	inputContainer:{ 
		height: 50,
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 15 
	},
	chooseInput:{
		flex: 1,
		alignSelf: 'stretch',
		justifyContent: 'center',
		marginRight: 15,
	},
	button:{
		width: 50,
		height: 30,
		borderRadius: 5,
		backgroundColor: '#A0A0A0',
		justifyContent: 'center',
		alignItems: 'center'
	},
	addText:{
		fontSize: 15,
		color:'#fff',
	}
});

export default connect(store => {
	return {
		user: store.users.user,
		login: store.users.login
	};
})(MakeQuestionScreen);
