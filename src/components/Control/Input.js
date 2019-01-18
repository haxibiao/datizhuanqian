import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, TextInput } from 'react-native';
import { Colors } from '../../constants';

class Input extends Component {
	render() {
		let { customStyle = {}, placeholder, password, changeValue, defaultValue, editable } = this.props;
		return (
			<View style={[styles.textWrap, customStyle]}>
				<TextInput
					textAlignVertical="center"
					underlineColorAndroid="transparent"
					autoCapitalize={'none'}
					secureTextEntry={password}
					defaultValue={defaultValue}
					maxLength={16}
					editable={editable}
					placeholder={placeholder}
					placeholderText={Colors.tintFont}
					selectionColor={Colors.theme}
					style={styles.textInput}
					onChangeText={value => {
						changeValue(value);
					}}
				/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	textWrap: {
		paddingHorizontal: 20,
		borderBottomWidth: 1,
		borderBottomColor: Colors.lightBorder
	},
	textInput: {
		fontSize: 16,
		color: Colors.primaryFont,
		padding: 0,
		lineHeight: 22,
		height: 50
	}
});

export default Input;
