/*
 * @Author: Gaoxuan
 * @Date:   2019-04-17 15:13:03
 */

import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Text, Image } from 'react-native';
import { PageContainer } from '../../components';
import { Config, Theme, PxFit, SCREEN_WIDTH } from '../../utils';

class AuditRule extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		return (
			<PageContainer white title="审核指南">
				<ScrollView style={{ paddingHorizontal: PxFit(15), paddingTop: PxFit(20), flex: 1 }}>
					<Text
						style={{
							fontSize: PxFit(16),
							color: Theme.defaultTextColor,
							fontWeight: '500',
							lineHeight: PxFit(22),
							paddingVertical: PxFit(15)
						}}
					>
						致各位审题的答友：
					</Text>
					<Text style={{ color: Theme.defaultTextColor, fontSize: PxFit(15), lineHeight: PxFit(20) }}>
						{`审题是为了从海量的题目中挑选真正有内涵有价值的内容呈现给大家答题学习！\n每个审核答友都责任重大，请大家务必认真审题。\n${
							Config.AppName
						}是大家学习成长的家园，希望大家一起努力维护让它变得更好。\n`}
					</Text>
					<Text style={{ color: Theme.defaultTextColor, fontSize: PxFit(15), lineHeight: PxFit(20) }}>
						注:有价值的审题与评论将有机会获得贡献值与提高信用，无价值出题和恶意审题的用户将会降低个人行为信用，请各位答友珍惜手中权益。。
					</Text>
					<Text style={{ color: Theme.defaultTextColor, fontSize: PxFit(15), lineHeight: PxFit(20) }}>
						最终审判标准归{Config.AppName}官方所有。
					</Text>
					<Text
						style={{
							fontSize: PxFit(16),
							color: Theme.defaultTextColor,
							fontWeight: '500',
							lineHeight: PxFit(22),
							paddingVertical: PxFit(15)
						}}
					>
						审题示范
					</Text>
					<Image
						source={require('../../assets/images/audit_rule.jpg')}
						style={{
							width: SCREEN_WIDTH - 30,
							height: ((SCREEN_WIDTH - 30) * 964) / 933,
							marginBottom: 40
						}}
					/>
					<Text
						style={{
							fontSize: PxFit(16),
							color: Theme.defaultTextColor,
							fontWeight: '500',
							lineHeight: PxFit(22),
							paddingVertical: PxFit(15)
						}}
					>
						审题概率
					</Text>
					<Text style={{ color: Theme.defaultTextColor, fontSize: PxFit(15), lineHeight: PxFit(20) }}>
						用户能审题并且有题要审核时， 50%机会被推荐一波审题（最多10个），不会审的题可以下一题暂时跳过
					</Text>
					<Text
						style={{
							fontSize: PxFit(16),
							color: Theme.defaultTextColor,
							fontWeight: '500',
							lineHeight: PxFit(22),
							paddingVertical: PxFit(15)
						}}
					/>
				</ScrollView>
			</PageContainer>
		);
	}
}

const styles = StyleSheet.create({});

export default AuditRule;
