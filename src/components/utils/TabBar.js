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
		return (
			<View>
				{login ? (
					<Query query={UserQuery} variables={{ id: id }}>
						{({ data, loading, error, refetch }) => {
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
											<View
												style={{
													width: PxFit(28),
													height: PxFit(28),
													justifyContent: 'center',
													alignItems: 'center'
												}}
											>
												<Image
													source={require('../../assets/images/heart.png')}
													style={styles.iconImage}
												/>
											</View>
											<Text style={styles.text}>精力点 </Text>
											<Text
												style={{
													fontSize: PxFit(15),
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
											<View
												style={{
													width: PxFit(28),
													height: PxFit(28),
													justifyContent: 'center',
													alignItems: 'center'
												}}
											>
												<Image
													source={require('../../assets/images/diamond.png')}
													style={{
														width: PxFit(23),
														height: PxFit(25),
														marginBottom: PxFit(2)
													}}
												/>
											</View>
											<Text style={styles.text}>智慧点 </Text>
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
	iconImage: {
		width: PxFit(24),
		height: PxFit(24)
	},
	text: {
		fontSize: PxFit(15),
		color: Theme.defaultTextColor
	}
});

export default connect(store => {
	return { users: store.users, login: store.users.login };
})(TabTop);
