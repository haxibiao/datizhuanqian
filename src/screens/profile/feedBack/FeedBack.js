import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, Dimensions, TextInput, Image } from 'react-native';

import { Methods, Colors } from '../../../constants';
import { Iconfont } from '../../../utils/Fonts';
import { DivisionLine, Button } from '../../../components';
import Screen from '../../Screen';

import { CreateFeedbackMutation } from '../../../graphql/user.graphql';
import { Mutation } from 'react-apollo';

import ImagePicker from 'react-native-image-crop-picker';

const { width, height } = Dimensions.get('window');
class FeedBack extends Component {
	constructor(props) {
		super(props);
		this.state = {
			content: null,
			contact: null,
			pictures: []
		};
	}

	pickerPictures() {
		let { user } = this.props;
		ImagePicker.openPicker({
			multiple: true,
			mediaType: 'photo',
			includeBase64: true
		})
			.then(images => {
				let { pictures } = this.state;
				images.map(image => {
					pictures.push(image.path);
				});
				this.setState({
					pictures
				});
			})
			.catch(error => {});
	}

	render() {
		let { content, contact, pictures } = this.state;
		const { navigation } = this.props;
		console.log('pict', pictures);
		return (
			<Screen header>
				<View style={styles.container}>
					{/*<Text style={{ paddingHorizontal: 15, paddingVertical: 10, color: Colors.gery }}>反馈内容</Text>*/}
					<DivisionLine height={5} />
					<View style={styles.main}>
						<TextInput
							ref="textInput"
							style={styles.input}
							placeholder="请简要描述您的问题和意见,我们将为您不断改进"
							underlineColorAndroid="transparent"
							selectionColor="#000"
							multiline={true}
							textAlignVertical={'top'}
							onChangeText={content => {
								this.setState({ content: content });
							}}
							maxLength={200}
						/>
						<View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
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

							<TouchableOpacity style={styles.add} onPress={this.pickerPictures.bind(this)}>
								<Iconfont name={'add'} size={26} color={Colors.tintGray} />
							</TouchableOpacity>
						</View>
						<View style={styles.mainBottom} />
					</View>

					<Mutation mutation={CreateFeedbackMutation}>
						{CreateFeedbackMutation => {
							return (
								<Button
									name={'提交'}
									style={{ height: 42, marginHorizontal: 20, marginBottom: 20 }}
									theme={content ? Colors.blue : Colors.tintGray}
									textColor={content ? Colors.white : Colors.grey}
									handler={() => {
										CreateFeedbackMutation({
											variables: {
												content: content,
												contact: contact
											}
										});
										Methods.toast('反馈成功', -180);
										navigation.goBack();
									}}
								/>
							);
						}}
					</Mutation>
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
		marginLeft: 15,
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
		width: (width - 75) / 4,
		height: (width - 75) / 4,
		borderColor: Colors.tintGray,
		borderWidth: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	image: {
		width: (width - 75) / 4,
		height: (width - 75) / 4,
		marginRight: 15,
		marginBottom: 15
	},
	delete: {
		backgroundColor: Colors.grey,
		borderRadius: 8,
		position: 'absolute',
		right: 7,
		top: -7,
		width: 15,
		height: 15,
		justifyContent: 'flex-end',
		alignItems: 'center'
	},
	mainBottom: {
		borderBottomWidth: 1,
		borderBottomColor: Colors.lightBorder,
		marginRight: 15,
		marginTop: 15
	}
});

export default FeedBack;
