import React, { Component, useState, useContext, useEffect, useRef, useCallback } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, ImageBackground } from 'react-native';
import { PageContainer, HxfTextInput, HxfButton, Row, Center, Iconfont, GradientView } from '@src/components';
import { Theme, SCREEN_WIDTH, Tools, PxFit } from 'utils';
import { exceptionCapture, useBounceAnimation } from '@src/common';
import { GQL, useQuery, useMutation } from '@src/apollo';
import { observer, app } from 'store';
import localStore from './store';
import ChallengeButton from './components/ChallengeButton';
import Competitor from './components/Competitor';

export default observer(props => {
    const store = useRef({});

    useEffect(() => {
        store.current = new localStore();
        return (): void => {
            return null;
        };
    }, []);

    return (
        <PageContainer hiddenNavBar>
            <ImageBackground style={styles.background} source={require('@src/assets/images/matching_bg.png')}>
                <View style={styles.container}>
                    <View style={styles.competitorLeft}>
                        <Competitor fadeIn={store.current.matching} user={app.me} theLeft={true} />
                    </View>
                    <View style={styles.challengeWrap}>
                        <ChallengeButton
                            matching={store.current.matching}
                            onPress={() => (store.current.matching = !store.current.matching)}
                        />
                    </View>
                    <View style={styles.competitorRight}>
                        <Competitor fadeIn={store.current.matching} user={app.me} />
                    </View>
                </View>
            </ImageBackground>
        </PageContainer>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    background: {
        height: '100%',
        resizeMode: 'cover',
        width: '100%',
    },
    challengeWrap: {
        marginVertical: PxFit(30),
    },
    competitorLeft: {
        width: SCREEN_WIDTH,
        alignItems: 'flex-start',
    },
    competitorRight: {
        width: SCREEN_WIDTH,
        alignItems: 'flex-end',
    },
});
