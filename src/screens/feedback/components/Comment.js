/*
 * @Author: Gaoxuan
 * @Date:   2019-03-22 15:49:14
 */

import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TouchableWithoutFeedback, Image } from 'react-native';
import { CustomTextInput, Iconfont } from 'components';

import { Theme, SCREEN_WIDTH, PxFit } from 'utils';

class Comment extends Component {
	constructor(props) {
		super(props);
		this.state = {
			inputHeight: PxFit(51)
		};
	}

	render() {
		const {
			changeText,
			isInput,
			reply,
			content,
			switchReplyType,
			submitComment,
			openPhotos,
			deleteImage,
			image
		} = this.props;
		return (
			<View style={[styles.container, { maxHeight: image ? PxFit(188) : PxFit(100) }]}>
				{isInput ? this.renderInput() : this.rendeReplaceInput()}
				<View
					style={styles.commentRight}
					onLayout={event => {
						this.setState({
							inputHeight: event.nativeEvent.layout.width
						});
					}}
				>
					<TouchableWithoutFeedback onPress={openPhotos}>
						<Iconfont
							name={'photo'}
							color={Theme.grey}
							size={18}
							style={{ paddingHorizontal: PxFit(10) }}
						/>
					</TouchableWithoutFeedback>
					<TouchableOpacity
						onPress={submitComment}
						disabled={!(content.length > 0 || image)}
						style={{ paddingHorizontal: PxFit(10) }}
					>
						<Iconfont
							name={'publish'}
							color={content.length > 0 || image ? Theme.primaryColor : Theme.grey}
							size={18}
						/>
					</TouchableOpacity>
				</View>
			</View>
		);
	}

	renderInput = () => {
		const { changeText, reply, content, switchReplyType, deleteImage, image } = this.props;
		let { inputHeight } = this.state;
		return (
			<View>
				{image ? (
					<View>
						<View style={styles.images}>
							<Image
								source={{ uri: image }}
								style={{
									width: PxFit(68),
									height: PxFit(68)
								}}
							/>
							<TouchableOpacity style={styles.delete} onPress={deleteImage}>
								<Iconfont name={'close'} size={12} color={Theme.white} />
							</TouchableOpacity>
						</View>
						<View style={{ height: PxFit(0.5), backgroundColor: Theme.lightBorder }} />
					</View>
				) : null}
				{reply && (
					<View style={styles.quote}>
						<View style={styles.tag} />
						<Text style={styles.quoteText}>{reply}</Text>
					</View>
				)}
				<View style={{ paddingVertical: PxFit(10) }}>
					<CustomTextInput
						style={{
							width: SCREEN_WIDTH - inputHeight - PxFit(20),
							padding: 0,
							height: null,
							maxHeight: PxFit(80),
							margin: 0,
							fontSize: PxFit(16)
						}}
						maxLength={140}
						placeholder={'说说你的意见...'}
						multiline
						underline
						autoFocus
						selectionColor={Theme.primaryColor}
						onEndEditing={switchReplyType}
						defaultValue={content}
						onChangeText={changeText}
					/>
				</View>
			</View>
		);
	};

	rendeReplaceInput = () => {
		const { switchReplyType, image, content } = this.props;
		let { inputHeight } = this.state;
		return (
			<TouchableOpacity
				onPress={switchReplyType}
				activeOpacity={1}
				style={[{ width: SCREEN_WIDTH - inputHeight - PxFit(20) }, styles.replaceInput]}
			>
				<Text style={{ color: Theme.grey, fontSize: PxFit(16) }}>
					{content || image ? '[草稿待发送]' : '说说你的意见...'}
				</Text>
			</TouchableOpacity>
		);
	};
}

const styles = StyleSheet.create({
	container: {
		borderTopColor: Theme.lightBorder,
		borderTopWidth: PxFit(0.5),
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-end',
		paddingHorizontal: PxFit(15)
	},
	images: {
		paddingVertical: PxFit(10),
		width: PxFit(68),
		height: PxFit(88)
	},

	delete: {
		backgroundColor: 'rgba(150,150,150,0.5)',
		borderRadius: PxFit(8),
		position: 'absolute',
		right: PxFit(2),
		top: PxFit(12),
		width: PxFit(16),
		height: PxFit(16),
		justifyContent: 'center',
		alignItems: 'center'
	},
	quote: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingTop: PxFit(10)
	},
	tag: {
		height: PxFit(16),
		width: PxFit(4),
		backgroundColor: '#dfe2e5'
	},
	quoteText: {
		color: Theme.grey,
		fontSize: PxFit(13),
		paddingLeft: PxFit(10),
		height: PxFit(20)
	},
	replaceInput: {
		height: PxFit(48),

		flexDirection: 'row',
		alignItems: 'center'
	},
	commentRight: {
		flexDirection: 'row',
		alignItems: 'center',
		marginRight: PxFit(5),
		height: PxFit(48)
	}
});

export default Comment;
