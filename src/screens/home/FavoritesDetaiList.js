/*
 * @Author: Gaoxuan
 * @Date:   2019-03-14 13:21:28
 */
'use strict';
import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Image, Text, TouchableOpacity, FlatList } from 'react-native';
import {
	DivisionLine,
	Header,
	Screen,
	Iconfont,
	OptionItem,
	Player,
	LoadingError,
	Loading,
	BlankContent,
	LoadingMore,
	ContentEnd
} from '../../components';
import { Colors, Config, Divice } from '../../constants';
import { Methods } from '../../helpers';

import { FavoritesQuery } from '../../graphql/user.graphql';
import { compose, Query, Mutation, graphql } from 'react-apollo';

class FavoritesDetaiList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activeIndex: 0
		};
	}

	render() {
		let { navigation } = this.props;

		let index = navigation.getParam('index');

		let page = Math.floor(index / 10);
		let mark = index % 10;
		// console.log(' Math.floor', mark, Math.ceil(mark / 10));

		console.log('mark', mark, page);

		return (
			<Screen header>
				<Header
					customStyle={{
						backgroundColor: Colors.theme,
						borderBottomWidth: 0,
						borderBottomColor: 'transparent'
					}}
					routeName={'题目详情'}
				/>
				<Query query={FavoritesQuery} fetchPolicy="network-only" variables={{ offset: page * 10 }}>
					{({ data, loading, error, refetch, fetchMore }) => {
						console.log('data', data);
						if (error) return <LoadingError reload={() => refetch()} />;
						if (loading) return <Loading />;
						if (!(data && data.favorites && data.favorites.length > 0)) {
							return <BlankContent />;
						}
						return (
							<FlatList
								ref={ref => (this.scrollRef = ref)}
								style={[styles.questionWrap, { height: Divice.height, width: Divice.width }]}
								initialScrollIndex={mark}
								horizontal={true}
								bounces={false}
								showsHorizontalScrollIndicator={false}
								keyboardShouldPersistTaps="always"
								pagingEnabled
								removeClippedSubviews
								data={data.favorites}
								keyExtractor={(item, index) => index.toString()}
								renderItem={this._questionItem}
								getItemLayout={(data, index) => ({
									length: Divice.width,
									offset: Divice.width * index,
									index
								})}
								onMomentumScrollEnd={e => this.onMomentumScrollEnd(e, data.favorites, fetchMore, page)}
							/>
						);
					}}
				</Query>
			</Screen>
		);
	}

	_questionItem = ({ item, index }) => {
		const { question } = item;
		let { description, image, selections, category, answer, video } = question;

		selections = selections.replace(/\\/g, '');
		let options = [];
		try {
			options = JSON.parse(selections);
			if (options.Selection) {
				options = options.Selection;
			} else if (options.Section) {
				options = options.Section;
			}
		} catch (error) {
			Methods.toast('数据出错');
			navigation.goBack();
			return <View />;
		}
		return (
			<ScrollView
				style={styles.container}
				contentContainerStyle={{ flexGrow: 1, paddingBottom: Divice.bottom_height }}
			>
				<View>
					<View style={{ justifyContent: 'center', paddingHorizontal: 20 }}>
						<View style={{ marginVertical: 20 }}>
							<Text style={styles.description}>
								<Text style={styles.subject}>{'题目:  '}</Text>
								{description}
							</Text>
						</View>
						{image && (
							<Image
								source={{
									uri: image.path
								}}
								style={{
									width: Divice.width - 40,
									height: (image.height / image.width) * (Divice.width - 40),
									borderRadius: 5
								}}
							/>
						)}
						{video && <Player source={video.path} paused={true} />}
					</View>
					<View style={styles.options}>
						{options.map((option, index) => {
							return (
								<OptionItem
									key={index}
									style={{ paddingVertical: 12 }}
									option={option}
									isAnswer={answer && answer.includes(option.Value)}
								/>
							);
						})}
					</View>
				</View>
			</ScrollView>
		);
	};

	onMomentumScrollEnd = (event, questions, fetchMore, page) => {
		let activeIndex = Math.floor(event.nativeEvent.contentOffset.x / Divice.width);
		this.setState({ activeIndex: activeIndex });

		let offset = questions.length - 1;

		if (offset == activeIndex + 2) {
			this.onLoadMore(fetchMore, questions, page);
		}
	};

	onLoadMore = (fetchMore, questions, page) => {
		const { navigation } = this.props;
		if (this.state.fetchingMore) {
			fetchMore({
				variables: {
					offset: questions.length + page * 10
				},
				updateQuery: (prev, { fetchMoreResult }) => {
					if (!(fetchMoreResult && fetchMoreResult.favorites && fetchMoreResult.favorites.length > 0)) {
						this.setState({
							fetchingMore: false
						});
						return prev;
					}
					return Object.assign({}, prev, {
						favorites: [...prev.favorites, ...fetchMoreResult.favorites]
					});
				}
			});
		}
	};
}

const styles = StyleSheet.create({
	questionWrap: {
		// position: 'absolute',
		// top: 0,
		// left: 0,
		// right: 0,
		// bottom: 0,
		// transform: [{ rotateZ: '90deg' }],
		// borderWidth: 5,
		// borderColor: '#000',
		backgroundColor: '#fff',
		padding: 0
	},
	container: {
		height: Divice.height,
		width: Divice.width
	},
	subject: {
		color: Colors.skyBlue,
		fontSize: 16,
		lineHeight: 22,
		fontWeight: '500'
	},
	description: {
		color: Colors.primaryFont,
		fontSize: 16,
		lineHeight: 22
	},
	options: {
		paddingTop: 30,
		paddingHorizontal: 20
	}
});

export default FavoritesDetaiList;
