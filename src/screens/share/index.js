/*
 * @Author: Gaoxuan
 * @Date:   2019-07-18 11:20:13
 */
'use strict';
import React, { Component } from 'react';
import { StyleSheet, View, Platform, Text, Image, ScrollView } from 'react-native';
import { PageContainer, TouchFeedback, Iconfont, Row } from 'components';
import { Theme, PxFit, Config, SCREEN_WIDTH, SCREEN_HEIGHT } from 'utils';
import ShareRule from './components/ShareRule';
import { Overlay } from 'teaset';

import { compose, Query, Mutation, graphql, GQL } from 'apollo';

import { MarqueeHorizontal, MarqueeVertical } from 'react-native-marquee-ab';

import { app } from 'store';
import service from 'service';

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reportContent: {
                category: '分享',
                action: 'user_shared',
                name: '打开分享页面',
                value: '1',
                package: Config.PackageName,
                os: Platform.OS,
                version: Config.Version,
                build: Config.Build,
                user_id: app.me.id,
                referrer: Config.AppStore,
            },
        };
    }

    componentDidMount() {
        const data = JSON.stringify(this.state.reportContent);
        service.dataReport(data, result => {
            console.warn('result', result);
        });
        // 分享数据上报
    }

    render() {
        const { navigation, data } = this.props;
        const { loading, error } = data;
        return (
            <PageContainer title="分享" white>
                <ScrollView style={styles.container}>
                    <View style={styles.top}>
                        <Image source={require('../../assets/images/share-header.png')} style={styles.top} />
                        <TouchFeedback style={styles.shareRulePosition} onPress={this.showRule}>
                            <Image source={require('../../assets/images/share-rule.png')} style={styles.shareRule} />
                        </TouchFeedback>
                        <TouchFeedback
                            style={styles.shareButtonPosition}
                            onPress={() => {
                                navigation.navigate('AppShareCard');
                            }}>
                            <Image
                                source={require('../../assets/images/share-button.png')}
                                style={styles.shareButton}
                            />
                        </TouchFeedback>
                    </View>
                    <View style={styles.bottom}>
                        <View>
                            <Image source={require('../../assets/images/share-footer.png')} style={styles.bottom} />
                        </View>
                        <View style={styles.shareBottomPosition}>
                            <Row>
                                <View style={styles.inviteeInfo}>
                                    <Row>
                                        <Text style={styles.shareCountText}>
                                            {loading ? 0 : data.user.invitations_success_count}
                                        </Text>
                                        <Text style={styles.shareCountInfo}>人</Text>
                                    </Row>
                                    <TouchFeedback
                                        onPress={() => {
                                            navigation.navigate('InviteeList', { shareInfo: data.user });
                                        }}>
                                        <Image
                                            source={require('../../assets/images/share-detail.png')}
                                            style={styles.detailButton}
                                        />
                                    </TouchFeedback>
                                </View>
                                <View style={styles.inviteeInfo}>
                                    <Row>
                                        <Text style={styles.shareCountText}>
                                            {data.user && data.user.wallet ? data.user.wallet.total_withdraw_amount : 0}
                                        </Text>
                                        <Text style={styles.shareCountInfo}>元</Text>
                                    </Row>
                                    <TouchFeedback
                                        onPress={() => {
                                            navigation.navigate('AppShareCard');
                                        }}>
                                        <Image
                                            source={require('../../assets/images/continue-share.png')}
                                            style={styles.detailButton}
                                        />
                                    </TouchFeedback>
                                </View>
                            </Row>
                        </View>
                    </View>
                </ScrollView>
                <Query query={GQL.InvitationRewardsQuery} variables={{ limit: 10 }}>
                    {({ data, loading, error, refetch, fetchMore }) => {
                        if (error) return null;
                        if (loading) return null;
                        if (!(data && data.invitationRewards.length > 0)) return null;
                        let textList = [];
                        data.invitationRewards.map(invitationReward => {
                            textList.push({ value: invitationReward });
                        });
                        return (
                            <View>
                                <MarqueeVertical
                                    textList={textList}
                                    duration={1000}
                                    width={SCREEN_WIDTH}
                                    height={20}
                                    direction={'up'}
                                    numberOfLines={1}
                                    bgContainerStyle={{ backgroundColor: 'rgba(210,210,210,0.5)' }}
                                    textStyle={{ color: Theme.white, textAlign: 'center', fontSize: 13 }}
                                />
                            </View>
                        );
                    }}
                </Query>
            </PageContainer>
        );
    }

    showRule = () => {
        let overlayView = (
            <Overlay.View animated>
                <View style={styles.overlayInner}>
                    <ShareRule hide={() => Overlay.hide(this.OverlayKey)} />
                </View>
            </Overlay.View>
        );
        this.OverlayKey = Overlay.show(overlayView);
    };
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    top: {
        width: SCREEN_WIDTH,
        height: (SCREEN_WIDTH * 1920) / 1080,
    },
    shareRulePosition: {
        marginTop: -(((SCREEN_WIDTH * 1920) / 1080) * 8) / 13,
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    shareRule: {
        width: SCREEN_WIDTH / 5,
        height: ((SCREEN_WIDTH / 5) * 99) / 258,
        marginRight: -SCREEN_WIDTH / 35,
    },
    shareButtonPosition: {
        marginTop: (((SCREEN_WIDTH * 1920) / 1080) * 6) / 13,
        justifyContent: 'center',
        alignItems: 'center',
    },
    shareButton: {
        width: (SCREEN_WIDTH * 4) / 6,
        height: (((SCREEN_WIDTH * 4) / 6) * 206) / 810,
    },
    bottom: {
        width: SCREEN_WIDTH,
        height: (SCREEN_WIDTH * 1505) / 1080,
    },
    shareBottomPosition: {
        marginTop: ((-(SCREEN_WIDTH * 1505) / 1080) * 20) / 24,
    },
    inviteeInfo: {
        width: SCREEN_WIDTH / 2,
        alignItems: 'center',
    },
    shareCountText: {
        fontSize: 52,
        color: Theme.themeRed,
    },
    shareCountInfo: {
        fontSize: 16,
        marginTop: 20,
        paddingLeft: 5,
    },
    detailButton: {
        width: SCREEN_WIDTH / 3 + 10,
        height: ((SCREEN_WIDTH / 3 + 10) * 155) / 399,
        marginTop: 20,
    },
    headerContainer: {
        backgroundColor: 'rgba(210,210,210,0.5)',
    },
    headerText: {
        color: Theme.white,
        textAlign: 'center',
        fontSize: 13,
        paddingVertical: 2,
    },
    overlayInner: {
        flex: 1,
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default compose(
    graphql(GQL.userInvitationInfoQuery, { options: props => ({ variables: { user_id: app.me.id } }) }),
)(index);
