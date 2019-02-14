import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, TextInput } from 'react-native';
import { Colors } from '../../constants';

class Input extends Component {
	render() {
		let {
			customStyle = {},
			viewStyle = {},
			placeholder,
			password,
			changeValue,
			defaultValue,
			editable,
			onEndEditing,
			maxLength,
			multiline,
			underline,
			textAlignVertical,
			autoFocus,
			onFocus
		} = this.props;
		return (
			<View
				style={[
					styles.textWrap,
					viewStyle,
					underline && {
						borderBottomWidth: 0,
						borderBottomColor: Colors.white
					}
				]}
			>
				<TextInput
					underlineColorAndroid="transparent"
					textAlignVertical={textAlignVertical}
					autoCapitalize={'none'}
					secureTextEntry={password}
					defaultValue={defaultValue}
					maxLength={maxLength ? maxLength : 24}
					multiline={multiline}
					editable={editable}
					onEndEditing={onEndEditing}
					placeholder={placeholder}
					placeholderText={Colors.tintFont}
					selectionColor={Colors.grey}
					autoFocus={autoFocus}
					onFocus={onFocus}
					style={[styles.textInput, customStyle]}
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
