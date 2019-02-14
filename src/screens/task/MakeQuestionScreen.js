/*
* @flow
* created by wyk made in 2019-02-12 10:29:25
*/
import React, { Component } from 'react';
import { StyleSheet, TouchableWithoutFeedback,View, ScrollView, Image, Text, TouchableOpacity, Keyboard,Animated } from 'react-native';
import { DivisionLine, Header, Screen, LoadingError,CustomTextInput, DropdownMenu,Iconfont,AnimationButton } from '../../components';
import { Colors, Config, Divice } from '../../constants';
import { Methods } from '../../helpers';
import { connect } from 'react-redux';
import actions from '../../store/actions';
import { createQuestionMutation } from '../../graphql/task.graphql';
import { CategoriesQuery, QuestionQuery } from '../../graphql/question.graphql';
import { compose, Query, Mutation, graphql } from 'react-apollo';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import ImagePicker from 'react-native-image-crop-picker';

import OptionItem from './OptionItem';

let HOME_INDICATOR = 0;
if(Divice.isIos&&Divice.height>=Divice.width*2){
	HOME_INDICATOR = 30;
}
const ANSWERS = ['A','B','C','D'];

class MakeQuestionScreen extends Component {
	constructor(props) {
		super(props);
		this.categories = [];
		this.dropData = null;
		this.state = {
			category_id:null,
			description:null,
			picture:null,
			optionValue:null,
			answers:new Set(),
			options:new Map()
		};
	}

	onOptionInputFocus = ()=> {
		this._ScrollView.scrollTo({
			x: 0,
			y: 300,
			animated: true
		});
	}

	buildDropData = (data)=> {
		this.categories = data;
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
		this.categories.some((elem, i)=> {
			if(elem.name===name){
				this.setState({category_id: elem.id});
				return true;
			}
		});
	}

	imagePicke = () => {
		ImagePicker.openPicker({
			mediaType: 'photo',
			includeBase64: true
		})
			.then(image => {
				image=`data:${image.mime};base64,${image.data}`;
				this.setState({picture:image})
			})
			.catch(error => {
			});
	};

	buildVariables = ()=> {
		let { category_id, description,picture, options, answers } = this.state;
		let selections = [...options].map((option,index) => {
			if(option){
				return {Value:ANSWERS[index],Text:option[0]}
			}
		})
		if(category_id&&description&&selections.length>1&&answers.size>0){
			return {
				data:{
					category_id,
					description,
					image:picture,
					selections,
					answers:[...answers]
				}
			}
		}	
	}

	onCompleted = () => {
		Methods.toast('提交成功',150);
		this.props.navigation.goBack();
	};

	onError = (error) => {
		alert(error);
		Methods.toast('提交失败',150);
	};

	render() {
		let { navigation, user, login } = this.props;
		let { category_id, description, picture, options, optionValue, answers } = this.state;
		let disableAddButton = options.size>=4 || !optionValue;
		let variables = this.buildVariables();
		console.log('variables',variables);
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
				      	          <AnimationButton
				      	          		style={styles.submitButton}
				      	          		disabled={!variables}
				      	          		mutation={createQuestionMutation} 
				      	          		variables={variables}
				      	          		onCompleted={this.onCompleted}
				      	          		onError={this.onError}
				      	          >
				      	          	<Iconfont name='book2' color='#212121' size={17} style={{marginRight: 4}}/>
				      	          	<Text style={{fontSize: 17,color:'#212121'}}>提交</Text>
				      	          </AnimationButton>
							}
							/>
							<View style={styles.container}>
								<DropdownMenu
								  dropStyle={{paddingHorizontal: 15}}
						          dropItemStyle={{alignItems: 'flex-end'}}
						          lables={['请选择题库']}
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
						          <ScrollView keyboardDismissMode={'none'} style={styles.container} contentContainerStyle={{flexGrow: 1,paddingBottom: HOME_INDICATOR+50}} ref={ref=>this._ScrollView=ref}>
						          	<DivisionLine />
						          	<View style={{marginBottom: 15}}>
						          	  <CustomTextInput 
						          	  		style={styles.questionInput}
						          	  		onChangeText={text => this.setState({ description: text.trim() })}
						          	  		multiline
						          	  		maxLength={300}
						          	  		textAlignVertical="top"
						          	  		placeholder="请添加问题描述"
						          	  />
				      	              <View style={{marginTop: 10,marginLeft: 15}}>
				      	              	{
					      	              	picture?<TouchableWithoutFeedback onPress={this.imagePicke}>
					      	              		<Image source={{ uri: picture }} style={styles.addImage} />
					      	              	</TouchableWithoutFeedback>:
					      	  	          	<TouchableOpacity style={styles.addImage} onPress={this.imagePicke}>
					      	  	          		<Iconfont name={'add'} size={26} color='#fff' />
					      	  	          	</TouchableOpacity>
				      	              	}
				      	              </View>
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
							          			return (<OptionItem key={index} style={{padding: 12}} option={{Value:ANSWERS[index],Text:option[0]}}  isAnswer={option[1]} reduceAnswer={this.reduceAnswer} remove={this.removeOption}></OptionItem>)
							          		})}
							          	</View>
						          	</View>
						          	{!Divice.isIos&&<KeyboardSpacer topSpacing={-HOME_INDICATOR}/>}
						          </ScrollView>
				                  <View style={styles.bottom}>
              				          <View style={styles.inputContainer}>
              				          	<CustomTextInput 
              				          		style={styles.optionInput}
              				          		maxLength={80}
              				          		value={optionValue}
              				          	  	onChangeText={text => this.setState({ optionValue: text.trim() })}
              				          		placeholder="请添加答案选项(2~4个)"
              				          		onFocus={this.onOptionInputFocus}
              				          	/>
              				          	<TouchableOpacity disabled={disableAddButton} style={[styles.button,!disableAddButton&&{backgroundColor: '#68afff'}]} onPress={this.addOption}>
              				          		<Text style={styles.addText}>添 加</Text>
              				          	</TouchableOpacity>
              				          </View>
              			          </View>
						          {Divice.isIos&&<KeyboardSpacer topSpacing={-HOME_INDICATOR}/>}
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
	submitButton:{
		width: 60,
		height: 25,
		backgroundColor: 'transparent',
		flexDirection: 'row',
		alignItems: 'center'
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
	addImage: {
		width: 80,
		height: 80,
		borderRadius: 3,
		backgroundColor: '#f0f0f0',
		justifyContent: 'center',
		alignItems: 'center'
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
	optionInput:{
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
		fontSize: 14,
		color:'#fff',
	}
});

export default compose(
	connect(store => ({user: store.users.user,login: store.users.login})),
)(MakeQuestionScreen)
