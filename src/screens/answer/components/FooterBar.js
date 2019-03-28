/*
 * @flow
 * created by wyk made in 2019-03-28 14:38:24
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Text, Image, ImageBackground } from 'react-native';
import { Player, TouchFeedback, Iconfont, Button } from '../../../components';
import { Theme, SCREEN_WIDTH, PxFit } from '../../../utils';

import { Mutation, compose, graphql } from 'react-apollo';
import { toggleFavoriteMutation } from '../../../assets/graphql/question.graphql';

class FooterBar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			favorited: false
		};
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.question !== this.props.question) {
			this.setState({ favorited: nextProps.question.favorite_status });
		}
	}

	toggleFavorite = async () => {
		let { question, toggleFavorite } = this.props;
		this.setState(prevState => ({ favorited: !prevState.favorited }));
		toggleFavorite({ variables: { data: { favorable_id: this.props.question.id } } });
	};

	render() {
		let { navigation, question, submited, answer, onComment, oSubmit } = this.props;
		let { favorited } = this.state;
		let buttonStyle = {
			backgroundColor: submited ? Theme.teaGreen : Theme.correctColor,
			opacity: answer ? 1 : 0.6
		};
		return (
			<View style={styles.container}>
				<View style={styles.footerBar}>
					<View style={styles.tools}>
						<TouchFeedback style={styles.toolItem} onPress={this.toggleFavorite}>
							<View style={styles.iconWrap}>
								<Iconfont
									name={favorited ? 'collection-fill' : 'collection'}
									size={PxFit(21)}
									color={favorited ? Theme.primaryColor : Theme.defaultTextColor}
								/>
							</View>
							<Text style={styles.itemName}>{favorited ? '已收藏' : '收藏'}</Text>
						</TouchFeedback>
						<TouchFeedback style={styles.toolItem} onPress={onComment}>
							<View style={styles.iconWrap}>
								<Iconfont name="message" size={PxFit(18)} color={Theme.defaultTextColor} />
							</View>
							<Text style={styles.itemName}>评论</Text>
						</TouchFeedback>
						<TouchFeedback
							style={styles.toolItem}
							onPress={() => navigation.navigate('Reward', { question })}
						>
							<View style={styles.iconWrap}>
								<Iconfont name="tixian" size={PxFit(18)} color={Theme.defaultTextColor} />
							</View>
							<Text style={styles.itemName}>打赏</Text>
						</TouchFeedback>
					</View>
					<TouchFeedback style={[styles.button, buttonStyle]} onPress={oSubmit} disabled={!answer}>
						<Text style={styles.buttpnText}>{submited ? '下一题' : '提交答案'}</Text>
					</TouchFeedback>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		paddingBottom: Theme.HOME_INDICATOR_HEIGHT,
		backgroundColor: '#fff'
	},
	footerBar: {
		flexDirection: 'row',
		alignItems: 'stretch',
		height: PxFit(48)
	},
	tools: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'stretch',
		borderTopWidth: PxFit(1),
		borderColor: Theme.borderColor
	},
	toolItem: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	iconWrap: {
		height: PxFit(30),
		justifyContent: 'center',
		alignItems: 'center'
	},
	itemName: {
		fontSize: PxFit(12),
		color: Theme.defaultTextColor
	},
	button: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	buttpnText: {
		fontSize: PxFit(14),
		color: '#fff',
		fontWeight: '500',
		letterSpacing: PxFit(4)
	}
});

export default compose(graphql(toggleFavoriteMutation, { name: 'toggleFavorite' }))(FooterBar);
