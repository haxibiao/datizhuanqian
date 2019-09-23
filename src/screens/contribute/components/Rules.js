/*
 * @flow
 * created by wyk made in 2019-07-04 09:36:10
 */
import React, { Component } from 'react';
import { StyleSheet, View, Text, ScrollView, Image } from 'react-native';
import { Row, TouchFeedback, Iconfont } from 'components';
import { Config, Theme, PxFit, SCREEN_WIDTH } from 'utils';
import { Overlay } from 'teaset';
import { app } from 'store';

class Rules extends Component {
    constructor(props) {
        super(props);
        this.state = {
            readed: false,
        };
    }

    render() {
        let { readed } = this.state;
        return (
            <View
                style={{
                    width: SCREEN_WIDTH - PxFit(70),
                    height: ((SCREEN_WIDTH - PxFit(110)) * 16) / 9,
                    paddingHorizontal: PxFit(25),
                    paddingVertical: PxFit(20),
                    borderRadius: PxFit(15),
                    backgroundColor: '#fff',
                }}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <Image
                            source={require('../../../assets/images/tag.png')}
                            style={{ width: PxFit(46), height: PxFit(46) }}
                        />
                        <Text style={{ color: '#A46E38', fontSize: PxFit(18), marginLeft: 10, paddingTop: 5 }}>
                            出题规范
                        </Text>
                    </View>

                    <View style={{ marginTop: PxFit(5) }}>
                        <Text
                            style={{
                                paddingVertical: PxFit(2),
                                lineHeight: PxFit(16),
                                fontSize: PxFit(13),
                                color: '#A46E38',
                            }}>
                            为了能够给广大用户提供一个优质的知识分享平台及良好的答题环境，每个分类需要答对一定数量的题目才能拥有出题资格，
                            同时请各位答友出题尽量做到格式规范、分类准确、描述清晰、解答详细。
                        </Text>
                        <Text
                            style={{
                                paddingVertical: PxFit(2),
                                lineHeight: PxFit(16),
                                fontSize: PxFit(13),
                                color: '#A46E38',
                            }}>
                            内容请注重原创性、具备知识分享的意义。
                        </Text>

                        <Text style={{ fontSize: PxFit(13), color: '#A46E38', paddingVertical: 5 }}>
                            您的题目不得含有下列内容的信息：
                        </Text>
                        <View style={{ alignItems: 'center', marginVertical: 10 }}>
                            <Image
                                source={require('../../../assets/images/drop_down.png')}
                                style={{ width: 30, height: (30 * 101) / 126 }}
                            />
                        </View>
                        <View>
                            <View style={{ flexDirection: 'row', alignItems: 'flex-end', marginBottom: PxFit(5) }}>
                                <Image
                                    source={require('../../../assets/images/1.png')}
                                    style={{ width: PxFit(20), height: PxFit(20) }}
                                />
                                <Text style={styles.title}>题目无实际意义/无教学意义/答案有误。</Text>
                            </View>
                            <Text style={styles.text}>
                                {'例：1+1=？XX是男是女？可以吃饭吗？此类题目缺乏教学意义。\n\n'}
                                {'世界上有UFO吗？世界上有鬼吗？此类题属未经证实的谣言、存疑的知识点。\n\n'}
                                {'他喜欢我吗？XX明星帅不帅？此类题目无法客观判断、带有主观性质。'}
                            </Text>
                        </View>
                        <View style={{ marginTop: PxFit(10) }}>
                            <View style={{ flexDirection: 'row', alignItems: 'flex-end', marginBottom: PxFit(5) }}>
                                <Image
                                    source={require('../../../assets/images/2.png')}
                                    style={{ width: PxFit(20), height: PxFit(20) }}
                                />
                                <Text style={styles.title}>题目排版混乱/题干包含答案/分类错误。</Text>
                            </View>
                            <Text style={styles.text}>
                                注：输入答案时不需要额外添加ABCD或1234之类的序号（系统会自动生成ABCD序号）！
                            </Text>
                            <Image
                                source={require('../../../assets/images/contribute1.png')}
                                style={{
                                    width: SCREEN_WIDTH - PxFit(120),
                                    height: (SCREEN_WIDTH - PxFit(120)) / 1.8,
                                }}
                            />
                        </View>
                        <View style={{ marginTop: PxFit(10) }}>
                            <View style={{ flexDirection: 'row', marginBottom: PxFit(5) }}>
                                <Image
                                    source={require('../../../assets/images/3.png')}
                                    style={{ width: PxFit(20), height: PxFit(20) }}
                                />
                                <View>
                                    <Text style={styles.title}>题干图片模糊/带有答案/图文不符/含</Text>
                                    <Text style={styles.title}>有二维码.</Text>
                                </View>
                            </View>
                            <Image
                                source={require('../../../assets/images/contribute2.png')}
                                style={{
                                    width: SCREEN_WIDTH - PxFit(120),
                                    height: (SCREEN_WIDTH - PxFit(120)) / 1.8,
                                }}
                            />
                        </View>
                        <View style={{ marginTop: PxFit(10) }}>
                            <View style={{ flexDirection: 'row', marginBottom: PxFit(5) }}>
                                <Image
                                    source={require('../../../assets/images/4.png')}
                                    style={{ width: PxFit(20), height: PxFit(20) }}
                                />
                                <View>
                                    <Text style={styles.title}>题库内已存在完全相同或相似度极高的</Text>
                                    <Text style={styles.title}>重复题目。</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{ marginTop: PxFit(10) }}>
                            <View style={{ flexDirection: 'row', marginBottom: PxFit(5) }}>
                                <Image
                                    source={require('../../../assets/images/5.png')}
                                    style={{ width: PxFit(20), height: PxFit(20) }}
                                />
                                <View>
                                    <Text style={styles.title}>发布广告、不良政治导向、色情低俗内</Text>
                                    <Text style={styles.title}>容（含性暗示等内容）和其他国家法</Text>
                                    <Text style={styles.title}>律法规禁止的内容</Text>
                                </View>
                            </View>
                        </View>
                        <View>
                            <Text style={styles.text}>
                                官方拥有对违反以上出题规则的用户进行处理的权利，一经发现此类题目将予以下架，对于恶意违反，大量输出此类题目的用户，官方将进行限制行为、封号处理。
                            </Text>
                        </View>
                    </View>
                </ScrollView>
                <View style={styles.bottom}>
                    <TouchFeedback
                        style={{ flexDirection: 'row', alignItems: 'center' }}
                        onPress={() => {
                            this.setState({
                                readed: !readed,
                            });
                        }}>
                        <TouchFeedback style={styles.bageWrap}>
                            {readed ? (
                                <View style={styles.bage}>
                                    <Iconfont name={'correct'} color={Theme.white} size={12} />
                                </View>
                            ) : null}
                        </TouchFeedback>
                        <Text>我已阅读出题规范</Text>
                    </TouchFeedback>
                    <TouchFeedback
                        disabled={!readed}
                        onPress={() => {
                            this.props.hide();
                            app.updateContributeRuleRead(readed);
                        }}>
                        <Text>关闭</Text>
                    </TouchFeedback>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    title: {
        // paddingVertical: PxFit(2),
        // lineHeight: PxFit(15),
        paddingLeft: PxFit(5),
        fontSize: PxFit(13),
        color: '#A46E38',
    },
    text: {
        paddingVertical: PxFit(2),
        lineHeight: PxFit(15),
        fontSize: PxFit(12),
        color: '#A46E38',
    },
    buttonText: {
        height: PxFit(38),
        borderRadius: PxFit(19),
        marginTop: PxFit(10),
        backgroundColor: Theme.primaryColor,
    },
    bottom: {
        paddingTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    bageWrap: {
        height: 16,
        width: 16,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: Theme.grey,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    bage: {
        backgroundColor: Theme.theme,
        height: 16,
        width: 16,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default Rules;
