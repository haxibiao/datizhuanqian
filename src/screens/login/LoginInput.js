import React, { Component } from 'react';
import Colors from '../../constants/Colors';
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';

import { Button，Iconfont } from '../../components';

class LoginInput extends Component {
	constructor(props) {
		super(props);
		this.value = props.value;
		this.state = { visibility: true, changes: 0, value: '' };
	}

	componentDidMount() {
		if (this.props.secure) {
			this.setState({ visibility: false });
		}
	}

	render() {
		let { visibility, value } = this.state;
		let {
			secure = false,
			keys,
			name,
			emptyValue,
			placeholder,
			focusItem,
			focusKey,
			changeValue,
			code,
			maxLength,
			customStyle = {}
		} = this.props;
		let combineStyle = StyleSheet.flatten([styles.inputWrap, customStyle]);
		return (
			<View style={combineStyle}>
				{/*<Iconfont name={name} size={18} color={Colors.tintFontColor} style={{ marginHorizontal: 22 }} />*/}
				<TextInput
					underlineColorAndroid="transparent"
					selectionColor={Colors.themeColor}
					style={styles.textInput}
					autoFocus={keys == focusItem}
					placeholder={placeholder}
					placeholderText={Colors.tintFontColor}
					onChangeText={value => {
						this.setState({ value });
						changeValue(keys, value);
					}}
					value={value}
					autoCapitalize={'none'}
					maxLength={maxLength}
					defaultValue={this.value}
					onFocus={() => focusKey(keys)}
					secureTextEntry={!visibility}
					ref={ref => (this.textInput = ref)}
				/>
				{secure ? (
					focusItem == keys ? (
						<TouchableOpacity
							style={styles.inputOperation}
							onPress={() =>
								this.setState(prevState => ({
									visibility: !prevState.visibility
								}))
							}
						>
							<Iconfont name={visibility ? 'eye' : 'hide'} size={19} color={Colors.lightFont} />
						</TouchableOpacity>
					) : (
						<View style={styles.inputOperation} />
					)
				) : focusItem == keys ? (
					<TouchableOpacity
						style={styles.inputOperation}
						onPress={() => {
							this.setState({ value: '' });
							emptyValue(keys);
						}}
					>
						<Iconfont name={'close'} size={16} color={Colors.lightFont} />
					</TouchableOpacity>
				) : (
					<View style={styles.inputOperation} />
				)}
				{code ? <Button name={'获取验证码'} style={{ height: 32, marginLeft: 30, fontSize: 13 }} /> : null}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	inputWrap: {
		flexDirection: 'row',
		alignItems: 'center',
		borderBottomWidth: 1,
		borderBottomColor: Colors.lightBorder
	},
	textInput: {
		flex: 1,
		fontSize: 16,
		height: 22,
		lineHeight: 22,
		padding: 0,
		color: Colors.primaryFont
	},
	inputOperation: {
		width: 46,
		height: 46,
		justifyContent: 'center',
		alignItems: 'center'
	}
});

export default LoginInput;
