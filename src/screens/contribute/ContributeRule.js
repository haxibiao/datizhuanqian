/*
 * @Author: Gaoxuan
 * @Date:   2019-03-20 14:41:10
 */

import React, { Component } from 'react';
import { StyleSheet, View, Text, ScrollView, Image } from 'react-native';
import { Button, TouchFeedback, Iconfont, PageContainer } from 'components';
import { Config, Theme, PxFit, SCREEN_WIDTH } from 'utils';
import { Overlay } from 'teaset';

let IMAGE_WIDTH = SCREEN_WIDTH - PxFit(15);

class ContributeRule extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<PageContainer title="出题规则" white>
				<View style={styles.container}>
					<ScrollView showsVerticalScrollIndicator={false}>
						<View>
							<View>
								<Text style={styles.boldText}>
									{'    '}
									为了能够给广大用户提供一个优质的知识分享平台及良好的答题环境，每个分类需要答对一定数量的题目才能拥有出题资格，
									同时请各位答友出题尽量做到
									<Text style={{ color: Theme.themeRed }}>
										格式规范、分类准确、描述清晰、解答详细
									</Text>
									。 内容请注重原创性、具备知识分享的意义。
								</Text>

								<Text style={styles.boldText}>{'    '}您的题目不得含有下列内容的信息：</Text>
							</View>
							<View style={{ marginTop: PxFit(15) }}>
								<Text style={styles.title}>
									{'    '}1.题目无实际意义/无教学意义/过于小众/题干或答案错误。
								</Text>
								<Text style={styles.text}>
									{'①1+1=？XX是男是女？可以吃饭吗？此类题目缺乏教学意义。\n'}
									{'②世界上有UFO吗？世界上有鬼吗？此类题属未经证实的谣言、存疑的知识点。\n'}
									{'③他喜欢我吗？XX明星帅不帅？此类题目无法客观判断、带有主观性质。'}
								</Text>
								<Image
									source={require('../../assets/images/contribute1.png')}
									style={{
										width: IMAGE_WIDTH,
										height: IMAGE_WIDTH / 1.8
									}}
								/>
							</View>
							<View style={{ marginTop: PxFit(15) }}>
								<Text style={styles.title}>
									{'    '}
									2.题目排版混乱、题干包含答案、分类错误、将题目图片或其他应用的题目截图做为题干。
								</Text>
								<Text style={styles.text}>
									注：输入答案时不需要额外添加ABCD或1234之类的序号（系统会自动生成ABCD序号）！
								</Text>
								<Image
									source={require('../../assets/images/contribute2.png')}
									style={{
										width: IMAGE_WIDTH,
										height: IMAGE_WIDTH / 1.8
									}}
								/>
							</View>
							<View style={{ marginTop: PxFit(15) }}>
								<Text style={styles.title}>
									{'    '}3.题干图片模糊、带有答案、图文不符、含有二维码。
								</Text>
							</View>
							<View style={{ marginTop: PxFit(15) }}>
								<Text style={styles.title}>{'    '}4.题库内已存在完全相同或相似度极高的重复题目。</Text>
							</View>
							<View style={{ marginTop: PxFit(15) }}>
								<Text style={styles.title}>
									{'    '}
									5.发布广告、不良政治导向、色情低俗内容（含性暗示等内容）和其他国家法律法规禁止的内容.
								</Text>
							</View>
							<View style={{ marginTop: PxFit(15) }}>
								<Text style={styles.title}>
									{'    '}
									官方拥有对违反以上出题规则的用户进行处理的权利，一经发现此类题目将予以下架，对于恶意违反，大量输出此类题目的用户，官方将进行限制行为、封号处理。
								</Text>
							</View>
						</View>
					</ScrollView>
				</View>
			</PageContainer>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		padding: PxFit(15),
		paddingBottom: Theme.HOME_INDICATOR_HEIGHT || PxFit(15)
	},
	boldText: { lineHeight: PxFit(21), fontSize: PxFit(17), color: '#201e33' },
	title: {
		lineHeight: PxFit(20),
		fontSize: PxFit(16),
		color: Theme.defaultTextColor
	},
	text: {
		marginTop: PxFit(5),
		lineHeight: PxFit(20),
		fontSize: PxFit(15),
		color: Theme.secondaryTextColor
	}
});

export default ContributeRule;
