/*
 * @flow
 * created by wyk made in 2018-12-12 12:01:36
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { withNavigation } from 'react-navigation';
import { PxFit, Theme } from '../../utils';
import Iconfont from '../Iconfont';

import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import { FollowToggbleMutation, UserQuery, FollowsQuery, UserInfoQuery } from '../../assets/graphql/user.graphql';

type Props = {
	id: number,
	followedStatus: boolean | number,
	style?: any,
	titleStyle?: any,
	activeColor?: any,
	tintColor?: any,
	...TouchableWithoutFeedback.propTypes
};

class FollowButton extends Component<Props> {
	static defaultProps = {
		activeOpacity: 0.6,
		activeColor: Theme.subTextColor,
		tintColor: '#fff'
	};

	constructor(props: Props) {
		super(props);
		this.follow();
		this.onFollowHandler();
		this.state = {
			followed: props.followedStatus ? true : false
		};
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.login !== nextProps.login) {
		}
	}

	buildProps() {
		let { followed } = this.state;
		let { style, titleStyle, activeColor, tintColor, ...others } = this.props;
		let title, backgroundColor, textColor, children;
		if (followed) {
			title = '已关注';
			textColor = activeColor;
			backgroundColor = Theme.groundColour;
		} else {
			title = '关注';
			textColor = tintColor;
			backgroundColor = Theme.primaryColor;
		}

		style = {
			backgroundColor,
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'center',
			...style
		};

		titleStyle = {
			fontSize: PxFit(13),
			color: textColor,
			overflow: 'hidden',
			...titleStyle
		};

		children = (
			<Text style={titleStyle} numberOfLines={1}>
				{title}
			</Text>
		);

		return { children, style, ...others };
	}

	render() {
		if (this.props.user.id === this.props.id) {
			return null;
		}
		let { children, style, ...others } = this.buildProps();
		return (
			<TouchableOpacity {...others} style={style} onPress={this.onFollowHandler}>
				{children}
			</TouchableOpacity>
		);
	}

	onFollowHandler = () => {
		if (!this.props.login) {
			this.onFollowHandler = () => {
				this.props.navigation.navigate('Login');
			};
		} else {
			this.onFollowHandler = () => {
				if (this.state.followed) {
					this.setState({ followed: false }, () => {
						this.follow(true);
					});
				} else {
					this.setState({ followed: true }, () => {
						this.follow(false);
					});
				}
			};
		}
	};

	follow = followed => {
		let { id, user, followUser } = this.props;
		followUser({
			variables: {
				followed_type: 'users',
				followed_id: id
			},
			refetchQueries: () => [
				{
					query: UserQuery,
					variables: { id: user.id }
				},
				{
					query: FollowsQuery,
					variables: { filter: 'users' }
				},
				{
					query: UserInfoQuery,
					variables: { id: user.id }
				}
			]
		});
	};
}

const styles = StyleSheet.create({});

export default compose(
	withNavigation,
	graphql(FollowToggbleMutation, { name: 'followUser' }),
	connect(store => ({ login: store.users.login, user: store.users.user }))
)(FollowButton);
