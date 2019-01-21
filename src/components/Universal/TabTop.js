import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image, Dimensions } from 'react-native';
import Colors from '../../constants/Colors';
import { Iconfont } from '../utils/Fonts';

import NoTicketTipsModal from '../Modal/NoTicketTipsModal';

import { BoxShadow } from 'react-native-shadow';

import { connect } from 'react-redux';
import actions from '../../store/actions';

import { UserQuery } from '../../graphql/user.graphql';
import { Query } from 'react-apollo';

const { width, height } = Dimensions.get('window');

const shadowOpt = {
	width: width,
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
		const { isShow, isAnswer, userInfo, login } = this.props;
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
										height: 44
									})}
								>
									<View style={styles.container}>
										<View style={styles.rowItem}>
											<Iconfont name={'like'} size={24} color={Colors.theme} />
											<Text style={styles.text}> 精力点</Text>
											<Text
												style={{
													fontSize: 15,
													paddingLeft: 5,
													color: user.ticket > 10 ? Colors.black : Colors.themeRed
												}}
											>
												{user.ticket ? user.ticket : '0'}
											</Text>
											<Text style={styles.text}>
												/{user.level ? user.level.ticket_max : '180'}
											</Text>
										</View>
										<View style={styles.rowItem}>
											<Iconfont name={'zhuanshi'} size={22} color={Colors.theme} />
											<Text style={[styles.text, { paddingRight: 5 }]}>智慧点</Text>
											<Text style={styles.text}>{user.gold}</Text>
										</View>
										{isAnswer && !(isShow || user.ticket > 0) ? (
											<NoTicketTipsModal
												visible={show}
												handleVisible={this.handleCorrectModal.bind(this)}
											/>
										) : null}
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
		height: 44,
		backgroundColor: Colors.white,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		shadowOffset: { width: 0, height: 2 },
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
		fontSize: 15,
		color: Colors.black
	}
});

export default connect(store => {
	return { users: store.users, login: store.users.login };
})(TabTop);
