/*
 * @Author: Gaoxuan
 * @Date:   2019-03-21 11:41:39
 */

import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image, Dimensions } from 'react-native';
import { Theme, SCREEN_WIDTH, PxFit } from '../../utils';

import Iconfont from '../Iconfont';
// import NoTicketTipsModal from '../Modal/NoTicketTipsModal';

import { BoxShadow } from 'react-native-shadow';

import { connect } from 'react-redux';
import actions from '../../store/actions';

import { UserQuery } from '../../assets/graphql/user.graphql';
import { Query } from 'react-apollo';

const shadowOpt = {
	width: SCREEN_WIDTH,
	color: '#E8E8E8',
	border: 3,
	radius: 10,
	opacity: 0.5,
	x: 0,
	y: 1,
	style: {
		marginTop: 0
	}
};

class TabTop extends Component {
	constructor(props) {
		super(props);
		let { noTicketTips } = this.props.users;
		this.state = {
			show: noTicketTips
		};
	}
	render() {
		const { isShow, isAnswer, login } = this.props;
		const { show } = this.state;
		const { id } = this.props.users.user;
		console.log('login', login);
		return (
			<View>
				{login ? (
					<Query query={UserQuery} variables={{ id: id }}>
						{({ data, loading, error, refetch }) => {
							console.log('data', data);
							if (error) return null;
							if (!(data && data.user)) return null;
							let user = data.user;
							return (
								<BoxShadow
									setting={Object.assign({}, shadowOpt, {
										height: PxFit(44)
									})}
								>
									<View style={styles.container}>
										<View style={styles.rowItem}>
											<Iconfont name={'like'} size={24} color={Theme.theme} />
											<Text style={styles.text}> 精力点</Text>
											<Text
												style={{
													fontSize: PxFit(15),
													paddingLeft: PxFit(5),
													color: user.ticket > 10 ? Theme.black : Theme.themeRed
												}}
											>
												{user.ticket ? user.ticket : '0'}
											</Text>
											<Text style={styles.text}>
												/{user.level ? user.level.ticket_max : '180'}
											</Text>
										</View>
										<View style={styles.rowItem}>
											<Iconfont name={'zhuanshi'} size={22} color={Theme.theme} />
											<Text style={[styles.text, { paddingRight: PxFit(5) }]}>智慧点</Text>
											<Text style={styles.text}>{user.gold}</Text>
										</View>
									</View>
								</BoxShadow>
							);
						}}
					</Query>
				) : null}
			</View>
			//考虑到精力点是实时更新的  所以不将精力点存到redux中.
		);
	}
	handleCorrectModal() {
		this.setState(prevState => ({
			show: !prevState.show
		}));
		this.props.dispatch(actions.recordOperation(false));
	}
}

const styles = StyleSheet.create({
	container: {
		height: PxFit(44),
		backgroundColor: Theme.white,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		shadowOffset: { width: 0, height: PxFit(2) },
		shadowColor: '#F0F0F0',
		shadowOpacity: 1
	},
	rowItem: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},
	text: {
		fontSize: PxFit(15),
		color: Theme.black
	}
});

export default connect(store => {
	return { users: store.users, login: store.users.login };
})(TabTop);
