/*
* @flow
* created by wyk made in 2019-01-14 21:26:46
*/
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Image, VirtualizedListProps, FlatList } from 'react-native';
import { Theme, PxFit, SCREEN_WIDTH, SCREEN_HEIGHT, ISIOS, WPercent, Api } from '../../utils';
import Iconfont from '../Iconfont';
import PlaceholderImage from '../Basics/PlaceholderImage';
import Center from '../Container/Center';
import TouchFeedback from '../TouchableView/TouchFeedback';
import Uploading from '../Overlay/Uploading';
import OverlayViewer from '../Overlay/OverlayViewer';
import ImageViewer from 'react-native-image-zoom-viewer';

type Props = {
	horizontal?: boolean,
	maximum?: number,
	PickerView?: any,
	pickerStyle?: Object,
	style?: any,
	contentContainerStyle?: any
};
class ImagePickedViewer extends Component<Props> {
	static defaultProps = {
		maximum: 9,
		horizontal: true,
		contentContainerStyle: { paddingRight: PxFit(Theme.itemSpace) }
	};

	constructor(props: Props) {
		super(props);
		this.imageLength = 0;
		this.state = {
			pictures: [],
			uploading: false
		};
	}

	savedImages = [];

	openImagePicker = () => {
		Api.imagePicker(images => {
			let imagesPath;
			imagesPath = images.map(image => image.path);
			this.saveImages(imagesPath);
		});
	};

	saveImages = imagesPath => {
		let { pictures } = this.state;
		let newPictures = pictures.concat(imagesPath).splice(0, this.props.maximum);
		this.setState({ pictures: newPictures, uploading: true });
		Api.saveImages(imagesPath, this.onSaveSuccessed, () => this.onSaveFailed(pictures));
	};

	onSaveSuccessed = result => {
		this.savedImages = this.savedImages.concat(result);
		this.onResponse(this.savedImages);
		this.imageLength = this.state.pictures.length;
		this.setState({
			uploading: false
		});
	};

	onSaveFailed = pictures => {
		this.setState({
			pictures,
			uploading: false
		});
	};

	removePicture = pictureIndex => {
		let { pictures } = this.state;
		pictures.splice(pictureIndex, 1);
		this.savedImages.splice(pictureIndex, 1);
		this.onResponse(this.savedImages);
		this.setState({ pictures });
	};

	// 把上传的图片暴露出去
	onResponse = images => {
		this.props.onResponse && this.props.onResponse(images);
	};

	showPicture = url => {
		let overlayView = (
			<ImageViewer onSwipeDown={() => OverlayViewer.hide()} imageUrls={[{ url }]} enableSwipeDown />
		);
		OverlayViewer.show(overlayView);
	};

	renderPictures = (pictures: Array) => {
		return pictures.map((elem, index) => {
			return this.renderPicture(elem, index);
		});
	};

	renderPicture = (item, index) => {
		console.log('item',item);
		let { uploading } = this.state;
		let { pickerStyle } = this.props;
		let isUploading = uploading && index >= this.imageLength;
		return (
			<TouchFeedback
				disabled={isUploading}
				key={index}
				onPress={() => this.showPicture(item)}
				style={[styles.itemWrap, pickerStyle]}
			>
				<Image source={{ uri: item }} style={styles.imageItem} />
				<TouchFeedback disabled={isUploading} style={styles.close} onPress={() => this.removePicture(index)}>
					<Iconfont name="chacha" size={PxFit(10)} color="#fff" />
				</TouchFeedback>
				{isUploading && <Uploading />}
			</TouchFeedback>
		);
	};

	renderFooter = pictureQuantity => {
		let { uploading } = this.state;
		let { pickerStyle, PickerView, maximum } = this.props;
		if (!PickerView) {
			PickerView = <Iconfont name="add" size={PxFit(30)} color="#696482" />;
		}
		if (pictureQuantity < maximum) {
			return (
				<TouchFeedback
					disabled={uploading}
					style={[styles.itemWrap, pickerStyle]}
					onPress={this.openImagePicker}
				>
					{PickerView}
					{uploading && <Uploading />}
				</TouchFeedback>
			);
		} else {
			return <View />;
		}
	};

	render() {
		let { pictures } = this.state;
		let { horizontal, contentContainerStyle, style } = this.props;
		let pictureQuantity = pictures.length;
		if (horizontal) {
			return (
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={contentContainerStyle}
				>
					{pictureQuantity > 0 && this.renderPictures(pictures)}
					{this.renderFooter(pictureQuantity)}
				</ScrollView>
			);
		} else {
			return (
				<View style={[styles.flexContainer, style]}>
					{pictureQuantity > 0 && this.renderPictures(pictures)}
					{pictureQuantity > 0 && this.renderFooter(pictureQuantity)}
				</View>
			);
		}
	}
}

const styles = StyleSheet.create({
	close: {
		position: 'absolute',
		top: PxFit(3),
		right: PxFit(3),
		width: PxFit(16),
		height: PxFit(16),
		borderRadius: PxFit(16) / 2,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(32,30,51,0.8)'
	},
	itemWrap: {
		width: PxFit(90),
		height: PxFit(90),
		marginRight: PxFit(Theme.itemSpace),
		borderRadius: PxFit(6),
		backgroundColor: '#F1EFFA',
		justifyContent: 'center',
		alignItems: 'center',
		overflow: 'hidden'
	},
	imageItem: {
		position: 'absolute',
		top: 0,
		left: 0,
		bottom: 0,
		right: 0
	},
	flexContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap'
	}
});

export default ImagePickedViewer;
