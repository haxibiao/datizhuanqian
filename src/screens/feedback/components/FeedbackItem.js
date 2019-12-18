/*
 * @Author: Gaoxuan
 * @Date:   2019-03-22 13:29:29
 */

import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image, Dimensions } from 'react-native';
import { Iconfont, Avatar, UserTitle, GenderLabel, Row, TouchFeedback } from 'components';
import { Theme, Tools, PxFit } from 'utils';
import { app } from 'store';

class FeedbackItem extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { item, navigation } = this.props;
        return (
            <TouchableOpacity
                onPress={() => {
                    navigation.navigate('FeedbackDetails', { feedback_id: item.id });
                }}
                style={styles.container}>
                <View style={styles.top}>
                    <View style={styles.topLeft}>
                        <Avatar source={{ uri: item.user.avatar }} size={42} />
                        <View style={{ marginLeft: PxFit(8) }}>
                            <Text
                                style={{
                                    color: item.user.is_admin ? Theme.secondaryColor : Theme.black,
                                    marginBottom: PxFit(3),
                                }}>
                                {item.user.name}
                            </Text>
                            <Row>
                                <GenderLabel user={item.user} />
                                <UserTitle user={item.user} />
                            </Row>
                        </View>
                    </View>
                    {app.me.id == item.user.id ? (
                        <View style={styles.rightTextWrap}>
                            <Image source={require('@src/assets/images/diamond.png')} style={styles.rewardIcon} />
                            <Text style={{ fontSize: PxFit(11), color: '#FBB960' }}>+100</Text>
                            <Image
                                source={require('@src/assets/images/gongxian.png')}
                                style={{
                                    width: PxFit(13),
                                    height: PxFit(13),
                                    marginLeft: PxFit(5),
                                    marginRight: PxFit(3),
                                }}
                            />
                            <Text style={{ fontSize: PxFit(11), color: '#FBB960' }}>+10</Text>
                        </View>
                    ) : (
                        <View style={styles.rightTextWrap}>
                            <Text style={{ fontSize: PxFit(11), color: '#FBB960' }}>优质反馈</Text>
                        </View>
                    )}
                </View>
                <View style={styles.content}>
                    <Text style={styles.body} numberOfLines={3}>
                        {item.content}
                    </Text>
                    {this.renderImage(item.images.slice(0, 3))}
                </View>
                <View style={styles.footer}>
                    <View style={{ paddingBottom: PxFit(10) }}>
                        <Text style={styles.timeText}>{item.time_ago}</Text>
                    </View>
                    <View style={styles.footerRight}>
                        <View style={[styles.row, { marginRight: PxFit(50) }]}>
                            <Image source={require('../../../assets/images/hot_icon.png')} style={styles.commentIcon} />
                            <Text style={styles.commentText}>{item.hot}</Text>
                        </View>
                        <TouchFeedback style={styles.row}>
                            <Image
                                source={require('../../../assets/images/comment_icon.png')}
                                style={styles.commentIcon}
                            />
                            <Text style={styles.commentText}>{item.publish_comments_count || '评论'}</Text>
                        </TouchFeedback>
                    </View>
                </View>
                {/*<DivisionLine height={5} />*/}
            </TouchableOpacity>
        );
    }

    renderImage = images => {
        let images_length = images.length;
        let sizeArr = Tools.imgsLayoutSize(images_length, images);
        return (
            <View style={styles.images}>
                {images.map((image, index) => {
                    return <Image source={{ uri: image.path }} style={sizeArr[index]} key={index} />;
                })}
            </View>
        );
    };
}

const styles = StyleSheet.create({
    container: {
        borderBottomWidth: PxFit(0.5),
        borderBottomColor: Theme.lightBorder,
    },
    top: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: PxFit(15),
        paddingTop: PxFit(15),
        marginHorizontal: PxFit(15),
    },
    topLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rightTextWrap: {
        paddingHorizontal: PxFit(10),
        paddingVertical: PxFit(3),
        backgroundColor: '#FFF7E4',
        borderRadius: PxFit(20),
        flexDirection: 'row',
        alignItems: 'center',
    },
    rewardIcon: {
        width: PxFit(16),
        height: PxFit(16),
        marginLeft: PxFit(-2),
        marginRight: PxFit(3),
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    content: {
        marginLeft: PxFit(15),
        marginRight: PxFit(15),
        // paddingBottom: PxFit(10),
    },

    body: {
        fontSize: PxFit(16),
        lineHeight: PxFit(18),
        color: Theme.primaryFont,
    },
    images: {
        flexDirection: 'row',
        marginTop: PxFit(10),
    },
    text: {
        fontSize: PxFit(13),
        color: Theme.grey,
    },
    footer: {
        marginHorizontal: PxFit(15),
        paddingBottom: PxFit(15),
    },
    timeText: {
        color: '#CCD5E0',
        fontSize: PxFit(12),
        marginTop: PxFit(10),
    },
    footerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    commentIcon: {
        width: PxFit(18),
        height: PxFit(18),
    },
    commentText: {
        paddingLeft: PxFit(7),
        color: '#CCD5E0',
        fontSize: PxFit(13),
    },
});

export default FeedbackItem;
