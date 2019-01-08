import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, FlatList, Image } from 'react-native';
import { Header } from '../../components/Header';
import { Button } from '../../components/Control';
import { DivisionLine, ErrorBoundary, ContentEnd } from '../../components/Universal';
import { Colors, Config, Divice } from '../../constants';
import { Iconfont } from '../../utils/Fonts';

import { connect } from 'react-redux';

import Screen from '../Screen';

class TestScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	onSkipBtnHandle = index => {
		Alert.alert('Skip');
		console.log(index);
	};
	doneBtnHandle = () => {
		Alert.alert('Done');
	};
	nextBtnHandle = index => {
		Alert.alert('Next');
		console.log(index);
	};
	onSlideChangeHandle = (index, total) => {
		console.log(index, total);
	};

	render() {
		const pageArray = [
			{
				title: 'Page 1',
				description: 'Description 1',
				img: require('../../assets/images/logo.png'),
				imgStyle: {
					height: 80 * 2.5,
					width: 109 * 2.5
				},
				backgroundColor: '#fa931d',
				fontColor: '#fff',
				level: 10
			},
			{
				title: 'Page 2',
				description: 'Description 2',
				img: require('../../assets/images/logo.png'),
				imgStyle: {
					height: 93 * 2.5,
					width: 103 * 2.5
				},
				backgroundColor: '#a4b602',
				fontColor: '#fff',
				level: 10
			}
		];
		return (
			<AppIntro
				onNextBtnClick={this.nextBtnHandle}
				onDoneBtnClick={this.doneBtnHandle}
				onSkipBtnClick={this.onSkipBtnHandle}
				onSlideChange={this.onSlideChangeHandle}
				pageArray={pageArray}
			/>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.lightGray
	}
});

export default TestScreen;
