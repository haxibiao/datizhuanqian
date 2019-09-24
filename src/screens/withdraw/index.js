/* eslint-disable @typescript-eslint/class-name-casing */
/* eslint-disable react-native/sort-styles */
/*
 * @flow
 * created by wangyukun made in 2019-03-18 11:45:13
 */

import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { PageContainer, TouchFeedback } from 'components';

import { SCREEN_WIDTH, SCREEN_HEIGHT } from 'utils';

import WithdrawBody from './components/WithdrawBody';
import NotLogin from './components/NotLogin';
import RuleDescription from './components/RuleDescription';

import { Overlay } from 'teaset';
import { app, observer } from 'store';
import { ttad } from 'native';

@observer
class index extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    showRule = () => {
        const overlayView = (
            <Overlay.View animated>
                <View style={styles.overlayInner}>
                    <RuleDescription hide={() => Overlay.hide(this.OverlayKey)} />
                </View>
            </Overlay.View>
        );
        this.OverlayKey = Overlay.show(overlayView);
    };

    render() {
        const { navigation } = this.props;
        const { login } = app;
        return (
            <PageContainer
                title="提现"
                isTopNavigator
                white
                rightView={
                    <TouchFeedback onPress={this.showRule} style={styles.rule}>
                        <Text>规则说明</Text>
                    </TouchFeedback>
                }>
                {/* <ttad.DrawFeedAd /> */}
                {/* <ttad.BannerAd /> */}

                {login ? <WithdrawBody navigation={navigation} /> : <NotLogin navigation={navigation} />}
                {/* {login ?  <ttad.FeedAd />} */}
            </PageContainer>
        );
    }
}

const styles = StyleSheet.create({
    overlayInner: {
        flex: 1,
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rule: {
        flex: 1,
        justifyContent: 'center',
    },
});

export default index;
