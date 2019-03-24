/*
 * @Author: Gaoxuan
 * @Date:   2019-03-21 13:24:19
 */

import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Text, Image } from 'react-native';
import { PageContainer } from '../../components';
import { Theme, PxFit, SCREEN_WIDTH } from '../../utils';

class ContributeRule extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<PageContainer title="出题规则">
				<ScrollView style={styles.container}>
					<Text style={{ fontSize: PxFit(15), color: Theme.black, lineHeight: PxFit(22) }}>
						为了能够给广大用户提供一个优质的答题环境，您的言行不得发布、传播或以其它方式传送含有下列内容之一的信息：
					</Text>
					<Text style={{ color: Theme.grey, lineHeight: PxFit(22), paddingTop: PxFit(15) }}>
						{'1.反对宪法或法律法规规定的基本原则的；\n'}
						{'2.危害国家安全，泄露国家秘密，颠覆国家政权，破坏国家统一的；\n'}
						{'3.损害国家荣誉和利益的；'}
						{'\n4.煽动民族仇恨、民族歧视、破坏民族团结的；\n'}
						{'5.破坏国家宗教政策，宣扬邪教和封建迷信的；\n'}
						{'6.散布谣言，扰乱社会秩序，破坏社会稳定的；\n'}
						{'7.散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的；\n'}
						{'8.侮辱或者诽谤他人，侵害他人合法权利的；\n'}
						{'9.煽动非法集会、结社、游行、示威、聚众扰乱社会秩序的；'}
						{
							'\n10.含有虚假、有害、胁迫、侵害他人隐私、骚扰、侵害、中伤、粗俗、猥亵、或其它道德上令人反感的内容；'
						}
						{'\n11.侵犯他人知识产权或其他合法权益的；\n'}
						{'12.含有中国法律、法规、规章、条例以及任何具有法律效力之规范所限制或禁止的其它内容的；\n'}
						{'13.非官方认证的发布带有任何有联系方式的整容、医药、代考等广告信息以及非真实性中奖信息；\n'}
					</Text>
					<Text style={{ color: Theme.black, lineHeight: PxFit(22), paddingTop: PxFit(15) }}>
						答题赚钱官方拥有对违反以上出题规则的用户进行处理的权力，一经发现此类题目内容将不被采纳。
					</Text>
				</ScrollView>
			</PageContainer>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		marginTop: PxFit(15),
		paddingHorizontal: PxFit(15)
	}
});

export default ContributeRule;
