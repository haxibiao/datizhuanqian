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
			this.setState({
				pictures
			});
		});
	};

	render() {
		let { content, contact, pictures } = this.state;
		const { navigation } = this.props;

		return (
			<Screen>
				<View style={styles.container}>
					<DivisionLine height={5} />
					<View style={styles.main}>
						<Input
							customStyle={styles.input}
							maxLength={400}
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
								<Iconfont name={'add'} size={26} color={Colors.tintGray} />
							</TouchableOpacity>
						</View>
						<View style={styles.mainBottom} />
					</View>

					<Button
						name={'提交'}
						style={{ height: 42, marginHorizontal: 20, marginBottom: 20 }}
						theme={content ? Colors.blue : Colors.tintGray}
						textColor={content ? Colors.white : Colors.grey}
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
		width: (Divice.width - 75) / 4,
		height: (Divice.width - 75) / 4,
		borderColor: Colors.tintGray,
		borderWidth: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	image: {
		width: (Divice.width - 75) / 4,
		height: (Divice.width - 75) / 4,
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

export default SubmitTaskScreen;
