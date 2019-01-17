import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, FlatList, Image, Dimensions, TextInput } from 'react-native';
import { Button, Radio } from '../../components';

import { Colors, Config, Divice } from '../../constants';
import { Iconfont } from '../../utils/Fonts';

import { connect } from 'react-redux';

import Screen from '../Screen';

const { width, height } = Dimensions.get('window');

class ErrorCorrectionScreen extends Component {
	constructor(props) {
		super(props);
		this.onCheck = this.onCheck.bind(this);
		this.state = {
			color: Colors.theme,
			check: 1
		};
	}
	onCheck(value) {
		this.setState({ check: value });
	}

	render() {
		let { user, navigation, login, prop } = this.props;
		let { color, check } = this.state;
		const { id } = navigation.state.params;
		return (
			<Screen>
				<View style={styles.container}>
					<View style={{ paddingHorizontal: 15, backgroundColor: Colors.white }}>
						<Text style={{ fontSize: 17, paddingTop: 25 }}>错误类型</Text>
						<View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingVertical: 10 }}>
							<View style={styles.row}>
								<Radio value={1} check={check} onCheck={this.onCheck} />
								<Text style={styles.text}>题干有误</Text>
							</View>
							<View style={styles.row}>
								<Radio value={2} check={check} onCheck={this.onCheck} />
								<Text style={styles.text}>答案有误</Text>
							</View>
							<View style={styles.row}>
								<Radio value={3} check={check} onCheck={this.onCheck} />
								<Text style={styles.text}>图片不清晰</Text>
							</View>
							<View style={styles.row}>
								<Radio value={4} check={check} onCheck={this.onCheck} />
								<Text style={styles.text}>其他</Text>
							</View>
						</View>
					</View>
					<View style={{ marginTop: 15, backgroundColor: Colors.white, padding: 15 }}>
						<TextInput
							ref="textInput"
							style={styles.input}
							placeholder="您的耐心指点,是我们前进的动力！"
							underlineColorAndroid="transparent"
							selectionColor="#000"
							multiline={true}
							textAlignVertical={'top'}
							onChangeText={content => {
								this.setState({ content: content });
							}}
							maxLength={200}
						/>
					</View>
					<View style={{ marginTop: 40, marginBottom: 20 }}>
						<Button
							name={'提交'}
							style={{ height: 42, marginHorizontal: 20, marginBottom: 20 }}
							theme={Colors.blue}
							fontSize={14}
						/>
					</View>
				</View>
			</Screen>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.lightGray
	},
	row: {
		flexDirection: 'row',
		alignItems: 'center',
		width: (width - 30) / 2,
		paddingVertical: 10
	},
	text: {
		fontSize: 15,
		paddingLeft: 20
	},
	input: {
		backgroundColor: 'transparent',
		fontSize: 15,
		padding: 0,
		height: 220,
		justifyContent: 'flex-start'
		// marginTop:10,
	}
});

export default connect(store => {
	return { user: store.users.user };
})(ErrorCorrectionScreen);
