/*
 * @flow
 * @Author: Gaoxuan
 * @Date:   2019-03-20 17:23:35
 */

import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Text, Image, ImageBackground } from 'react-native';
import { Player, TouchFeedback, Iconfont } from '../../../components';
import { Theme, SCREEN_WIDTH } from '../../../utils';

import { Mutation } from 'react-apollo';
import { toggleFavoriteMutation } from '../../../assets/graphql/question.graphql';

class FavoriteQuestion extends Component {
	constructor(props) {
		super(props);

		this.state = {
			favorite: false
		};
	}

	favoriteQuestion = toggleFavorite => {
		this.setState({ favorite: !this.state.favorite });
		toggleFavorite({ variables: { data: { favorable_id: this.props.getQuestionId() } } });
	};

	onFavoriteCompleted = () => {
		Toast.show({ content: this.state.favorite ? '收藏成功' : '取消收藏' });
	};

	onFavoriteError = err => {
		this.setState({ favorite: !this.state.favorite });
		let str = err.toString().replace(/Error: GraphQL error: /, '');
		Toast.show({ content: str });
	};

	resetFavorite = () => {
		this.setState({ favorite: false });
	};

	render() {
		let { onCompleted, onError } = this.props;
		return (
			<Mutation
				mutation={toggleFavoriteMutation}
				onCompleted={this.onFavoriteCompleted}
				onError={this.onFavoriteError}
			>
				{toggleFavorite => {
					return (
						<TouchFeedback onPress={() => this.favoriteQuestion(toggleFavorite)}>
							<Iconfont
								name={this.state.favorite ? 'collection-fill' : 'collection'}
								color="#262626"
								size={22}
							/>
						</TouchFeedback>
					);
				}}
			</Mutation>
		);
	}
}

export default FavoriteQuestion;
