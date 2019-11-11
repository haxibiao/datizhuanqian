import React, { useMemo, useRef, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Image, Text, TouchableOpacity, ImageBackground } from 'react-native';
import { PageContainer, NavigatorBar, Avatar } from '@src/components';
import { Theme, SCREEN_WIDTH, Tools, PxFit } from 'utils';
import { observer, app } from 'store';
import localStore from './store';
import { useNavigation } from 'react-navigation-hooks';

const avatarWidget = {
    victory: [
        require('@src/assets/images/avatar_frame_blue_win.png'),
        require('@src/assets/images/avatar_frame_yellow.png'),
    ],
    defeat: [
        require('@src/assets/images/avatar_frame_blue.png'),
        require('@src/assets/images/avatar_frame_yellow_win.png'),
    ],
    draw: [require('@src/assets/images/avatar_frame_blue.png'), require('@src/assets/images/avatar_frame_yellow.png')],
};

const competitionResult = {
    victory: require('@src/assets/images/competition_victory.png'),
    defeat: require('@src/assets/images/competition_defeat.png'),
    draw: require('@src/assets/images/competition_draw.png'),
};

const over = observer(props => {
    const navigation = useNavigation();
    const result = navigation.getParam('result', 'victory');
    const store = useRef(new localStore()).current;
    const { me } = app;

    return (
        <PageContainer hiddenNavBar>
            <ImageBackground style={styles.background} source={require('@src/assets/images/compete_bg.png')}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={styles.container}
                    contentContainerStyle={styles.content}>
                    <View style={styles.competitor}>
                        <ImageBackground style={styles.playerBg} source={avatarWidget[result][0]}>
                            <Avatar source={app.me.avatar} size={PxFit(100)} style={styles.playerAvatar} />
                        </ImageBackground>
                        <Image style={styles.competeVs} source={require('@src/assets/images/compete_vs.png')} />
                        <ImageBackground
                            style={[styles.playerBg, { alignItems: 'flex-start' }]}
                            source={avatarWidget[result][1]}>
                            <Avatar source={store.rival.avatar} size={PxFit(100)} style={styles.playerAvatar} />
                        </ImageBackground>
                    </View>
                    <View style={styles.userInfo}>
                        <View>
                            <Text style={styles.userName}>{me.name}</Text>
                            <Text style={styles.score}>120</Text>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                            <Text style={styles.userName}>{me.name}</Text>
                            <Text style={[styles.score, { color: '#F8CE4D' }]}>60</Text>
                        </View>
                    </View>
                    <View style={styles.main}>
                        <View style={styles.gameResult}>
                            <Image style={styles.gameResultBg} source={competitionResult[result]} />
                        </View>
                        <View style={styles.statisticPanel}>
                            <View style={styles.statisticItem}>
                                <Text style={styles.itemText1}>答对数:</Text>
                                <Image
                                    style={styles.iconImage}
                                    source={require('@src/assets/images/competition_log.png')}
                                />
                                <Text style={styles.itemText2}>8题</Text>
                            </View>
                            <Image style={styles.orangeLine} source={require('@src/assets/images/orange_line.png')} />
                            <View style={styles.statisticItem}>
                                <Text style={styles.itemText1}>计时:</Text>
                                <Image
                                    style={styles.iconImage}
                                    source={require('@src/assets/images/competition_time.png')}
                                />
                                <Text style={styles.itemText2}>43秒</Text>
                            </View>
                            <Image style={styles.orangeLine} source={require('@src/assets/images/orange_line.png')} />
                            <View style={styles.statisticItem}>
                                <Text style={styles.itemText1}>奖励:</Text>
                                <Image
                                    style={styles.iconImage}
                                    source={require('@src/assets/images/competition_reward.png')}
                                />
                                <Text style={styles.itemText2}>+200</Text>
                            </View>
                            <Image style={styles.orangeLine} source={require('@src/assets/images/orange_line.png')} />
                        </View>
                        <View style={styles.bottom}>
                            <View style={styles.buttonWrap}>
                                <TouchableOpacity
                                    style={[styles.button, { backgroundColor: Theme.watermelon }]}
                                    onPress={store.button}>
                                    <Text style={[styles.buttonText, { color: '#fff' }]}>领取额外奖励</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.buttonWrap}>
                                <TouchableOpacity style={styles.button} onPress={store.button}>
                                    <Text style={styles.buttonText}>继续答题挑战</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </ImageBackground>
            <View style={styles.header}>
                <NavigatorBar
                    navigation={navigation}
                    style={styles.navigatorBar}
                    titleStyle={styles.titleStyle}
                    title="对战结束"
                />
            </View>
        </PageContainer>
    );
});

const competeBgWidth = SCREEN_WIDTH / 3;
const competeBgHeight = (competeBgWidth * 149) / 229;
const fixCrownHeight = (competeBgHeight * 26) / 149;
const avatarSize = competeBgHeight - fixCrownHeight - PxFit(12);
const vsWidth = avatarSize - PxFit(12);

const styles = StyleSheet.create({
    background: {
        height: '100%',
        resizeMode: 'cover',
        width: '100%',
    },
    bottom: {
        marginTop: PxFit(20),
    },
    button: {
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: PxFit(6),
        height: PxFit(42),
        justifyContent: 'center',
        width: PxFit(180),
    },
    buttonText: {
        color: Theme.watermelon,
        fontSize: PxFit(16),
        fontWeight: 'bold',
    },
    buttonWrap: {
        marginTop: PxFit(20),
    },
    competeVs: {
        height: vsWidth,
        resizeMode: 'cover',
        width: (vsWidth * 214) / 128,
    },
    competitor: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    container: {
        flex: 1,
    },
    content: {
        paddingBottom: PxFit(Theme.HOME_INDICATOR_HEIGHT + Theme.itemSpace),
        paddingTop: PxFit(Theme.navBarContentHeight + Theme.itemSpace * 2),
    },
    gameResult: {
        marginTop: -PxFit(60),
    },
    gameResultBg: {
        height: ((SCREEN_WIDTH / 2) * 308) / 423,
        resizeMode: 'cover',
        width: SCREEN_WIDTH / 2,
    },
    header: {
        ...StyleSheet.absoluteFill,
    },
    iconImage: {
        height: PxFit(20),
        resizeMode: 'cover',
        width: PxFit(20),
    },
    itemText1: {
        color: '#fff',
        flex: 1,
        fontSize: PxFit(15),
        fontWeight: 'bold',
        textAlign: 'left',
    },
    itemText2: {
        color: '#F8CE4D',
        flex: 1,
        fontSize: PxFit(15),
        textAlign: 'right',
    },
    main: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    navigatorBar: {
        backgroundColor: 'transparent',
    },
    orangeLine: {
        height: PxFit(1),
        marginVertical: PxFit(10),
        width: '100%',
    },
    playerAvatar: {
        height: avatarSize,
        resizeMode: 'cover',
        width: avatarSize,
    },
    playerBg: {
        alignItems: 'flex-end',
        height: competeBgHeight,
        padding: PxFit(6),
        paddingHorizontal: PxFit(10),
        paddingTop: fixCrownHeight + PxFit(6),
        resizeMode: 'cover',
        width: competeBgWidth,
    },
    score: {
        color: '#2AE2F3',
        fontSize: PxFit(25),
        fontWeight: 'bold',
    },
    statisticItem: {
        alignItems: 'center',
        flexDirection: 'row',
    },
    statisticPanel: {
        marginTop: PxFit(40),
        width: SCREEN_WIDTH / 2,
    },
    titleStyle: {
        fontWeight: 'bold',
    },
    userInfo: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: PxFit(Theme.itemSpace),
    },
    userName: {
        color: '#fff',
        fontSize: PxFit(20),
        fontWeight: 'bold',
    },
});

export default over;
