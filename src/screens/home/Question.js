import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Text, Image, ImageBackground } from 'react-native';
import { Player, Avatar } from '../../components';
import { Colors, Divice } from '../../constants';

class Question extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	// question.selections 结构不统一
	selectionAdapter(data) {
		let selection;
		if (Array.isArray(data)) {
			selection = data;
		} else if (typeof data === 'object') {
			selection = data.Selection || data.Section || [];
		}
		return selection;
	}

	render() {
		let { question, option = {}, isMethod, value, changeValue, pickColor, rightColor } = this.props;
		let selection = this.selectionAdapter(option);
		return (
			<View>
				<View style={{ marginTop: 10 }}>
					{question.image && (
						<Image
							source={{
								uri: question.image.path
							}}
							style={{
								width: Divice.width - 60,
								height: (question.image.height / question.image.width) * (Divice.width - 60),
								borderRadius: 5
							}}
						/>
					)}
					{question.video && <Player width={Divice.width - 60} source={question.video.path} />}
				</View>
				<View
					style={[
						styles.options,
						question.video
							? { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }
							: {}
					]}
				>
					{selection.map((option, index) => {
						return (
							<TouchableOpacity
								disabled={isMethod}
								key={index}
								style={[
									question.video ? styles.valueOption : styles.option,
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
								<Text numberOfLines={1}>{option.Text}</Text>
							</TouchableOpacity>
						);
					})}
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	options: {
		paddingTop: 20
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
	},
	valueOption: {
		marginTop: 13,
		borderWidth: 1,
		borderRadius: 5,
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: 12,
		width: (Divice.width - 80) / 2
	}
});

export default Question;
