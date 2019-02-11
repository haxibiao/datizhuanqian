import React, { Component } from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import Colors from '../../constants/Colors';

class UserTitle extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		let { navigation, user } = this.props;
		return (
			<View>
				{user.is_admin ? (
					<Image
						source={require('../../../assets/images/admin.png')}
						style={{ height: 13, width: 13, marginLeft: 5 }}
					/>
				) : (
					<View
						style={{
							backgroundColor: Colors.theme,
							paddingHorizontal: 2,
							marginLeft: 5,
							marginTop: 1,
							borderRadius: 1
						}}
					>
						<Text style={{ fontSize: 8, color: Colors.white }}>Lv.{user.level.level}</Text>
					</View>
				)}
			</View>
		);
	}
}

const styles = StyleSheet.create({});

export default UserTitle;
