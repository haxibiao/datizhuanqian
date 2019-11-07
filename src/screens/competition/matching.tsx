import React, { useMemo, useRef, useCallback } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, ImageBackground } from 'react-native';
import { PageContainer, NavigatorBar } from '@src/components';
import { Theme, SCREEN_WIDTH, Tools, PxFit } from 'utils';
import { observer, app } from 'store';
import localStore from './store';
import ChallengeButton from './components/ChallengeButton';
import Competitor from './components/Competitor';

export default observer(props => {
    const store = useRef(new localStore()).current;

    const rightView = useMemo(() => {
        return (
            <TouchableOpacity
                style={styles.rightView}
                activeOpacity={1}
                onPress={() => Toast.show({ content: `更多功能正在开发\n敬请期待`, layout: 'top' })}>
                <Image style={styles.medal} source={require('@src/assets/images/medal.png')} />
            </TouchableOpacity>
        );
    }, []);

    return (
        <PageContainer hiddenNavBar>
            <ImageBackground style={styles.background} source={require('@src/assets/images/matching_bg.png')}>
                <View style={styles.container}>
                    <View style={styles.competitorLeft}>
                        <Competitor fadeIn={store.rival.id} user={app.me} theLeft={true} />
                    </View>
                    <View style={styles.challengeWrap}>
                        <ChallengeButton
                            matching={store.matching}
                            matched={!!store.rival.id}
                            onPress={store.matchGame}
                        />
                    </View>
                    {store.matching && (
                        <View style={styles.cancelMatchWrap}>
                            <TouchableOpacity style={styles.cancelMatch} onPress={store.cancelMatch}>
                                <Text style={styles.cancelMatchText}>取消匹配</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    <View style={styles.competitorRight}>
                        <Competitor fadeIn={store.rival.id} user={store.rival} />
                    </View>
                </View>
            </ImageBackground>
            <View style={styles.header}>
                <NavigatorBar
                    style={styles.navigatorBar}
                    titleStyle={styles.titleStyle}
                    title="双人对战"
                    rightView={rightView}
                />
            </View>
        </PageContainer>
    );
});

const styles = StyleSheet.create({
    background: {
        height: '100%',
        resizeMode: 'cover',
        width: '100%',
    },
    cancelMatch: {
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: PxFit(6),
        height: PxFit(42),
        justifyContent: 'center',
        marginTop: PxFit(20),
        position: 'absolute',
        width: PxFit(180),
    },
    cancelMatchText: {
        color: '#FF5E7D',
        fontSize: PxFit(16),
        fontWeight: 'bold',
    },
    cancelMatchWrap: {
        alignItems: 'center',
    },
    challengeWrap: {
        marginVertical: PxFit(50),
    },
    competitorLeft: {
        alignItems: 'flex-start',
        width: SCREEN_WIDTH,
    },
    competitorRight: {
        alignItems: 'flex-end',
        width: SCREEN_WIDTH,
    },
    container: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
    },
    header: {
        ...StyleSheet.absoluteFill,
    },
    medal: {
        height: (PxFit(22) * 75) / 56,
        marginRight: PxFit(5),
        width: PxFit(22),
    },
    navigatorBar: {
        backgroundColor: 'transparent',
    },
    rightView: {
        alignItems: 'flex-end',
        flex: 1,
        justifyContent: 'center',
    },
    titleStyle: {
        fontWeight: 'bold',
    },
});
