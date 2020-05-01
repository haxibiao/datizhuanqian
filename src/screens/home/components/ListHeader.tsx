import React from 'react';
import { View, Text, StyleSheet, ImageBackground, Image } from 'react-native';
import { TouchFeedback } from 'components';

import { observer, app, config } from 'store';

const ListHeader = observer(props => {
    const { navigation } = props;
    // if (app.gameConfig.status >= 1) {
    return (
        <View style={styles.enters}>
            <TouchFeedback
                authenticated
                navigation={navigation}
                style={styles.enterWrap}
                activeOpacity={1}
                onPress={() => navigation.navigate('RandomAnswer')}>
                <Image source={require('@src/assets/images/bg_random_question.png')} style={styles.letEntrance} />
                <View style={{ position: 'absolute', top: PxFit(20), left: PxFit(20) }}>
                    <Text style={styles.entranceName}>随机答题</Text>
                    <View style={styles.line} />
                    <Text style={styles.entranceDescription}>挑战你的知识边界</Text>
                </View>
            </TouchFeedback>
            <View style={{ justifyContent: 'space-between' }}>
                <TouchFeedback
                    authenticated
                    navigation={navigation}
                    style={styles.enterWrap}
                    activeOpacity={1}
                    onPress={() =>
                        app.gameConfig.status >= 1
                            ? navigation.navigate('Matching')
                            : Toast.show({
                                  content: '升级维护中,敬请期待...',
                              })
                    }>
                    <Image source={require('@src/assets/images/bg_answer_pk.png')} style={styles.entrance} />
                    <View style={{ position: 'absolute', top: PxFit(15), left: PxFit(15) }}>
                        <Text style={styles.entranceName}>答题对战</Text>
                        <View style={styles.line} />
                        <Text style={styles.entranceDescription}>{!config.disableAd ? 'PK赢奖金' : '知识对决'}</Text>
                    </View>
                </TouchFeedback>
                {/* <TouchFeedback
                        authenticated
                        navigation={navigation}
                        style={styles.enterWrap}
                        activeOpacity={1}
                        onPress={() => {
                            // navigation.navigate('Audit');
                            Toast.show({
                                content: '敬请期待',
                            });
                        }}>
                        <ImageBackground
                            source={require('@src/assets/images/bg_audit_question.png')}
                            style={styles.entrance}>
                            <Text style={styles.entranceName}>审核题目</Text>
                            <View style={styles.line} />
                            <Text style={styles.entranceDescription}>净化社区环境</Text>
                        </ImageBackground>
                    </TouchFeedback> */}
                <TouchFeedback
                    authenticated
                    navigation={navigation}
                    style={styles.enterWrap}
                    activeOpacity={1}
                    onPress={() => {
                        navigation.navigate('Rank');
                    }}>
                    <Image source={require('@src/assets/images/ic_answer_rank.png')} style={styles.entrance} />
                    <View style={{ position: 'absolute', top: PxFit(15), left: PxFit(15) }}>
                        <Text style={styles.entranceName}>排行榜</Text>
                        <View style={styles.line} />
                        <Text style={styles.entranceDescription}>欲与天公试比高</Text>
                    </View>
                </TouchFeedback>
            </View>
        </View>
    );
    // } else {
    //     return <View style={{ height: PxFit(Theme.itemSpace) }} />;
    // }
});
const entranceWidth = (Device.WIDTH - PxFit(Theme.itemSpace) * 2 - PxFit(10)) / 2;

const styles = StyleSheet.create({
    enters: {
        flexDirection: 'row',
        marginVertical: PxFit(Theme.itemSpace),
    },
    enterWrap: {},
    letEntrance: {
        width: entranceWidth,
        height: (entranceWidth * 485) / 505,
        // justifyContent: 'center',
        // alignItems: 'center',
        borderRadius: PxFit(10),
        // overflow: 'hidden',
        marginRight: PxFit(10),
    },
    entrance: {
        width: entranceWidth,
        height: (entranceWidth * 228) / 505,
        justifyContent: 'center',
        // padding: PxFit(15),
        borderRadius: PxFit(10),
        // overflow: 'hidden',
    },
    entranceName: {
        fontSize: Font(15),
        color: '#fff',
        fontWeight: 'bold',
    },
    entranceDescription: {
        fontSize: Font(12),
        color: '#fff',
        marginTop: PxFit(6),
    },
    questionsTitle: {
        fontSize: PxFit(18),
        color: Theme.defaultTextColor,
        fontWeight: 'bold',
        marginHorizontal: PxFit(Theme.itemSpace),
    },
    line: {
        height: PxFit(2.5),
        width: PxFit(13),
        backgroundColor: '#FFDD02',
        marginTop: PxFit(3),
        marginLeft: PxFit(1),
    },
});

export default ListHeader;
