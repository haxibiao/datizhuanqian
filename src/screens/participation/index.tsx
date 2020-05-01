import React, { useMemo, useRef, useEffect, useCallback } from 'react';
import { StyleSheet, ScrollView, View, Text, Image, ImageBackground, TouchableOpacity } from 'react-native';
import { useNavigation } from 'react-navigation-hooks';
import { GQL, useQuery, useApolloClient } from 'apollo';
import { app } from 'store';
import { PageContainer, HxfButton, RewardOverlay } from 'components';
import BubbleImage from './BubbleImage';
import Shareholder from './Shareholder';
import ProfitRemind from './ProfitRemind';
import { Overlay } from 'teaset';
import { playVideo } from 'common';

const bubbleSite = [
    { top: PxFit(40), left: PxFit(30) },
    { top: PxFit(110), left: PxFit(25) },
    { top: PxFit(35), right: PxFit(20) },
    { top: PxFit(120), right: PxFit(30) },
    { top: PxFit(5), left: '50%', marginLeft: -PxFit(25) },
];

const adapterGraphData = {
    id: null,
    received: true, // 今天是否领取了分红
    totalBonusEarnings: 0, // 总奖金收入
    stockRate: 0, // 我的股份
    stockNumber: 100, // 股东编号
    perStockPrice: '?????', // 每个股票价格
    yesterdayEarnings: '?????', // 昨日收益
    totalEarnings: '?????', // 历史总收益
    todayUnclaimedBonusEarnings: 100, // 今日未领取收益
    goldTree: {
        rmb: [null, null, null, null, null, null],
        total: 150,
        balance: 50,
        received_at: null,
    },
};

const Participation = props => {
    const { me } = app;
    const navigation = useNavigation();
    const client = useApolloClient();
    const openedCongratulations = useRef(false);
    const openedReturnsToRemind = useRef(false);

    const receiveStockBonus = useCallback(
        position => {
            return app.mutationClient.mutate({
                mutation: GQL.receiveStockBonusMutation,
                variables: {
                    position,
                },
                refetchQueries: (): any[] => [
                    {
                        query: GQL.UserMeansQuery,
                        variables: { id: me.id },
                    },
                ],
            });
        },
        [app.mutationClient, me],
    );

    const changeUserStatus = useCallback(() => {
        return app.mutationClient.mutate({
            mutation: GQL.updateUserStockInfoMutation,
            variables: {
                is_first_stock: false,
            },
            refetchQueries: (): any[] => [
                {
                    query: GQL.UserMeansQuery,
                    variables: { id: me.id },
                },
            ],
        });
    }, [app.mutationClient, me]);

    const { data: userData, refetch } = useQuery(GQL.UserMeansQuery, {
        fetchPolicy: 'network-only',
        variables: {
            id: me.id,
        },
        skip: !me.id,
    });
    const statistics = useMemo(() => Helper.syncGetter('user', userData) || adapterGraphData, [userData]);
    const rmb = useMemo(() => Helper.syncGetter('goldTree.rmb', statistics), [statistics]);
    // 领取分红 把金币index传递给后端，后端根据下标对应的值来领奖
    const receiveGold = useCallback(
        (value, position) => {
            if (TOKEN) {
                // Toast.show({ content: `领取分红` });
                // 看广告、领取奖励
                // TODO: 还需接口返回gold
                playVideo({
                    type: 'Dividend',
                    callback: async () => {
                        const [error] = await Helper.exceptionCapture(() => receiveStockBonus(position));
                        if (error) {
                            Toast.show({ content: error.message || '领取失败' });
                        } else {
                            RewardOverlay.show({
                                reward: {
                                    rmb: value,
                                },
                                title: '分红奖励领取成功',
                            });
                        }
                    },
                });
            } else {
                navigation.navigate('Login');
            }
        },
        [receiveStockBonus],
    );

    const GoldBubbles = useMemo(() => {
        return rmb.slice(0, 5).map((value, index) => {
            return (
                <TouchableOpacity
                    key={index}
                    disabled={!value}
                    style={[styles.bubbleWrap, bubbleSite[index], !value && styles.disabled]}
                    onPress={() => receiveGold(value, index + 1)}>
                    <BubbleImage value={value} />
                </TouchableOpacity>
            );
        });
    }, [rmb]);
    // 入股仪式UI
    const congratulations = useCallback((number, shares) => {
        let popViewRef;
        Overlay.show(
            <Overlay.PopView modal={true} style={styles.overlay} ref={ref => (popViewRef = ref)}>
                <Shareholder
                    serialNumber={number}
                    shares={shares}
                    onPress={props.onChangeTab}
                    onClose={() => popViewRef.close()}
                />
            </Overlay.PopView>,
        );
    }, []);
    // 提醒领取分红UI
    const returnsToRemind = useCallback(() => {
        let popViewRef;
        Overlay.show(
            <Overlay.PopView modal={true} style={styles.overlay} ref={ref => (popViewRef = ref)}>
                <ProfitRemind onPress={props.onChangeTab} onClose={() => popViewRef.close()} />
            </Overlay.PopView>,
        );
    }, []);

    useEffect(() => {
        // 新用户入股
        if (!openedCongratulations.current && props.inCurrentPage && me.id && statistics.is_first_stock) {
            openedCongratulations.current = true;
            openedReturnsToRemind.current = true;
            changeUserStatus();
            app.updateUserInfo('is_first_stock', false);
            congratulations(statistics.stockNumber, statistics.stockRate);
        }
    }, [props, me, refetch, statistics, changeUserStatus, congratulations]);

    useEffect(() => {
        // 如果今天没有领取分红
        if (!openedReturnsToRemind.current && me.id && !statistics.is_first_stock && !statistics.received) {
            openedReturnsToRemind.current = true;
            returnsToRemind();
        }
    }, [me, statistics, returnsToRemind]);

    useEffect(() => {
        openedCongratulations.current = false;
        openedReturnsToRemind.current = false;
    }, [me.id]);

    const buttonTitle = useMemo(() => (me.id ? (statistics.received ? '等待分红' : '领取分红') : '请先登录'), [
        me,
        statistics,
    ]);
    return (
        <PageContainer title="分红树" white={true}>
            <ScrollView style={styles.container}>
                <View style={styles.moneyTreeContainer}>
                    <Image style={styles.moneyTree} source={require('@src/assets/images/money_tree.png')} />
                    <HxfButton
                        onPress={() => receiveGold(rmb[5], 6)}
                        gradient={true}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 0, y: 0 }}
                        colors={['#1E90FF', '#00BFFF']}
                        disabledColors={['#B2FCFF', '#ECFCFE']}
                        title={buttonTitle}
                        style={styles.button}
                        disabled={me.id && statistics.received}
                    />
                    {GoldBubbles}
                </View>
                <View style={styles.graphContainer}>
                    <View style={styles.subTitle}>
                        <Image style={styles.subTitleImage} source={require('@src/assets/images/hot.png')} />
                        <Text style={styles.subTitleText}>我的分红</Text>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.tipsText}>每天中午十二点计算分红</Text>
                        </View>
                    </View>
                    <View style={styles.profitList}>
                        <View style={styles.listItem}>
                            <Text style={styles.listItemCount}>
                                {Helper.count(statistics.totalBonusEarnings)}
                                <Text style={styles.listItemUnit}>{` RMB`}</Text>
                            </Text>
                            <Text style={styles.listItemName}>我的收益</Text>
                        </View>
                        <View style={styles.listItem}>
                            <Text style={styles.listItemCount}>
                                {`${statistics.stockRate} `}
                                <Text style={styles.listItemUnit}>{` 份股`}</Text>
                            </Text>
                            <Text style={styles.listItemName}>我的股份</Text>
                        </View>
                        <View style={styles.listItem}>
                            <Text style={styles.listItemCount}>
                                {Helper.count(statistics.perStockPrice) || '???'}
                                <Text style={styles.listItemUnit}>{` RMB`}</Text>
                            </Text>
                            <Text style={styles.listItemName}>每股收益</Text>
                        </View>
                    </View>
                    <View style={styles.subTitle}>
                        <Image style={styles.subTitleImage} source={require('@src/assets/images/graph.png')} />
                        <Text style={styles.subTitleText}>广告收益</Text>
                    </View>
                    <View style={styles.yieldItem}>
                        <ImageBackground
                            source={require('@src/assets/images/profit_blue.png')}
                            style={[styles.yieldImage, { marginRight: PxFit(Theme.itemSpace) }]}>
                            <Text style={styles.yieldCountText}>{statistics.yesterdayEarnings}</Text>
                            <Text style={styles.yieldText}>
                                昨天收益<Text style={styles.yieldUnit}>{`（元）`}</Text>
                            </Text>
                        </ImageBackground>
                        <ImageBackground
                            source={require('@src/assets/images/profit_violet.png')}
                            style={styles.yieldImage}>
                            <Text style={styles.yieldCountText}>{statistics.totalEarnings}</Text>
                            <Text style={styles.yieldText}>
                                历史收益<Text style={styles.yieldUnit}>{`（元）`}</Text>
                            </Text>
                        </ImageBackground>
                    </View>
                </View>
                <View style={styles.ruleContainer}>
                    <View style={[styles.subTitle, { marginBottom: PxFit(10) }]}>
                        <Image
                            style={styles.remindIcon}
                            source={require('@src/assets/images/participation_remind.png')}
                        />
                        <Text style={styles.subTitleText}>分红规则</Text>
                    </View>
                    <View style={styles.ruleItem}>
                        <View style={styles.ruleItemCircle} />
                        <Text style={styles.ruleTitle}>什么是分红股？</Text>
                    </View>
                    <Text style={styles.ruleText}>
                        {`    1、为了感谢广大用户对答妹的支持和帮助，平台将下发“分红股”，并每天将用户在APP内产生广告收益的80%用作分红股，发放给持有“分红股”的用户，实现共赢，平台收益越高，每股分红越多。`}
                    </Text>
                    <Text style={styles.ruleText}>
                        {`    2、持有即享受平台每日分红，可提现；分红股总量有限，前期参与有更多优势。`}
                    </Text>
                    <View style={styles.ruleItem}>
                        <View style={styles.ruleItemCircle} />
                        <Text style={styles.ruleTitle}>如何获得分红？</Text>
                    </View>
                    <Text style={styles.ruleText}>
                        {`    1、分红股与您在平台的个人行为和每日活跃度、贡献值几大维度动态有关，其中个人行为包括但不限于：登录天数、签到天数、在线时长、答题数、出题数、任务完成情况等因素。贡献值与活跃度越高的用户将有机会获得更多分红股。`}
                    </Text>
                    <View style={styles.ruleItem}>
                        <View style={styles.ruleItemCircle} />
                        <Text style={styles.ruleTitle}>如何领取分红？</Text>
                    </View>
                    <Text style={styles.ruleText}>
                        {`    1、平台每天会统计当前广告收益，并根据所有用户持股数量平均分配发放分红，持有分红股越多的收益越高。`}
                    </Text>
                    <Text style={styles.ruleText}>
                        {`    2、分红奖励需要每天24点前领取，超过时间未领取的奖励将自动消失。（每天可领收益=收益股数X今日每股收益）`}
                    </Text>
                    <Text style={styles.ruleText}>{`    3、分红所得收益可以在账单查看明细。`}</Text>
                    <Text style={styles.ruleText}>{`    4、分红股并不支持现金充值购买，保证所有用户公平性。`}</Text>
                    <View style={styles.ruleItem}>
                        <View style={styles.ruleItemCircle} />
                        <Text style={styles.ruleTitle}>温馨提示</Text>
                    </View>
                    <Text style={styles.ruleText}>
                        {`    1、分红股回收说明：超过7天未领取分红股将视为放弃分红股，平台将对其拥有的所有分红股进行回收。`}
                    </Text>
                    <Text style={styles.ruleText}>
                        {`    2、每天的分红奖励随着平台的广告收益波动，大家越活跃，就能为平台产品越高的收益，这样每股可得的分红也会越高。`}
                    </Text>
                </View>
            </ScrollView>
        </PageContainer>
    );
};

const yieldImageWidth = (Device.WIDTH - PxFit(Theme.itemSpace) * 3) / 2;

const styles = StyleSheet.create({
    bubbleWrap: { position: 'absolute' },
    button: {
        borderRadius: Device.WIDTH / 9,
        height: Device.WIDTH / 9,
        marginTop: -PxFit(Theme.itemSpace),
        width: Device.WIDTH / 2,
    },
    container: {
        flex: 1,
    },
    disabled: { opacity: 0.6 },
    graphContainer: {
        marginTop: PxFit(Theme.itemSpace * 2),
        paddingHorizontal: PxFit(Theme.itemSpace),
    },
    listItem: {
        alignItems: 'center',
        alignSelf: 'stretch',
        flex: 1,
        justifyContent: 'space-between',
    },
    listItemCount: {
        color: Theme.defaultTextColor,
        fontSize: PxFit(20),
        fontWeight: 'bold',
    },
    listItemName: {
        color: Theme.subTextColor,
        fontSize: PxFit(14),
        marginTop: PxFit(10),
    },
    listItemUnit: {
        color: '#464646',
        fontSize: PxFit(12),
    },
    moneyTree: {
        height: ((Device.WIDTH / 2) * 488) / 521,
        justifyContent: 'center',
        width: Device.WIDTH / 2,
    },
    moneyTreeContainer: {
        alignItems: 'center',
        paddingTop: PxFit(60),
    },
    overlay: { alignItems: 'center', justifyContent: 'center' },
    profitList: {
        flexDirection: 'row',
        paddingBottom: PxFit(30),
        paddingVertical: PxFit(15),
    },
    remindIcon: {
        height: PxFit(20),
        marginLeft: -(PxFit(20) * 0.15),
        marginRight: PxFit(2),
        width: PxFit(20),
    },
    resetCountDown: { marginVertical: PxFit(Theme.itemSpace * 2) },
    ruleContainer: {
        backgroundColor: '#F6F7F9',
        marginTop: PxFit(Theme.itemSpace),
        padding: PxFit(Theme.itemSpace),
    },
    ruleItem: {
        alignItems: 'center',
        flexDirection: 'row',
    },
    ruleItemCircle: {
        backgroundColor: Theme.secondaryColor,
        borderRadius: PxFit(8),
        height: PxFit(8),
        marginRight: PxFit(5),
        width: PxFit(8),
    },
    ruleText: {
        color: Theme.secondaryTextColor,
        fontSize: PxFit(14),
        lineHeight: PxFit(18),
        paddingVertical: PxFit(5),
    },
    ruleTitle: {
        color: Theme.defaultTextColor,
        fontSize: PxFit(14),
        fontWeight: 'bold',
        marginVertical: PxFit(5),
    },
    subTitle: {
        alignItems: 'center',
        flexDirection: 'row',
    },
    subTitleImage: {
        height: PxFit(16),
        marginRight: PxFit(5),
        width: PxFit(16),
    },
    subTitleText: {
        color: Theme.defaultTextColor,
        fontSize: PxFit(16),
        fontWeight: 'bold',
    },
    tipsText: {
        color: Theme.subTextColor,
        fontSize: PxFit(14),
        textAlign: 'right',
    },
    yieldCountText: {
        color: '#fff',
        fontSize: PxFit(22),
        fontWeight: 'bold',
    },
    yieldImage: {
        alignItems: 'center',
        borderRadius: PxFit(5),
        height: (yieldImageWidth * 270) / 500,
        justifyContent: 'center',
        overflow: 'hidden',
        width: yieldImageWidth,
    },
    yieldItem: {
        flexDirection: 'row',
        marginTop: PxFit(10),
    },
    yieldText: {
        color: '#fff',
        fontSize: PxFit(14),
        marginTop: PxFit(10),
    },
    yieldUnit: {
        fontSize: PxFit(14),
    },
});

export default Participation;
