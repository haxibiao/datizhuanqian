import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, FlatList, Image } from 'react-native';
import { Button, Header, PropDetailsModal, DivisionLine, ErrorBoundary, ContentEnd } from '../../components';
import { Colors, Config, Divice } from '../../constants';
import { Iconfont } from '../../utils/Fonts';

import PropItem from './PropItem';

import { connect } from 'react-redux';

import Screen from '../Screen';

class HomeScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		let { user, navigation, login, prop } = this.props;
		return (
			<Screen header>
				<Header headerLeft customStyle={{ backgroundColor: Colors.theme, borderBottomWidth: 0 }} />
				<FlatList
					data={prop}
					keyExtractor={(item, index) => index.toString()}
					renderItem={({ item, index }) => {
						return <PropItem item={item} />;
					}}
					ListFooterComponent={() => <ContentEnd />}
				/>
			</Screen>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.white
	}
});

export default connect(store => {
	return { prop: store.users.prop };
})(HomeScreen);
