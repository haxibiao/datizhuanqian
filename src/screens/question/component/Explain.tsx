import React, { useMemo } from 'react';
import { StyleSheet, View, Text, Image, TouchableWithoutFeedback } from 'react-native';
import { TouchFeedback, Row, VideoMark } from '@src/components';
import { Theme, PxFit, SCREEN_WIDTH } from '@src/utils';
import { observer, useQuestionStore } from '@src/screens/answer/store';
import { useNavigation } from 'react-navigation-hooks';

const MEDIA_WIDTH = SCREEN_WIDTH - PxFit(Theme.itemSpace) * 2 - PxFit(12) * 2;

export default ({ explanation }) => {
    const navigation = useNavigation();
    const content = useMemo(() => {
        const explain = {};
        explain.video = Tools.syncGetter('video', explanation);
        explain.text = Tools.syncGetter('content', explanation);
        explain.image = Tools.syncGetter('images.0.path', explanation);
    }, [explanation]);

    return (
        <View style={styles.shadowView} elevation={10}>
            <View style={styles.shadowTitle}>
                <Row>
                    <View style={styles.yellowDot} />
                    <Text style={styles.title}>视频解析</Text>
                </Row>
            </View>
            {content.text ? <Text style={styles.explainText}>{'   ' + content.text}</Text> : null}
            {content.picture && (
                <TouchFeedback onPress={() => this.showPicture(picture)}>
                    <Image source={{ uri: content.picture }} style={styles.imageCover} />
                </TouchFeedback>
            )}
            {content.video && (
                <TouchableWithoutFeedback
                    onPress={() => navigation.navigate('VideoExplanation', { video: content.video })}>
                    <View style={styles.mediaWrap}>
                        <Image source={require('../../../assets/images/video_explain.jpg')} style={styles.imageCover} />
                        <VideoMark size={PxFit(60)} />
                    </View>
                </TouchableWithoutFeedback>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    shadowView: {
        marginBottom: PxFit(20),
        padding: PxFit(12),
        borderRadius: PxFit(5),
        backgroundColor: '#fff',
        shadowColor: '#b4b4b4',
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowRadius: 1,
        shadowOpacity: 0.3,
    },
    shadowTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: PxFit(Theme.itemSpace),
    },
    yellowDot: {
        marginRight: PxFit(6),
        width: PxFit(6),
        height: PxFit(6),
        borderRadius: PxFit(3),
        backgroundColor: Theme.primaryColor,
    },
    title: {
        fontSize: PxFit(14),
        color: Theme.defaultTextColor,
    },
    mediaWrap: {
        width: MEDIA_WIDTH,
        height: MEDIA_WIDTH * 0.6,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageCover: {
        position: 'absolute',
        width: null,
        height: null,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    explainText: {
        marginTop: PxFit(Theme.itemSpace),
        fontSize: PxFit(16),
        lineHeight: PxFit(24),
        color: Theme.defaultTextColor,
    },
});
