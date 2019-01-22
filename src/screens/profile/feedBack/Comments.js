import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, FlatList, Image } from 'react-native';

import { Colors } from '../../../constants';
import { Methods } from '../../../helpers';

import { Avatar, Iconfont, Screen, DivisionLine } from '../../../components';

class Comments extends Component {
	constructor(props) {
		super(props);
		this.state = {
			comments: [
				{
					id: 1,
					user: {
						id: 8,
						name: 'Xuan',
						avatar: 'http://cos.qunyige.com/storage/avatar/13.jpg'
					},
					time_ago: '3小时前',
					body: '目前提现用户过多，请耐心等待哦',
					praise: 15,
					step: 12
				},
				{
					id: 2,
					user: {
						id: 1,
						name: '风清扬',
						avatar: 'http://cos.qunyige.com/storage/avatar/12.jpg'
					},
					time_ago: '15小时前',
					body: '目前提现用户过多，请耐心等待哦',
					praise: 15,
					step: 12
				}
			]
		};
	}

	_commentItem = ({ item, index }) => {
		return (
			<View
				style={{
					paddingHorizontal: 15,
					paddingVertical: 15,
					borderBottomColor: Colors.lightBorder,
					borderBottomWidth: 1
				}}
			>
				<View
					style={{
						flexDirection: 'row',
						alignItems: 'center',
						justifyContent: 'space-between'
					}}
				>
					<View
						style={{
							flexDirection: 'row',
							alignItems: 'center'
						}}
					>
						<Avatar uri={'http://cos.qunyige.com/storage/avatar/13.jpg'} size={28} />
						<View style={{ paddingLeft: 10, justifyContent: 'center' }}>
							<Text style={{ color: Colors.black, fontSize: 12 }}>{item.user.name}</Text>
							<Text style={{ fontSize: 10, color: Colors.grey, lineHeight: 16 }}>
								评论于{item.time_ago}
							</Text>
						</View>
					</View>
					<TouchableOpacity>
						<Iconfont name={'more-horizontal'} size={14} />
					</TouchableOpacity>
				</View>

				<View style={{ marginTop: 10 }}>
					<Text style={{ color: Colors.black }}>{item.body}</Text>
				</View>
				<View
					style={{
						flexDirection: 'row',
						alignItems: 'center',
						paddingTop: 15
					}}
				>
					<View
						style={{
							flexDirection: 'row',
							alignItems: 'center',
							borderWidth: 1,
							borderColor: Colors.lightBorder,
							paddingHorizontal: 7,
							paddingVertical: 3,
							borderRadius: 3
						}}
					>
						<Iconfont name={'praise2'} color={Colors.theme} size={14} style={{ paddingRight: 5 }} />
						<Text style={{ color: Colors.theme }}>{item.praise}</Text>
					</View>
					<View
						style={{
							flexDirection: 'row',
							alignItems: 'center',
							borderWidth: 1,
							borderColor: Colors.lightBorder,
							paddingHorizontal: 7,
							paddingVertical: 3,
							borderRadius: 3,
							marginLeft: 8
						}}
					>
						<Iconfont name={'step2'} color={Colors.black} size={14} style={{ paddingRight: 5 }} />
						<Text>{item.step}</Text>
					</View>
				</View>
			</View>
		);
	};

	render() {
		const { navigation } = this.props;
		return (
			<FlatList
				data={this.state.comments}
				keyExtractor={(item, index) => index.toString()}
				renderItem={this._commentItem}
				ListHeaderComponent={() => (
					<View
						style={{
							paddingHorizontal: 15,
							paddingVertical: 10,
							borderBottomWidth: 1,
							borderBottomColor: Colors.lightBorder
						}}
					>
						<Text style={{ fontSize: 15, color: Colors.black }}>评论</Text>
					</View>
				)}
			/>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.white
	}
});

export default Comments;
