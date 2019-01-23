import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, TextInput, Image } from 'react-native';
import { DivisionLine, Button, Iconfont, Screen, Input } from '../../components';

import { Colors, Divice } from '../../constants';
import { Methods } from '../../helpers';

class SubmitTaskScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			content: null,
			contact: null,
			pictures: []
		};
	}

	//打开相册
	openPhotos = () => {
		Methods.imagePicker(images => {
			let { pictures } = this.state;
			images.map(image => {
				pictures.push(image.path);
			});
			if (pictures.length > 6) {
				this.setState({
					pictures: pictures.slice(0, 6)
				});
				Methods.toast('最大上传不超过6张图片');
			} else {
				this.setState({
					pictures
				});
			}
		});
	};

	render() {
		let { content, contact, pictures } = this.state;
		const { navigation } = this.props;
		console.log('pictures', pictures);
		return (
			<Screen>
				<View style={styles.container}>
					<DivisionLine height={5} />
					<View
						style={{
							flexDirection: 'row',
							alignItems: 'center',
							paddingVertical: 20
						}}
					>
						<View style={{ height: 22, width: 10, backgroundColor: Colors.theme, marginRight: 15 }} />
						<Text style={{ color: Colors.primaryFont, fontSize: 18 }}>小米应用商店评论</Text>
					</View>
					<View style={styles.main}>
						<View
							style={{
								marginHorizontal: 25,
								paddingBottom: 40,
								flexDirection: 'row',
								alignItems: 'center'
							}}
						>
							<Text style={{ fontSize: 16, color: Colors.primaryFont }}>上传截图</Text>
							<Text style={{ fontSize: 15, color: Colors.grey }}>（{pictures.length}/6）</Text>
						</View>
						<View style={{ flexDirection: 'row', flexWrap: 'wrap', marginLeft: 25 }}>
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
											<Iconfont name={'close'} size={12} color={Colors.white} />
										</TouchableOpacity>
									</View>
								);
							})}

							{!(pictures.length > 5) && (
								<TouchableOpacity style={styles.add} onPress={this.openPhotos}>
									<Iconfont name={'add'} size={26} color={Colors.tintGray} />
								</TouchableOpacity>
							)}
						</View>
						<View style={styles.mainBottom} />
					</View>

					<Button
						name={'提交'}
						style={{ height: 42, marginHorizontal: 20, marginBottom: 20 }}
						theme={pictures.length > 0 ? Colors.theme : Colors.tintGray}
						textColor={pictures.length > 0 ? Colors.white : Colors.grey}
						handler={() => {}}
					/>
				</View>
			</Screen>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.white
	},
	main: {
		paddingVertical: 15,
		marginBottom: 30
	},
	input: {
		backgroundColor: 'transparent',
		fontSize: 15,
		padding: 0,
		height: 260,
		justifyContent: 'flex-start',
		marginRight: 15
		// marginTop:10,
	},
	add: {
		width: (Divice.width - 60) / 3,
		height: (Divice.width - 60) / 3,
		borderColor: Colors.lightBorder,
		borderWidth: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	image: {
		width: (Divice.width - 60) / 3,
		height: (Divice.width - 60) / 3,
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
	},
	mainBottom: {
		borderBottomWidth: 1,
		borderBottomColor: Colors.lightBorder,
		marginRight: 15,
		marginTop: 40
	}
});

export default SubmitTaskScreen;
