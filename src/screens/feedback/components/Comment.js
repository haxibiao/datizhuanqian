/*
 * @Author: Gaoxuan
 * @Date:   2019-03-22 15:49:14
 */

import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TouchableWithoutFeedback, Image } from 'react-native';
import { CustomTextInput, Iconfont } from '../../../components';

import { Theme, SCREEN_WIDTH } from '../../../utils';

class Comment extends Component {
	constructor(props) {
		super(props);
		this.state = {
			inputHeight: 51
		};
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
			submitComment,
			openPhotos,
			deleteImage,
			image
		} = this.props;
		let { inputHeight } = this.state;
		console.log('SCREEN_WIDTH', SCREEN_WIDTH);
		return (
			<View style={[styles.container, { maxHeight: image ? 188 : 100 }]}>
				{autoFocus ? (
					<View>
						{image ? (
							<View style={styles.images}>
								<Image
									source={{ uri: image }}
									style={{
										width: 68,
										height: 68
									}}
								/>
								<TouchableOpacity style={styles.delete} onPress={deleteImage}>
									<Iconfont name={'close'} size={12} color={Theme.white} />
								</TouchableOpacity>
							</View>
						) : null}
						{image ? <View style={{ height: 5, backgroundColor: Theme.lightBorder }} /> : null}

						{reply && (
							<View style={styles.quote}>
								<View style={styles.tag} />
								<Text style={styles.quoteText}>{reply}</Text>
							</View>
						)}
						<View style={{ paddingVertical: autoFocus ? 10 : 0 }}>
							<CustomTextInput
								style={{
									width: SCREEN_WIDTH - inputHeight - 20,
									padding: 0,
									height: null,
									maxHeight: 80,
									margin: 0,
									fontSize: 16
								}}
								maxLength={140}
								placeholder={'说说你的意见...'}
								multiline
								underline
								autoFocus
								selectionColor={Theme.theme}
								onEndEditing={switchKeybord}
								defaultValue={content}
								changeValue={changeValue}
							/>
						</View>
					</View>
				) : (
					<TouchableOpacity
						onPress={switchKeybord}
						activeOpacity={1}
						style={[{ width: SCREEN_WIDTH - inputHeight - 20 }, styles.replaceInput]}
					>
						<Text style={{ color: Theme.grey, fontSize: 16 }}>
							{content || image ? '[草稿待发送]' : '说说你的意见...'}
						</Text>
					</TouchableOpacity>
				)}
				<View
					style={styles.control}
					onLayout={event => {
						this.setState({
							inputHeight: event.nativeEvent.layout.width
						});
					}}
				>
					<TouchableWithoutFeedback onPress={openPhotos}>
						<Iconfont name={'photo'} color={Theme.grey} size={18} style={{ paddingHorizontal: 10 }} />
					</TouchableWithoutFeedback>
					<TouchableOpacity
						onPress={submitComment}
						disabled={!(content.length > 0 || image)}
						style={{ paddingHorizontal: 10 }}
					>
						<Iconfont
							name={'publish'}
							color={content.length > 0 || image ? Theme.theme : Theme.grey}
							size={20}
						/>
					</TouchableOpacity>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		borderTopColor: Theme.lightBorder,
		borderTopWidth: 0.3,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-end',
		paddingHorizontal: 15
	},
	images: {
		paddingVertical: 10,
		width: 68,
		height: 88
	},

	delete: {
		backgroundColor: 'rgba(150,150,150,0.5)',
		borderRadius: 8,
		position: 'absolute',
		right: 2,
		top: 12,
		width: 16,
		height: 16,
		justifyContent: 'center',
		alignItems: 'center'
	},
	quote: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingTop: 10
	},
	tag: {
		height: 16,
		width: 4,
		backgroundColor: '#dfe2e5'
	},
	quoteText: {
		color: Theme.grey,
		fontSize: 13,
		paddingLeft: 10,
		height: 20
	},
	replaceInput: {
		height: 48,

		flexDirection: 'row',
		alignItems: 'center'
	},
	control: {
		flexDirection: 'row',
		alignItems: 'center',
		marginRight: 5,
		height: 48
	}
});

export default Comment;
