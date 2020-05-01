import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { TouchFeedback, SafeText } from '@src/components';

interface Props {
    close: Function;
    onConfirm: Function;
}

const LeaveGameOverlay = (props: Props) => {
    const { close, onConfirm } = props;
    return (
        <View style={styles.overlayInner}>
            <SafeText style={styles.headerText}>提示</SafeText>
            <SafeText style={styles.contentText}>退出将视为放弃比赛，是否离开？</SafeText>
            <View style={styles.modalFooter}>
                <TouchFeedback style={styles.operation} onPress={close}>
                    <Text style={styles.operationText}>取消</Text>
                </TouchFeedback>
                <TouchFeedback style={[styles.operation, styles.border]} onPress={onConfirm}>
                    <Text style={[styles.operationText, styles.confirmText]}>离开</Text>
                </TouchFeedback>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    border: {
        borderLeftColor: Theme.tintGray,
        borderLeftWidth: 1,
    },
    confirmText: {
        color: Theme.confirmColor,
    },
    contentText: {
        color: Theme.defaultTextColor,
        fontSize: PxFit(15),
        marginVertical: PxFit(20),
        paddingHorizontal: PxFit(15),
        textAlign: 'center',
    },
    headerText: {
        color: Theme.defaultTextColor,
        fontSize: PxFit(18),
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalFooter: {
        borderTopColor: Theme.tintGray,
        borderTopWidth: PxFit(0.5),
        flexDirection: 'row',
    },
    operation: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: PxFit(15),
    },
    operationText: {
        color: Theme.grey,
        fontSize: PxFit(15),
    },
    overlayInner: {
        backgroundColor: '#fff',
        borderRadius: PxFit(5),
        padding: 0,
        paddingTop: PxFit(15),
        width: Percent(80),
    },
});

export default LeaveGameOverlay;
