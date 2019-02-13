/*
* @flow
* created by wyk made in 2019-02-12 10:29:25
*/
import React, { Component } from 'react';
import { StyleSheet, Platform,View, ScrollView, Image, Text, TouchableOpacity, Keyboard,Animated } from 'react-native';
import { DivisionLine, Header, Screen, LoadingError,CustomTextInput, DropdownMenu,ImagePickerView,Iconfont,AnimationButton } from '../../components';
import { Colors, Config, Divice } from '../../constants';
import { Methods } from '../../helpers';
import { connect } from 'react-redux';
import actions from '../../store/actions';
import { createQuestionMutation } from '../../graphql/task.graphql';
import { CategoriesQuery, QuestionQuery } from '../../graphql/question.graphql';
import { compose, Query, Mutation, graphql } from 'react-apollo';

import TaskType from './TaskType';
import KeyboardSpacer from 'react-native-keyboard-spacer';

let HOME_INDICATOR = 0;
if(Divice.isIos&&Divice.height>=Divice.width*2){
	HOME_INDICATOR = 30;
}

const ANSWERS = ['A','B','C','D'];

class ChooseItem extends Component {

	render() {
		const { option,isAnswer,reduceAnswer,remove } = this.props;
		return (
			<TouchableOpacity style={styles.option} onPress={() => reduceAnswer(option)}>
				<View style={[styles.chooseLabel,{borderColor: isAnswer ? Colors.theme: Colors.tintGray}]}>
					<Text style={[styles.chooseLabelText,{color:isAnswer ? Colors.theme: Colors.tintGray}]}>{option.Value}</Text>
				</View>
				<View style={styles.optionContent}>
					<Text style={styles.optionContentText}>{option.Text}</Text>
				</View>
				<TouchableOpacity style={{marginTop: 8}} onPress={()=>remove(option)}>
					<Iconfont name='close' size={16} color={"#696482"}/>
				</TouchableOpacity>
			</TouchableOpacity>
		);
	}
}

class MakeQuestionScreen extends Component {
	constructor(props) {
		super(props);
		this.dropData = null;
		this.state = {
			category_id:null,
			description:null,
			pictures:[],
			optionValue:null,
			answers:new Set(),
			options:new Map()
		};
	}

	onChooseInputFocus = ()=> {
		this._ScrollView.scrollTo({
			x: 0,
			y: 300,
			animated: true
		});
	}

	buildDropData = (data)=> {
		data = data.map((elem, index)=> {
			return elem.name
		});
		this.dropData = [data]
	}

	addOption = ()=> {
		let {optionValue,options} = this.state;
		if(optionValue){
			options.set(optionValue,false);
			this.setState({options});
		}
		this.setState({optionValue:null});
		Keyboard.dismiss();
	}

	removeOption = (option)=> {
		let {options} = this.state;
		options.delete(option.Text);
		this.setState({options},()=>{
			this.reduceAnswer();
		});
	}

	reduceAnswer = (option)=> {
		let {options,answers} = this.state;
		if(option) {
			if(answers.has(option.Value)){
				answers.delete(option.Value);
				options.set(option.Text,false);
			}else {
				answers.add(option.Value);
				options.set(option.Text,true);
			}
		}else {
			let i = 0;
			answers.clear();
			options.forEach((value,key)=>{
				if(value===true){
					answers.add(ANSWERS[i])
				}
				i++;
			})
		}
		answers = new Set([...answers].sort());
		this.setState({answers,options})
	}

	dropHandler = (name)=> {
		const {data: { loading, error, categories, refetch, fetchMore }} = this.props;
		categories.some((elem, i)=> {
			if(elem.name===name){
				this.setState({category_id: elem.id});
				return true;
			}
		});
	}

	buildVariables = ()=> {
		let { category_id, description, pictures, options, answers } = this.state;
		let selections = [...options].map((option,index) => {
			if(option){
				return {Value:ANSWERS[index],Text:option[0]}
			}
		})
		if(category_id&&description&&selections.length>0&&answers.size>0){
			return {
				data:{
					category_id,
					description,
					selections,
					answers
				}
			}
		}	
	}

	onCompleted = () => {
		Methods.toast('提交成功');
		this.props.navigation.goBack();
	};

	onError = () => {
		Methods.toast('提交失败,请检查操作是否有误');
	};

	render() {
		let { navigation, user, login } = this.props;
		let { category_id, description, pictures, options, optionValue, answers } = this.state;
		let disableAddButton = options.size>=4 || !optionValue;
		let variables = this.buildVariables();
		return (
			<Query query={CategoriesQuery} variables={{ limit: 100 }}>
				{({ data, loading, error }) => {
					if (data && data.categories) {
						this.buildDropData(data.categories)
					}else {
						this.dropData = [['请选择题库']];
					}
					return (
						<Screen header>
							<Header
								customStyle={styles.header}
								headerRight={
									<TouchableOpacity onPress={()=>navigation.navigate('出题记录')}>
										<Text>出题记录</Text>
									</TouchableOpacity>
							}
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
						          handler={(selection, row) => this.dropHandler(this.dropData[selection][row])}
						          data={this.dropData}
						        >
						          <ScrollView style={styles.container} contentContainerStyle={{flexGrow: 1,paddingBottom: HOME_INDICATOR+50}} ref={ref=>this._ScrollView=ref}>
						          	<DivisionLine />
						          	<View style={{marginBottom: 15}}>
						          	  <CustomTextInput 
						          	  		style={styles.questionInput}
						          	  		onChangeText={text => this.setState({ description: text })}
						          	  		multiline
						          	  		maxLength={300}
						          	  		textAlignVertical="top"
						          	  		placeholder="请添加问题描述"
						          	  />
				      	              <View style={{marginLeft: -10,marginTop: 10}}>
				      	  	          	<ImagePickerView
				      	  	          		onResponse={images => {
				      	  	          			this.setState({ pictures: images });
				      	  	          		}}
				      	  	          	/>
				      	              </View>
						          	</View>
						          	<DivisionLine />
			      		          	<View style={styles.chooseInputContainer}>
				      		          	<CustomTextInput 
				      		          		style={styles.chooseInput}
				      		          		multiline
				      		          		maxLength={80}
				      		          		value={optionValue}
				      		          	  	onChangeText={text => this.setState({ optionValue: text })}
				      		          		placeholder="请添加(2~4个)答案选项"
				      		          		onFocus={this.onChooseInputFocus}
				      		          	/>
				      		          	<TouchableOpacity disabled={disableAddButton} style={[styles.button,!disableAddButton&&{backgroundColor: Colors.blue}]} onPress={this.addOption}>
				      		          		<Text style={styles.addText}>添加选项</Text>
				      		          	</TouchableOpacity>
			      		          	</View>
						          	<DivisionLine />
						          	<View style={styles.answer}>
						          		<View style={styles.answers}>
							          		<Text style={styles.answerText}>正确答案: </Text>
							          		<Text style={[styles.answerText,{color:Colors.blue}]}>{[...answers].join(',')}</Text>
						          		</View>
							          	<Text style={styles.answerTip}>* 点击选项设置正确答案</Text>
						          	</View>
						          	<View>
							          	<View style={styles.options}>
							          		{[...options].map((option,index) => {
							          			return <ChooseItem key={index} option={{Value:ANSWERS[index],Text:option[0]}}  isAnswer={option[1]} reduceAnswer={this.reduceAnswer} remove={this.removeOption}></ChooseItem>
							          		})}
							          	</View>
						          	</View>
						          </ScrollView>
				                  <View style={styles.submitButtonWrap}>
					      	          <AnimationButton
					      	          		style={styles.submitButton}
					      	          		disabled={!variables}
					      	          		mutation={createQuestionMutation} 
					      	          		variables={variables}
					      	          		onCompleted={this.onCompleted}
					      	          		onError={this.onError}
					      	          >
					      	          	<Text style={styles.submitText}>创建题目</Text>
					      	          </AnimationButton>
				                  </View>
						          <KeyboardSpacer topSpacing={HOME_INDICATOR>0?-20:0}/>
						        </DropdownMenu>
							</View>
						</Screen>
					)
				}}
			</Query>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff'
	},
	header:{
		backgroundColor: Colors.theme,
		borderBottomWidth: 0,
		borderBottomColor: 'transparent'
	},
	lableText: {
		fontSize: 14,
		color:'#A0A0A0'
	},
	questionInput: {
		fontSize: 16,
		lineHeight: 22,
		color: '#212121',
		height: 160,
		paddingHorizontal: 15,
		marginTop: 10,
		backgroundColor: '#fff'
	},
	answer:{
		padding: 15,
	},
	answers:{
		flexDirection: 'row',
		alignItems: 'center'
	},
	answerText:{
		fontSize: 15,
		color:'#A0A0A0',
	},
	answerTip:{
		marginTop: 5,
		fontSize: 13,
		color:'#FF6330',
	},
	options: {
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
	submitButtonWrap:{
		flexDirection: 'row', 
		marginHorizontal: 15,
		paddingTop: 10,
		paddingBottom: HOME_INDICATOR||10,
	},
	submitButton:{
		height:42,
		borderRadius: 6,
		backgroundColor: Colors.theme
	},
	submitText:{
		fontSize: 16,
		color:'#fff'
	},
	chooseInputContainer:{ 
		height: 120,
		flexDirection: 'row',
		alignItems: 'center',
		padding: 15 
	},
	chooseInput:{
		flex: 1,
		alignSelf: 'stretch',
		justifyContent: 'center',
		fontSize: 15,
		lineHeight: 19,
		marginRight: 15,
		paddingBottom: 15
	},
	button:{
		position: 'absolute',
		bottom: 10,
		right: 15,
		width: 70,
		height: 30,
		borderRadius: 5,
		backgroundColor: '#A0A0A0',
		justifyContent: 'center',
		alignItems: 'center'
	},
	addText:{
		fontSize: 14,
		color:'#fff',
	}
});

export default compose(
	connect(store => ({user: store.users.user,login: store.users.login})),
)(MakeQuestionScreen)
