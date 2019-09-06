/*
 * @Author: Gaoxuan
 * @Date:   2019-03-20 17:55:53
 */

import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, ImageBackground, Animated, ActivityIndicator } from 'react-native';

import { Player, overlayView, TouchFeedback, PlaceholderImage, OverlayViewer, Iconfont } from 'components';
import { SCREEN_WIDTH, Theme, PxFit, Tools } from 'utils';
import ImageViewer from 'react-native-image-zoom-viewer';

let VIDEO_WIDTH = SCREEN_WIDTH - PxFit(Theme.itemSpace) * 2;

class QuestionBody extends Component {
    constructor(props) {
        super(props);
        this.state = {
            networkState: this.props.networkState,
        };
    }

    componentDidUpdate(nextProps) {
        if (nextProps.question !== this.props.question) {
            this.setState({ networkState: nextProps.networkState });
        }

        if (nextProps.networkState !== this.props.networkState) {
            if (!nextProps.networkState) {
                this.setState({ networkState: nextProps.networkState });
            }
        }
    }

    showPicture = url => {
        let overlayView = (
            <ImageViewer
                onSwipeDown={() => OverlayViewer.hide()}
                imageUrls={[{ url }]}
                enableSwipeDown
                saveToLocalByLongPress={false}
                loadingRender={() => {
                    return <ActivityIndicator size="large" color={'#fff'} />;
                }}
            />
        );
        OverlayViewer.show(overlayView);
    };

    showImage = image => {
        let { width, height } = image;
        let style = Tools.singleImageResponse(width, height, SCREEN_WIDTH - PxFit(60));
        return (
            <TouchFeedback
                style={{ marginTop: PxFit(Theme.itemSpace), overflow: 'hidden' }}
                onPress={() => this.showPicture(image.path)}>
                <PlaceholderImage style={style} source={{ uri: image.path }} />
                <View style={styles.amplification}>
                    <Iconfont name="fullScreen" size={PxFit(14)} color="#fff" />
                </View>
            </TouchFeedback>
        );
    };

    render() {
        const {
            question: { description, image, video, answer, gold },
            audit,
        } = this.props;
        return (
            <View style={styles.questionBody}>
                <View>
                    <Text style={styles.description}>
                        {`          ${description}`}
                        {!audit && gold > 0 && (
                            <Text style={{ color: Theme.primaryColor }}>
                                （{gold}*
                                <Iconfont name="diamond" size={PxFit(14)} color={Theme.primaryColor} />）
                            </Text>
                        )}
                    </Text>
                    <View
                        style={[
                            styles.questionType,
                            { backgroundColor: String(answer).length > 1 ? Theme.blue : Theme.primaryColor },
                        ]}>
                        <Text style={styles.answerType}>{String(answer).length > 1 ? '多选' : '单选'}</Text>
                    </View>
                </View>
                <View style={styles.contentStyle}>{image && this.showImage(image)}</View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    questionBody: {},
    description: {
        color: Theme.defaultTextColor,
        fontSize: PxFit(16),
        lineHeight: PxFit(22),
    },
    questionType: {
        position: 'absolute',
        top: 2,
        left: 0,
        width: PxFit(36),
        height: PxFit(18),
        borderTopLeftRadius: PxFit(9),
        borderBottomRightRadius: PxFit(9),

        justifyContent: 'center',
        alignItems: 'center',
    },
    answerType: {
        fontSize: PxFit(11),
        color: '#fff',
    },
    contentStyle: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    subject: {
        color: Theme.correctColor,
        fontSize: PxFit(16),
        lineHeight: PxFit(22),
        fontWeight: '500',
    },
    videoCover: {
        marginTop: PxFit(Theme.itemSpace),
        width: SCREEN_WIDTH - 60,
        height: (SCREEN_WIDTH * 9) / 16,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    img: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: SCREEN_WIDTH - 60,
        height: (SCREEN_WIDTH * 9) / 16,
    },
    amplification: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: PxFit(30),
        height: PxFit(18),
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
export default QuestionBody;
