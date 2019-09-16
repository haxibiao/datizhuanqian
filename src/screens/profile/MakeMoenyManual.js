import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { PageContainer, TouchFeedback } from 'components';
import { Theme, PxFit, Config, SCREEN_WIDTH } from 'utils';
import ManualOverlay from './components/ManualOverlay';

class MakeMoenyManual extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tabs: ['新人必看', '提现问题', '贡献点问题', '账号问题', '邀请好友问题', '其他问题'],
            items: [
                {
                    title: '新人必看',
                    childItems: [
                        {
                            title: '什么是智慧点？',
                            content: `智慧点是${Config.AppName}用户的虚拟积分，可以兑换一定数量的红包、购买专区免广告服务。`,
                        },
                        {
                            title: '如何获取更多智慧点？',
                            content:
                                '除了新人福利，您还可以通过以下途径获得更多的智慧点提现：在精力点足够的情况下，您可以通过答题、出题获取智慧点。\n新人任务：您可以在【任务】-【新人任务】模块完善年龄、完善性别、上传新头像、修改昵称等任务来获取智慧点。\n激励任务：您可以在【任务】-【看视频赚钱】模块通过看激励视频、点击下载、查看详情来获取智慧点、精力点及贡献点。\n分享给好友：您可以在【任务】-【分享领现金】内参与分享活动，每成功邀请一位好友，可获得600智慧点和36贡献点的奖励，邀请越多奖励越多',
                        },
                        {
                            title: '什么是精力点？',
                            content:
                                '精力点是控制答题和出题获取奖励的虚拟道具，拥有精力点时，答题、审题、出题，才会给予智慧点、贡献奖励。如果没有精力点，答题将不再奖励智慧点。',
                        },
                        {
                            title: '如何获取精力点？',
                            content:
                                '每个账号默认会有180点精力点，根据等级的提升会增加精力点上限，同时每天会重置精力点数,做任务也可以恢复精力点哦',
                        },
                        {
                            title: '如何获取经验值？',
                            content:
                                '经验值能够影响用户的等级，经验值可以通过答题、审题、出题等获取。获取经验值会提升等级、增加精力点上限。享受更多荣誉和权益。',
                        },
                    ],
                },
                {
                    title: '提现问题',
                    childItems: [
                        {
                            title: '如何提现？提现的标准是什么？',
                            content:
                                '只有当您绑定支付宝账号之后，才能开始提现。提现金额分为1元、3元、5元、10元四档，每次提现时会扣除乘以汇率的智慧点，剩余智慧点可以在下次满足最低提现额度时申请提现',
                        },
                        { title: '提现多久到账？', content: '提现24小时内到账(如遇提现高峰，提现到账时间会延长)。' },
                        {
                            title: '提现不了、提现失败怎么办？',
                            content:
                                '请先检查您的网络是否正常以及APP是否是最新版本或尝试重新登录。若提示提现失败，请检查支付宝账号姓名与APP内所填账号姓名是否一致，或【我的】-【我的账单】内点击提现详情查看【回执信息】并按照提示操作。若还不能解决，请在意见反馈里提交，我们会在第一时间为您解决。',
                        },
                        {
                            title: '被限制提现怎么办？',
                            content: `一个人名下只能绑定一个支付宝提现，同一人使用多个账号提现,系统将判定涉嫌恶意刷取智慧点，${Config.AppName}官方将限制提现功能。`,
                        },
                        { title: '如何提升提现额度？', content: '提升贡献值即可提升提现额度' },
                    ],
                },
                {
                    title: '贡献点问题',
                    childItems: [
                        {
                            title: '什么是贡献点？',
                            content: `贡献值代表用户对${Config.AppName}创建良好用户环境所做的贡献，为保证社区用户环境良好，提现时需要考核用户的贡献值。`,
                        },
                        {
                            title: '如何获取贡献点？',
                            content:
                                '贡献值可以通过举报违反出题规则的题目、做激励任务、发布有价值的神评论(被点赞)等方式获取。',
                        },
                    ],
                },
                {
                    title: '账号问题',
                    childItems: [
                        {
                            title: '如何绑定、更换支付宝？',
                            content:
                                '若您还未绑定支付宝，可以在提现页下方根据提示点击【去绑定支付宝账号】绑定即可。若您已绑定支付宝，可以在【我的】-【设置】-【账号安全】内进行更改支付宝账号',
                        },
                        {
                            title: '绑定支付宝是否有风险？',
                            content:
                                '绑定支付宝账户只是为了方便给您转账哦，除了您的支付宝账户，我们不会获取您支付宝的任何信息，完全不用担心会有风险哦',
                        },
                        {
                            title: '如何绑定微信？',
                            content:
                                '您在登录答题赚钱时，可以选择微信授权登录或者手机注册。或者在【我的】-【设置】-【账号安全】处进行绑定。',
                        },
                        {
                            title: '忘记密码怎么办？',
                            content: '您可以根据自己绑定的手机号码或者邮箱地址来找回密码或更改密码哦。',
                        },
                    ],
                },
                {
                    title: '邀请好友问题',
                    childItems: [
                        {
                            title: '如何邀请好友并获得奖励？有哪些奖励？',
                            content:
                                '1.每成功邀请一位新用户下载并使用APP，您将获得600智慧点和36贡献点的奖励，您可以将活动页面通过微信、QQ、微博等方式分享给好友，好友下载注册登录APP您将获得奖励，同时您邀请的好友登录后也将获得新人福利智慧点奖励，邀请好友人数无上限，邀请越多奖励越多。',
                        },
                        {
                            title: '什么是无效邀请？为什么我邀请好友没有奖励是否有风险？',
                            content:
                                '您邀请的好友必须是答题赚钱新用户才能邀请成功，即手机号/支付宝/QQ邮箱均未注册登录使用过答题赚钱APP，同一个手机号、同一个设备或同一个提现账号都视为一个用户，每个新用户只能被邀请一次，已经被他人邀请过的好友不能重复邀请。',
                        },
                    ],
                },
                {
                    title: '其他问题',
                    childItems: [
                        {
                            title: '题目出现问题怎么办？',
                            content: '请重新启动APP或卸载重新安装，如果还未解决请向我们反馈哦',
                        },
                        {
                            title: '无法答题或查看信息怎么办法？',
                            content: '请重新启动APP或卸载重新安装，如果还未解决请向我们反馈哦',
                        },
                        { title: '无法更新怎么办？', content: '可以到www.datizhuanqian.com下载最新安装包哦' },
                    ],
                },
            ],
            select: 0,
        };
    }

    render() {
        const { tabs, select, items } = this.state;
        return (
            <PageContainer title="赚钱攻略" white>
                <View style={styles.header}>
                    {tabs.map((tab, index) => {
                        return (
                            <TouchFeedback
                                style={[
                                    styles.tab,
                                    select === index && {
                                        backgroundColor: '#FFF2EB',
                                    },
                                ]}
                                key={index}
                                onPress={() => {
                                    this.setState({
                                        select: index,
                                    });
                                    this.scrollRef.scrollToIndex({ index: index, animated: true });
                                }}>
                                <Text
                                    style={{
                                        color: select === index ? '#FFA200' : '#363636',
                                    }}>
                                    {tab}
                                </Text>
                            </TouchFeedback>
                        );
                    })}
                </View>
                <FlatList
                    ref={ref => (this.scrollRef = ref)}
                    style={styles.list}
                    showsVerticalScrollIndicator={false}
                    data={items}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => {
                        return (
                            <View style={{ marginTop: 20 }}>
                                <Text style={{ fontSize: 20 }}>{item.title}</Text>
                                {item.childItems.map((data, index) => {
                                    return (
                                        <TouchFeedback
                                            key={index}
                                            style={styles.childItems}
                                            onPress={() => {
                                                ManualOverlay.show(data.title, data.content);
                                            }}>
                                            <Text>{data.title}</Text>
                                        </TouchFeedback>
                                    );
                                })}
                            </View>
                        );
                    }}
                />
            </PageContainer>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        // justifyContent: 'space-between',
        flexWrap: 'wrap',
        paddingRight: PxFit(15),
        paddingLeft: PxFit(5),
        paddingBottom: PxFit(15),
        borderBottomColor: Theme.lightBorder,
        borderBottomWidth: PxFit(0.5),
    },
    tab: {
        width: (SCREEN_WIDTH - PxFit(50)) / 3,
        paddingVertical: 10,
        backgroundColor: '#F0F0F0',
        borderRadius: 20,
        marginTop: PxFit(15),
        marginLeft: PxFit(10),
        justifyContent: 'center',
        alignItems: 'center',
    },
    list: {
        borderTopWidth: 0.5,
        borderTopColor: Theme.lightBorder,
        paddingHorizontal: PxFit(15),
    },

    childItems: {
        borderBottomWidth: 0.5,
        borderBottomColor: Theme.lightBorder,
        paddingVertical: PxFit(10),
    },
});

export default MakeMoenyManual;
