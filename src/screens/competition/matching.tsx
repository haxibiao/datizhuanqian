import React, { useMemo, useRef, useEffect } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, ImageBackground } from 'react-native';
import { PageContainer, NavigatorBar } from '@src/components';
import { Theme, SCREEN_WIDTH, PxFit } from 'utils';
import { observer, app } from 'store';
import localStore from './store';
import ChallengeButton from './components/ChallengeButton';
import MatchTheUser from './components/MatchTheUser';
import { useNavigation } from 'react-navigation-hooks';
import { Overlay } from 'teaset';

export default observer(props => {
    const navigation = useNavigation();

    const store = useRef(new localStore()).current;
    const overlayRef = useRef();
    const timer = useRef();

    // Toast.show({ content: `更多功能正在开发\n敬请期待`, layout: 'top' })
    const rightView = useMemo(() => {
        return (
            <TouchableOpacity style={styles.rightView} activeOpacity={1} onPress={() => navigation.navigate('Compete')}>
                <Image style={styles.medal} source={require('@src/assets/images/medal.png')} />
            </TouchableOpacity>
        );
    }, []);

    useEffect(() => {
        if (store.rival.id) {
            // Overlay.show(
            //     <Overlay.PopView modal={true} style={styles.overlay} ref={ref => (overlayRef.current = ref)}>
            //         <View style={styles.modal} />
            //     </Overlay.PopView>,
            // );
            timer.current = setInterval(() => {
                timer.current = 0;
                // overlayRef.current && overlayRef.current.close();
                navigation.navigate('Compete', { game: store.game, store });
            }, 500);
        } else {
            clearInterval(timer.current);
        }
    }, [store.rival.id]);

    useEffect(() => {
        const navWillBlurListener = navigation.addListener('willBlur', () => {
            if (store.rival.id && timer.current) {
                store.leaveGame();
            }
            if (!store.rival.id && store.matching) {
                store.cancelMatch();
            }
        });

        return () => {
            navWillBlurListener.remove();
        };
    }, []);

    return (
        <PageContainer hiddenNavBar>
            <ImageBackground style={styles.background} source={require('@src/assets/images/matching_bg.png')}>
                <View style={styles.container}>
                    <View style={styles.competitorLeft}>
                        <MatchTheUser fadeIn={store.rival.id} user={app.me} theLeft={true} />
                    </View>
                    <View style={styles.challengeWrap}>
                        <ChallengeButton
                            matching={store.matching}
                            matched={!!store.rival.id}
                            onPress={store.matchGame}
                        />
                    </View>
                    {store.matching && !store.rival.id && (
                        <View style={styles.cancelMatchWrap}>
                            <TouchableOpacity style={styles.cancelMatch} onPress={store.cancelMatch}>
                                <Text style={styles.cancelMatchText}>取消匹配</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    <View style={styles.competitorRight}>
                        <MatchTheUser fadeIn={store.rival.id} user={store.rival} />
                    </View>
                </View>
            </ImageBackground>
            <View style={styles.header}>
                <NavigatorBar
                    navigation={navigation}
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
        color: Theme.watermelon,
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
    modal: { backgroundColor: 'rgba(255,255,255,0)', flex: 1 },
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
