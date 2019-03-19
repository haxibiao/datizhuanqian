/*
 * @flow
 * created by wyk made in 2019-03-19 11:22:26
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import {
	PageContainer,
	TouchFeedback,
	Iconfont,
	Row,
	ListItem,
	CustomSwitch,
	ItemSeparator,
	PopOverlay
} from '../../components';

class index extends Component {
	render() {
		return (
			<PageContainer title="答题">
				<ScrollView contentContainerStyle={styles.container} />
			</PageContainer>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flexGrow: 1,
		backgroundColor: '#fff'
	}
});

export default index;
