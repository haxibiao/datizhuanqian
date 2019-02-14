/*
* @flow
* created by wyk made in 2019-02-14 10:43:04
*/
'use strict';
import React, { Component } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { UploadImage } from '../../graphql/task.graphql';
import { Iconfont } from '../utils/Fonts';
import { Mutation } from 'react-apollo';
import ImagePicker from 'react-native-image-crop-picker';

class UploadingImage extends Component {

	constructor(props) {
	  super(props);
	
	  this.state = {
	  	picture:null,
	  	uploading: false
	  };
	}

	imagePicke = () => {
		ImagePicker.openPicker({
			mediaType: 'photo',
			includeBase64: true
		})
			.then(image => {
				image=`data:${image.mime};base64,${image.data}`;
				this.setState({picture:image,uploading: true});
			})
			.catch(error => {
				this.onError();
			});
	};

	onCompleted = result => {
		this.props.onResponse&&this.props.onResponse(result);
		this.setState({
			uploading: false
		});
	};

	onError = () => {
		this.setState({
			picture:null,
			uploading: false
		});
		Methods.toast('上传失败')
	};

	render() {
		let { style = {},iconSize=26 } = this.props;
		return (
			<Mutation
				mutation={UploadImage}
				variables={[picture]}
				onCompleted={this.onCompleted}
				onError={this.onError}
			>
				{uploadImage=>{
					return (
						<TouchableOpacity
							disabled={uploading}
							style={[styles.container,style]}
							onPress={this.imagePicke}
						>
							{
								picture? <Image source={{ uri: picture }} style={styles.image} />:<Iconfont name={'add'} size={iconSize} color='#fff' />
							}
							{uploading && (
									<View style={[styles.upload, style]}>
										<ActivityIndicator color="#fff" size={'small'} />
									</View>
								)
							}
						</TouchableOpacity>
					)
				}}
			</Mutation>
		);
	}
}

const styles = StyleSheet.create({
	container:{
		width: 80,
		height: 80,
		borderRadius: 3,
		backgroundColor: '#f0f0f0',
		justifyContent: 'center',
		alignItems: 'center',
		overflow: 'hidden' 
	},
	image: {
		position: 'absolute',
		top:0,
		left:0,
		right:0,
		bottom:0,
	},
	upload: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: 'rgba(00,00,00,0.3)',
		justifyContent: 'center',
		alignItems: 'center'
	}
});

export default UploadingImage;