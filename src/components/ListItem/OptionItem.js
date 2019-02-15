/*
* @flow
* created by wyk made in 2019-02-14 11:36:47
*/
'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text
} from 'react-native';
import Iconfont from '../utils/Iconfont';
import { Colors } from '../../constants';


class OptionItem extends Component {

	render() {
		const { style,option,isAnswer,reduceAnswer,remove } = this.props;
		if(!reduceAnswer || !remove){
			return (
				<View style={[styles.optionItem,style]} >
					<View style={[styles.optionLabel,isAnswer&&{backgroundColor: Colors.skyBlue,borderWidth:0}]}>
						<Text style={[styles.optionLabelText,isAnswer&&{color:'#fff'}]}>{option.Value}</Text>
					</View>
					<View style={styles.optionContent}>
						<Text style={styles.optionContentText}>{option.Text}</Text>
					</View>
				</View>
			);
		}
		return (
			<TouchableOpacity style={[styles.optionItem,style]} onPress={() => reduceAnswer(option)}>
				<View style={[styles.optionLabel,isAnswer&&{backgroundColor: Colors.skyBlue,borderWidth:0}]}>
					<Text style={[styles.optionLabelText,isAnswer&&{color:'#fff'}]}>{option.Value}</Text>
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

const styles = StyleSheet.create({
	optionItem:{
		flexDirection: 'row',
	},
	optionLabel:{
		marginRight: 15,
		width: 36,
		height: 36,
		borderRadius: 18,
		borderWidth: 2,
		borderColor: Colors.skyBlue,
		justifyContent: 'center',
		alignItems: 'center'
	},
	optionLabelText:{
		fontSize: 17,
		fontWeight: '500',
		color: Colors.skyBlue
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
});


export default OptionItem;