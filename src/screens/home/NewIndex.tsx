import React, { useRef, useMemo, useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import {
    PageContainer,
    TouchFeedback,
    Iconfont,
    ScrollTab,
    beginnerGuidance,
    VideoTaskGuidance,
} from '@src/components';
import { Theme, PxFit, SCREEN_WIDTH, SCREEN_HEIGHT, Config } from '@src/utils';
import { observer, app, storage, keys, config } from '@src/store';
import { Query, useQuery, GQL } from '@src/apollo';
import { syncGetter } from '@src/common';
import { Util } from 'native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import { useNavigation } from 'react-navigation-hooks';
import { useApolloClient } from '@apollo/react-hooks';
import { Overlay } from 'teaset';
import { when } from 'mobx';
import JPushModule from 'jpush-react-native';
import UserRewardOverlay from './components/UserRewardOverlay';
import TimeReward from './components/TimeReward';
import FixedSection from './FixedSection';
import DynamicSection from './DynamicSection';

// 监听新用户登录
when(
    () => app.me.isNewUser,
    () => {
        // 新手指导
        beginnerGuidance({
            guidanceKey: 'VideoTask',
            GuidanceView: VideoTaskGuidance,
        });
    },
);

const Index = observer(props => {
    const navigation = useNavigation();
    const client = useApolloClient();
    const registerTimer = useRef();
    const push_content = useRef();
    const push_time = useRef(() => new Date());
    const push_type = useRef();
    // 首页分类
    const { data } = useQuery(GQL.TagsQuery, {
        variables: {
            filter: 'HOMEPAGE',
        },
    });
    const tags = useMemo(() => syncGetter('tags', data), [data]);

    // 每个版本静默重新登录一次
    const resetUser = useCallback(async () => {
        const resetVersion = await storage.getItem(keys.resetVersion);
        const me = (await storage.getItem(keys.me)) || (await storage.getItem(keys.user));

        if (resetVersion !== Config.AppVersionNumber && me) {
            client
                .mutate({
                    mutation: GQL.signToken,
                    variables: {
                        token: me.token,
                    },
                })
                .then(result => {
                    app.signIn(result.data.signInWithToken);
                    app.updateResetVersion(Config.AppVersionNumber);
                    app.updateUserCache(result.data.signInWithToken);
                });
        }
    }, [client]);

    // 新用户奖励提示
    const loadUserReword = useCallback(
        phone => {
            let overlayRef;
            Overlay.show(
                <Overlay.View animated ref={ref => (overlayRef = ref)}>
                    <View style={styles.overlayInner}>
                        <UserRewardOverlay
                            hide={() => overlayRef.close()}
                            navigation={navigation}
                            phone={phone}
                            client={client}
                        />
                    </View>
                </Overlay.View>,
            );
        },
        [client],
    );

    // 身份信息、网络状态查询
    useEffect(() => {
        const didFocusSubscription = navigation.addListener('didFocus', payload => {
            if (app.login) {
                client
                    .query({
                        query: GQL.UserWithdrawQuery,
                    })
                    .then(({ data }) => {})
                    .catch(error => {
                        const info = error.toString().indexOf('登录');
                        if (info > -1) {
                            app.forget();
                            Toast.show({ content: '您的身份信息已过期,请重新登录' });
                        }
                    });
            }
            NetInfo.isConnected.fetch().then(isConnected => {
                if (!isConnected) {
                    Toast.show({ content: '网络不可用' });
                }
            });
        });

        return () => {
            didFocusSubscription.remove();
        };
    }, [client]);

    useEffect(() => {
        resetUser();

        registerTimer.current = setTimeout(async () => {
            // 再次请求权限防止未获取到手机号
            const phone = ISIOS ? '' : await Util.getPhoneNumber();
            const userCache = await storage.getItem(keys.userCache);

            if (!app.login && !userCache) {
                loadUserReword(phone);
            }
        }, 3000);

        return () => {
            clearTimeout(registerTimer.current);
        };
    }, [app.login]);

    // 推送通知
    useEffect(() => {
        const receiveNotificationListener = message => {
            push_content.current = message.alertContent;
            push_type.current = JSON.parse(message.extras).type;
            push_time.current = JSON.parse(message.extras).time;
        };
        JPushModule.addReceiveNotificationListener(receiveNotificationListener);

        // 监听打开通知事件
        const openNotificationListener = map => {
            navigation.navigate('PushNotification', {
                content: push_content.current,
                name: '官方提示',
                time: push_time.current,
            });
        };
        JPushModule.addReceiveOpenNotificationListener(this.openNotificationListener);

        return () => {
            JPushModule.removeReceiveNotificationListener(receiveNotificationListener);
            JPushModule.removeReceiveOpenNotificationListener(openNotificationListener);
        };
    }, []);

    const Sections = useMemo(() => {
        console.log('====================================');
        console.log('tags', tags);
        console.log('====================================');
        if (Array.isArray(tags)) {
            return tags.map((tag, index) => {
                if (index === 0 || index === tags.length - 1) {
                    // return <FixedSection tabLabel={tag.name} tag={tag} />;
                    return <View key={tag.id} tabLabel={tag.name} tag={tag} />;
                } else {
                    // return <DynamicSection tabLabel={tag.name} tag={tag} />;
                    return <View key={tag.id} tabLabel={tag.name} tag={tag} />;
                }
            });
        } else {
            return <View />;
        }
    }, [tags]);

    return (
        <PageContainer hiddenNavBar white contentViewStyle={styles.container}>
            <ScrollableTabView
                prerenderingSiblingsNumber={0}
                renderTabBar={props => (
                    <ScrollTab
                        {...props}
                        underlineWidth={PxFit(16)}
                        style={scrollTabStyle.tabBarStyle}
                        activeTextStyle={scrollTabStyle.activeTextStyle}
                        inactivityTextStyle={scrollTabStyle.inactivityTextStyle}
                        underlineStyle={scrollTabStyle.underlineStyle}
                    />
                )}>
                {Sections}
                {/* <View tabLabel={1} />
                <View tabLabel={2} />
                <View tabLabel={3} /> */}
            </ScrollableTabView>
        </PageContainer>
    );
});

const scrollTabStyle = {
    tabBarStyle: {
        justifyContent: 'flex-start',
    },
    activeTextStyle: {
        color: Theme.watermelon,
        fontSize: PxFit(17),
    },
    inactivityTextStyle: {
        color: Theme.defaultTextColor,
        fontSize: PxFit(17),
    },
    underlineStyle: {
        height: PxFit(2),
        backgroundColor: Theme.watermelon,
    },
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Theme.statusBarHeight,
        backgroundColor: '#fff',
    },
    overlayInner: {
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0)',
        flex: 1,
        height: SCREEN_HEIGHT,
        justifyContent: 'center',
        width: SCREEN_WIDTH,
    },
});

export default Index;
