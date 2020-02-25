import React from 'react';
import { StyleSheet, View, Text, DeviceEventEmitter } from 'react-native';
import { TouchFeedback, Row, Iconfont } from '@src/components';
import { Theme, PxFit, Tools } from '@src/utils';
import { observer } from 'mobx-react';
import { Overlay } from 'teaset';

let OverlayKey: any = null;

interface Props {
    transcript: any;
    category: object;
    store: any;
    navigation: any;
    scrollTo: Function;
}

export const AnswerCard = observer(({ transcript, category, store, navigation, scrollTo }) => {
    return (
        <View style={styles.actionSheetView}>
            <View style={styles.header}>
                <Text style={styles.title}>答题卡</Text>
                <TouchFeedback style={styles.close} onPress={hide}>
                    <Iconfont name="close" size={PxFit(20)} color={Theme.defaultTextColor} />
                </TouchFeedback>
            </View>
            <View style={styles.container}>
                <View>
                    <View>
                        <Text style={{ fontSize: PxFit(16), color: 'black' }}>{category.name}</Text>
                    </View>
                    <Row style={styles.transcript}>
                        {transcript.map((result: string, index: number) => {
                            let backgroundColor = Theme.lightBorder;
                            if (result !== undefined) {
                                backgroundColor = '#45B7FF';
                            }
                            return (
                                <View style={styles.questionWrap} key={index}>
                                    <TouchFeedback
                                        onPress={() => {
                                            scrollTo(index);
                                            hide();
                                        }}
                                        style={[
                                            styles.question,
                                            {
                                                backgroundColor,
                                            },
                                        ]}>
                                        <Text style={styles.questionText}>{index + 1}</Text>
                                    </TouchFeedback>
                                </View>
                            );
                        })}
                    </Row>
                </View>
                <TouchFeedback
                    style={styles.button}
                    onPress={() => {
                        DeviceEventEmitter.emit('submitAnswer');
                        navigation.replace('ExamResult', { category, transcript, store });
                        hide();
                    }}>
                    <Text style={styles.buttonText}>提交练习</Text>
                </TouchFeedback>
            </View>
        </View>
    );
});

export const show = (props: Props) => {
    const overlayView = (
        <Overlay.PullView containerStyle={{ backgroundColor: Theme.white, borderRadius: PxFit(10) }} animated>
            <AnswerCard {...props} />
        </Overlay.PullView>
    );
    OverlayKey = Overlay.show(overlayView);
};

export const hide = () => {
    Overlay.hide(OverlayKey);
};

const styles = StyleSheet.create({
    actionSheetView: {
        marginBottom: Theme.HOME_INDICATOR_HEIGHT,
        overflow: 'hidden',
        paddingHorizontal: PxFit(15),
        height: Device.HEIGHT / 2,
    },
    close: {
        alignItems: 'center',
        bottom: 0,
        height: PxFit(44),
        justifyContent: 'center',
        position: 'absolute',
        right: 0,
        top: 6,
        width: PxFit(44),
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
    },
    title: {
        fontSize: PxFit(18),
        color: 'black',
    },
    container: {
        flex: 1,
        justifyContent: 'space-between',
    },
    transcript: {
        flexWrap: 'wrap',
        paddingVertical: PxFit(15),
    },
    questionWrap: {
        width: (Device.WIDTH - PxFit(30)) * 0.2,
        height: (Device.WIDTH - PxFit(30)) * 0.2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    question: {
        backgroundColor: '#45B7FF',
        height: PxFit(40),
        width: PxFit(40),
        borderRadius: PxFit(20),
        alignItems: 'center',
        justifyContent: 'center',
    },
    questionText: {
        color: 'white',
        fontSize: PxFit(15),
    },
    button: {
        height: PxFit(42),
        borderRadius: PxFit(34),
        width: Device.WIDTH - PxFit(30),
        backgroundColor: '#45B7FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: PxFit(10),
    },
    buttonText: {
        color: Theme.white,
        fontSize: PxFit(16),
    },
});

export default { show, hide };
