import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Input } from '../../components';

import { Colors, Divice } from '../../constants';
import { Methods } from '../../helpers';

class Comment extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		const {
			navigation,
			feedback,
			changeValue,
			autoFocus,
			reply,
			content,
			switchKeybord,
			submitComment
		} = this.props;

		return (
			<View style={[styles.footer, !autoFocus && { paddingVertical: 0 }]}>
				{autoFocus ? (
					<View>
						{reply && (
							<View style={{ flexDirection: 'row', alignItems: 'center' }}>
								<View style={{ height: 16, width: 4, backgroundColor: '#dfe2e5' }} />
								<Text
									style={{
										color: Colors.grey,
										fontSize: 13,
										paddingLeft: 10,
										height: 20
									}}
								>
									{reply}
								</Text>
							</View>
						)}
						<Input
							customStyle={styles.input}
							viewStyle={{ paddingHorizontal: 0 }}
							maxLength={140}
							placeholder={'说说你的意见...'}
							multiline
							underline
							autoFocus
							onEndEditing={switchKeybord}
							defaultValue={content}
							changeValue={changeValue}
						/>
					</View>
				) : (
					<TouchableOpacity
						onPress={switchKeybord}
						style={{
							paddingVertical: 10,
							width: Divice.width - 100,
							flexDirection: 'row',
							alignItems: 'center'
						}}
					>
						<Text style={{ color: Colors.grey, fontSize: 16 }}>说说你的意见...</Text>
					</TouchableOpacity>
				)}
				<TouchableOpacity onPress={submitComment} disabled={content.length < 1}>
					<Text style={styles.commentText}>发布</Text>
				</TouchableOpacity>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	input: {
		padding: 0,
		height: null,
		margin: 0,
		width: Divice.width - 60
	},
	footer: {
		borderTopColor: Colors.lightBorder,
		borderTopWidth: 0.5,
		paddingVertical: 10,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 15,
		maxHeight: 100
	},
	commentText: {
		color: Colors.theme,
		fontSize: 16
	}
});

export default Comment;
