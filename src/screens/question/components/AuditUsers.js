/*
 * @flow
 * created by wyk made in 2019-05-05 17:56:52
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, ScrollView } from 'react-native';
import { TouchFeedback, Avatar } from 'components';
import { PxFit, Theme, SCREEN_WIDTH } from 'utils';

class AuditUsers extends Component {
	renderUsers = status => {
		let { question, navigation } = this.props;
		let { accepted_count, declined_count, audits } = question;
		let users;
		if (audits && audits instanceof Array) {
			users = this.filterUser(audits, status);
		} else {
			return null;
		}
		if (users.length < 1) {
			return <Text style={[styles.countText, { marginLeft: 0 }]}>{status ? `0赞成` : `0反对`}</Text>;
		}
		return (
			<View style={[styles.votersUser, status ? styles.votersUserLeft : styles.votersUserRight]}>
				{users.map((elem, index) => {
					if (elem.user) {
						return (
							<TouchFeedback
								key={index}
								style={{ marginRight: -PxFit(6) }}
								onPress={() => navigation.navigate('User', { user: elem.user })}
							>
								<Avatar source={elem.user.avatar} size={PxFit(24)} />
							</TouchFeedback>
						);
					}
				})}
				<Text style={styles.countText}>{status ? `${users.length}赞成` : `${users.length}反对`}</Text>
			</View>
		);
	};

	filterUser(users, status) {
		return users.filter((elem, index) => {
			return elem.status === status;
		});
	}

	acceptedRate = () => {
		let { audits } = this.props.question;
		let count, accepted_count;
		if (audits && audits instanceof Array) {
			count = audits.length;
			accepted_count = this.filterUser(audits, true);
		} else {
			count = 0;
		}
		return count > 0 ? (accepted_count.length / 10) * 100 : 50;
	};

	render() {
		let { isCreator, question } = this.props;
		if (!isCreator || !['0', '1', '-2'].includes(String(question.status))) {
			return null;
		}
		return (
			<View style={{ marginBottom: PxFit(20) }}>
				<View style={styles.processBar}>
					<View style={[styles.processItem, styles.support, { width: this.acceptedRate() + '%' }]}>
						<Image source={require('../../../assets/images/lightning.png')} style={styles.lightningImage} />
					</View>
					<View style={[styles.processItem, styles.oppose, { width: 100 - this.acceptedRate() + '%' }]} />
				</View>
				<View style={styles.voters}>
					{this.renderUsers(true)}
					{this.renderUsers(false)}
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	auditText: {
		fontSize: PxFit(15),
		color: Theme.primaryColor,
		textAlign: 'center',
		marginBottom: PxFit(20)
	},
	processBar: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	processItem: {
		height: PxFit(6)
	},
	support: {
		marginRight: -PxFit(3),
		backgroundColor: '#498DFF',
		borderTopLeftRadius: PxFit(3),
		borderBottomLeftRadius: PxFit(3),
		zIndex: 1
	},
	oppose: {
		marginLeft: PxFit(3),
		backgroundColor: '#F92C5A',
		borderTopRightRadius: PxFit(3),
		borderBottomRightRadius: PxFit(3)
	},
	lightningImage: {
		position: 'absolute',
		top: -PxFit(6),
		right: -PxFit(7),
		width: PxFit(14),
		height: PxFit(18),
		zIndex: 2
	},
	voters: {
		marginTop: PxFit(8),
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between'
	},
	votersUser: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center'
	},
	votersUserLeft: {
		justifyContent: 'flex-start',
		paddingRight: PxFit(9)
	},
	votersUserRight: {
		justifyContent: 'flex-end',
		paddingLeft: PxFit(9)
	},
	countText: {
		fontSize: PxFit(12),
		color: Theme.defaultTextColor,
		marginLeft: PxFit(8)
	}
});

export default AuditUsers;
