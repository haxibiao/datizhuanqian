import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Text, Image, ImageBackground } from 'react-native';
import { Player } from '../../components';
import { Colors, Divice } from '../../constants';

class Question extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		let { question, option, isMethod, value, changeValue, pickColor, rightColor } = this.props;
		// 修复数据问题
		if (!(option && option.Selection)) {
			option = { Selection: [] };
		}
		return (
			<View>
				<Text style={styles.title}>{question.description}</Text>
				{question.image && (
					<Image
						source={{
							uri: question.image.path
						}}
						style={{
							width: Divice.width - 60,
							height: (question.image.height / question.image.width) * (Divice.width - 60),
							marginTop: 10,
							borderRadius: 5
						}}
					/>
				)}
				{
					// question.video &&
					// <ImageBackground
					// 	style={{ width: Divice.width - 60, height: Divice.width - 60, marginTop: 30 }}
					// 	blurRadius={12}
					// 	source={{
					// 		uri: question.video.cover
					// 	}}
					// >
					// 	<Player
					// 		source={question.video.path}
					// 	/>
					// </ImageBackground>
				}
				<View style={styles.options}>
					{option.Selection.map((option, index) => {
						return (
							<TouchableOpacity
								disabled={isMethod}
								key={index}
								style={[
									styles.option,
									{
										borderColor:
											value == option.Value
												? pickColor
												: option.Value == question.answer
												? rightColor
												: Colors.tintGray
									}
								]}
								onPress={() => changeValue(option.Value)}
							>
								<Text>{option.Text}</Text>
							</TouchableOpacity>
						);
					})}
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	title: {
		color: Colors.primaryFont,
		fontSize: 16,
		lineHeight: 22
	},
	options: {
		paddingTop: 30,
		paddingHorizontal: 10
	},
	option: {
		marginTop: 13,
		borderWidth: 1,
		borderRadius: 5,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: 12,
		paddingHorizontal: 15
	}
});

export default Question;
