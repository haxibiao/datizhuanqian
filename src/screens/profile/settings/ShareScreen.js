import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image } from 'react-native';
import { Screen } from '../../../components';

import { Colors, Config, Divice } from '../../../constants';

class ShareScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			counts: props.user
		};
	}
	render() {
		const { counts } = this.state;
		return (
			<Screen>
				<View style={styles.container}>
					<Image
						source={{ uri: 'https://datizhuanqian.com/picture/qrcode.png' }}
						style={{ width: Divice.width / 3, height: Divice.width / 3 }}
					/>
					<Text style={{ color: Colors.black, fontSize: 15, marginTop: 10 }}>扫描下载答题赚钱APP</Text>
				</View>
			</Screen>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.white,
		justifyContent: 'center',
		alignItems: 'center'
	}
});

export default ShareScreen;
