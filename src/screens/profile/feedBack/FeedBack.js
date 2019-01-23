import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, TextInput, Image } from 'react-native';
import { DivisionLine, Button, Iconfont, Screen, Input } from '../../../components';

import { Colors, Divice } from '../../../constants';
import { Methods } from '../../../helpers';

import { CreateFeedbackMutation } from '../../../graphql/user.graphql';
import { Mutation } from 'react-apollo';

class FeedBack extends Component {
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

		return (
			<Screen header>
				<View style={styles.container}>
					{/*<Text style={{ paddingHorizontal: 15, paddingVertical: 10, color: Colors.gery }}>反馈内容</Text>*/}
					<DivisionLine height={5} />
					<View style={styles.main}>
						<Input
							customStyle={styles.input}
							maxLength={400}
							placeholder={'请简要描述您的问题和意见,我们将为您不断改进'}
							multiline
							underline
							changeValue={value => {
								this.setState({
									content: value
								});
							}}
						/>
						<View style={{ flexDirection: 'row', flexWrap: 'wrap', marginLeft: 15 }}>
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

							<TouchableOpacity style={styles.add} onPress={this.openPhotos}>
								<Iconfont name={'add'} size={24} color={Colors.tintGray} />
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
									theme={content ? Colors.theme : Colors.tintGray}
									textColor={content ? Colors.white : Colors.grey}
									handler={async () => {
										let result = {};
										try {
											result = await CreateFeedbackMutation({
												variables: {
													content: content,
													contact: contact
												}
											});
										} catch (ex) {
											result.errors = ex;
										}
										if (result && result.errors) {
											let str = result.errors.toString().replace(/Error: GraphQL error: /, '');
											Methods.toast(str, -180); //Toast错误信息
										} else {
											Methods.toast('反馈成功', -180);
											navigation.goBack();
										}
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
		paddingVertical: 15,
		marginBottom: 30
	},
	input: {
		backgroundColor: 'transparent',
		fontSize: 15,
		padding: 0,
		height: 260,
		justifyContent: 'flex-start',
		marginRight: 0
		// marginTop:10,
	},
	add: {
		width: (Divice.width - 45) / 4,
		height: (Divice.width - 45) / 4,
		borderColor: Colors.tintGray,
		borderWidth: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	image: {
		width: (Divice.width - 45) / 4,
		height: (Divice.width - 45) / 4,
		marginRight: 5,
		marginBottom: 15
	},
	delete: {
		backgroundColor: 'rgba(150,150,150,0.5)',
		borderRadius: 8,
		position: 'absolute',
		right: 9,
		top: 2,
		width: 14,
		height: 14,
		justifyContent: 'center',
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
