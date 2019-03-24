/*
 * @Author: Gaoxuan
 * @Date:   2019-03-22 14:13:21
 */

import React, { Component } from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';

import { Theme, Api, SCREEN_WIDTH } from '../../../utils';

import { Iconfont } from '../../../components';

class ImagePickerView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			pictures: []
		};
	}

	openPhotos = () => {
		Api.imagePicker(images => {
			let { pictures } = this.state;
			images.map(image => {
				pictures.push(`data:${image.mime};base64,${image.data}`);
			});
			this.saveImages(pictures);
		}, true);
	};

	saveImages = images => {
		if (images.length > 6) {
			this.setState({
				pictures: images.slice(0, 6)
			});
			Toast.show({ content: '最大上传不超过6张图片' });
		} else {
			this.setState({
				pictures: images
			});
		}
		this.props.onResponse(this.state.pictures);
	};

	render() {
		let { pictures } = this.state;
		return (
			<View style={styles.images}>
				{pictures.map((image, index) => {
					return (
						<View key={index}>
							<Image source={{ uri: image }} style={styles.image} />
							<TouchableOpacity
								style={styles.delete}
								onPress={() => {
									pictures.splice(index, 1);
									this.setState({
										pictures
									});
								}}
							>
								<Iconfont name={'close'} size={12} color={Theme.white} />
							</TouchableOpacity>
						</View>
					);
				})}

				{!(pictures.length > 5) && (
					<TouchableOpacity style={styles.add} onPress={this.openPhotos}>
						<Iconfont name={'add'} size={26} color={Theme.tintGray} />
					</TouchableOpacity>
				)}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	images: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		marginLeft: 25
	},
	add: {
		width: (SCREEN_WIDTH - 60) / 3,
		height: (SCREEN_WIDTH - 60) / 3,
		borderColor: Theme.lightBorder,
		borderWidth: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	image: {
		width: (SCREEN_WIDTH - 60) / 3,
		height: (SCREEN_WIDTH - 60) / 3,
		marginRight: 5,
		marginBottom: 5
	},
	delete: {
		backgroundColor: 'rgba(150,150,150,0.5)',
		borderRadius: 8,
		position: 'absolute',
		right: 8,
		top: 2,
		width: 16,
		height: 16,
		justifyContent: 'center',
		alignItems: 'center'
	}
});

export default ImagePickerView;
