import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image, Dimensions } from 'react-native';

import { Colors } from '../../constants';

import Screen from '../Screen';

const { width, height } = Dimensions.get('window');

class SetQuestionScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		const {} = this.props;
		return <Screen />;
	}
}

const styles = StyleSheet.create({});

export default SetQuestionScreen;
