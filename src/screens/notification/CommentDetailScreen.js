import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, FlatList, RefreshControl } from 'react-native';
import {
	Header,
	BlankContent,
	Loading,
	LoadingError,
	LoadingMore,
	ContentEnd,
	Iconfont,
	Screen,
	Avatar
} from '../../components';
import { Colors, Config, Divice } from '../../constants';
import { Methods } from '../../helpers';

import { Query } from 'react-apollo';
import { notificationsQuery } from '../../graphql/notification.graphql';

class CommentNotificationScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		const { navigation } = this.props;
		return <Screen />;
	}
}

const styles = StyleSheet.create({});

export default CommentNotificationScreen;
