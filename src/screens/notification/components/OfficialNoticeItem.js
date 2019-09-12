/*
 * @Author: Gaoxuan
 * @Date:   2019-03-25 13:55:51
 */

//TODO:通知待完善

import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image } from 'react-native';
import { Iconfont, TouchFeedback } from 'components';
import { Theme, PxFit, Tools, SCREEN_WIDTH } from 'utils';

class OfficialNoticeItem extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { navigation, user, notice } = this.props;
        console.log('notice', notice);
        return (
            <View>
                <View style={{ alignItems: 'center', paddingVertical: 5, marginTop: 15 }}>
                    <Text style={{ fontSize: 13, color: Theme.subTextColor }}>{notice.created_at}</Text>
                </View>
                <View style={styles.container}>
                    <View>
                        <Image source={require('../../../assets/images/official-notice.png')} style={styles.img} />
                    </View>
                    <TouchFeedback style={styles.content} onPress={() => navigation.navigate(notice.route, { notice })}>
                        <View style={styles.header}>
                            <Text>{notice.title}</Text>
                        </View>
                        <View style={styles.body}>
                            <Text style={styles.text}>{notice.content}</Text>
                        </View>
                    </TouchFeedback>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingHorizontal: 15,
    },
    img: {
        width: PxFit(40),
        height: PxFit(40),
        borderRadius: PxFit(20),
        justifyContent: 'center',
        alignItems: 'center',
        resizeMode: 'cover',
    },
    content: {
        marginLeft: 10,
        backgroundColor: '#FFF',
        width: SCREEN_WIDTH - 80,
        borderRadius: 5,
    },
    header: {
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: Theme.lightGray,
    },
    body: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: Theme.lightGray,
    },
    text: {
        fontSize: 13,
        color: Theme.subTextColor,
        lineHeight: 18,
    },
});

export default OfficialNoticeItem;
