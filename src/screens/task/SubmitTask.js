/*
 * @Author: Gaoxuan
 * @Date:   2019-03-21 13:14:13
 */

import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, Image, Keyboard, Linking } from 'react-native';
import {
    Button,
    Iconfont,
    PageContainer,
    CustomTextInput,
    SubmitLoading,
    TouchFeedback,
    DropdownMenu,
    Row,
} from 'components';

import { Theme, PxFit, SCREEN_WIDTH, Api, Config } from 'utils';

import { graphql, compose, withApollo, GQL } from 'apollo';

import { BoxShadow } from 'react-native-shadow';

const arr = {};

class SubmitTaskScreen extends Component {
    constructor(props) {
        super(props);
        this.appstores = ['OPPO', 'VIVO', '小米', '华为', '魅族', '百度', '豌豆荚', '应用宝'];
        this.state = {
            content: null,
            pictures: [],
            images: [],
            isVisible: false,
            appstore: null,
        };
    }

    // 打开相册
    openPhotos = () => {
        Api.imagePicker(
            images => {
                const { pictures } = this.state;
                images.map(image => {
                    pictures.push(`data:${image.mime};base64,${image.data}`);
                });
                if (pictures.length > 6) {
                    this.setState({
                        pictures: pictures.slice(0, 6),
                    });
                    Methods.toast('最多选择6张图片', -50);
                } else {
                    this.setState({
                        pictures,
                    });
                }
            },
            { includeBase64: true },
        );
    };

    // 上传图片
    startUploadImage = async () => {
        const { pictures } = this.state;
        const { client } = this.props;

        Keyboard.dismiss();
        this.setState({
            isVisible: true,
        });
        // 等待提示

        const promises = [
            client.mutate({
                mutation: GQL.UploadImage,
                variables: {
                    image: pictures,
                },
            }),
            new Promise(function(resolve, reject) {
                setTimeout(() => reject(new Error('网络超时')), 30000);
            }),
        ];
        // 超时检测

        Promise.race(promises)
            .then(result => {
                this.submitTask(result.data.uploadImage);
            })
            .catch(rejected => {
                this.setState({
                    isVisible: false,
                });

                const str = rejected.toString().replace(/Error: GraphQL error: /, '');
                Methods.toast(str, -100);
            });
    };

    // 提交任务
    async submitTask(images) {
        const { navigation } = this.props;
        const { task } = navigation.state.params;
        const { appstore, content } = this.state;
        let result = {};

        arr.screenshots = images;
        arr.content = appstore + '(' + content + ')';
        try {
            result = await this.props.ReplyTaskMutation({
                variables: {
                    task_id: task.id,
                    content: arr,
                },
                errorPolicy: 'all',
                refetchQueries: () => [
                    {
                        query: GQL.TasksQuery,
                    },
                ],
            });
        } catch (ex) {
            result.errors = ex;
        }
        if (result && result.errors) {
            this.setState({
                isVisible: false,
            });
            let str = result.errors[0].message;
            Toast.show({ content: str });
        } else {
            this.setState({
                isVisible: false,
            });
            Toast.show({ content: '提交成功,工作人员会尽快审核您的答复信息' });
            this.props.navigation.goBack();
        }
    }

    dropHandler = name => {
        this.setState({ appstore: name });
        console.log('name', name);
    };

    render() {
        const { content, pictures, isVisible, appstore } = this.state;
        const { navigation } = this.props;
        const { task } = navigation.state.params;
        return (
            <PageContainer
                navBarStyle={{
                    borderBottomWidth: 0,
                    borderBottomColor: '#fff',
                    backgroundColor: '#fff',
                }}
                titleStyle={{ color: Theme.defaultTextColor }}
                backButtonColor={Theme.defaultTextColor}
                title="提交任务">
                <ScrollView style={styles.container} keyboardShouldPersistTaps={'always'}>
                    <BoxShadow
                        setting={Object.assign({}, shadowOpt, {
                            height: PxFit(48),
                        })}>
                        <View style={styles.header}>
                            <View>
                                <Text style={{}}>{task.details}</Text>
                            </View>
                            <TouchFeedback
                                style={styles.row}
                                onPress={() => Linking.openURL('market://details?id=' + Config.PackageName)}>
                                <Text style={{ fontSize: 12, color: Theme.grey }}>去应用商店评价</Text>
                                <Iconfont name="right" size={PxFit(14)} color={Theme.grey} />
                            </TouchFeedback>
                        </View>
                    </BoxShadow>
                    <DropdownMenu
                        style={{ marginTop: PxFit(20) }}
                        dropStyle={{
                            paddingHorizontal: PxFit(20),
                            borderBottomWidth: PxFit(0.5),
                            borderColor: Theme.borderColor,
                            justifyContent: 'space-between',
                        }}
                        dropItemStyle={{ alignItems: 'flex-end' }}
                        lables={[appstore ? appstore : '请选择应用商店']}
                        lable={<Text style={styles.lableText}>应用商店</Text>}
                        bgColor={'white'}
                        tintColor={'#666666'}
                        activityTintColor={Theme.primaryColor}
                        handler={(selection, row) => this.dropHandler(this.appstores[row])}
                        data={this.appstores}>
                        <View style={styles.main}>
                            <View
                                style={{
                                    paddingVertical: PxFit(14),
                                    borderBottomWidth: PxFit(0.5),
                                    borderColor: Theme.borderColor,
                                }}>
                                <CustomTextInput
                                    style={styles.input}
                                    placeholder={'应用商店账号(手机号或邮箱)'}
                                    multiline
                                    underline
                                    textAlignVertical={'top'}
                                    defaultValue={content}
                                    onChangeText={value => {
                                        this.setState({
                                            content: value,
                                        });
                                    }}
                                />
                            </View>

                            <View style={styles.center}>
                                <Text style={{ fontSize: PxFit(16), color: Theme.primaryFont }}>评论内容截图</Text>
                                <Text style={{ fontSize: PxFit(15), color: Theme.grey }}>（{pictures.length}/6）</Text>
                            </View>
                            <View style={styles.images}>
                                {pictures.map((image, index) => {
                                    return (
                                        <View key={index}>
                                            <Image source={{ uri: image }} style={styles.image} />
                                            <TouchableOpacity
                                                style={styles.delete}
                                                onPress={() => {
                                                    pictures.splice(index, 1);
                                                    this.setState({
                                                        pictures,
                                                    });
                                                }}>
                                                <Iconfont name={'close'} size={12} color={Theme.white} />
                                            </TouchableOpacity>
                                        </View>
                                    );
                                })}

                                {!(pictures.length > 5) && (
                                    <TouchableOpacity style={styles.add} onPress={this.openPhotos}>
                                        <Iconfont name={'add'} size={26} color={Theme.tintGray} />
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>

                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Button
                                title={<Text style={{ color: Theme.white, fontSize: PxFit(15) }}>提交</Text>}
                                style={styles.button}
                                onPress={this.startUploadImage}
                                disabled={!(pictures.length > 0 && content && appstore)}
                                // disabled={!(pictures.length > 0 && content)}
                                //提交的时候再上传图片
                            />
                        </View>
                    </DropdownMenu>
                </ScrollView>

                <SubmitLoading isVisible={isVisible} content={'提交中...'} />
            </PageContainer>
        );
    }
}

const shadowOpt = {
    width: SCREEN_WIDTH,
    color: '#E8E8E8',
    border: 10,
    // radius: 10,
    opacity: 0.4,
    x: 0,
    y: 10,
    style: {
        marginTop: 0,
    },
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.white,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 60,
        paddingLeft: 18,
        paddingRight: 12,
        backgroundColor: '#fff',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerLeft: {
        height: PxFit(22),
        width: PxFit(10),
        backgroundColor: Theme.primaryColor,
        marginRight: PxFit(15),
    },
    headerContent: {
        color: Theme.primaryFont,
        fontSize: PxFit(16),
    },
    main: {
        paddingBottom: PxFit(15),
        marginBottom: PxFit(15),
        borderBottomWidth: PxFit(1),
        borderBottomColor: Theme.lightBorder,
    },
    center: {
        marginHorizontal: PxFit(25),
        paddingVertical: PxFit(20),
        flexDirection: 'row',
        alignItems: 'center',
    },
    images: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginLeft: PxFit(25),
    },
    input: {
        backgroundColor: 'transparent',
        fontSize: PxFit(14),
        padding: 0,
        height: PxFit(20),
        paddingHorizontal: PxFit(20),
        justifyContent: 'flex-start',
    },
    add: {
        width: (SCREEN_WIDTH - PxFit(60)) / 4,
        height: (SCREEN_WIDTH - PxFit(60)) / 4,
        borderColor: Theme.lightBorder,
        borderWidth: PxFit(1),
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: (SCREEN_WIDTH - PxFit(60)) / 3,
        height: (SCREEN_WIDTH - PxFit(60)) / 3,
        marginRight: PxFit(5),
        marginBottom: PxFit(5),
    },
    delete: {
        backgroundColor: 'rgba(150,150,150,0.5)',
        borderRadius: PxFit(8),
        position: 'absolute',
        right: PxFit(8),
        top: PxFit(2),
        width: PxFit(16),
        height: PxFit(16),
        justifyContent: 'center',
        alignItems: 'center',
    },
    mainBottom: {
        borderBottomWidth: PxFit(1),
        borderBottomColor: Theme.lightBorder,
        marginRight: PxFit(15),
        marginTop: PxFit(30),
    },
    button: {
        height: PxFit(42),
        marginBottom: PxFit(20),
        borderRadius: PxFit(19),
        backgroundColor: Theme.primaryColor,
        maxWidth: SCREEN_WIDTH - PxFit(50),
    },
});

export default compose(graphql(GQL.ReplyTaskMutation, { name: 'ReplyTaskMutation' }))(withApollo(SubmitTaskScreen));
