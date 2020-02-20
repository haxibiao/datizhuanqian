import React, { useRef, useState, useMemo, useEffect, useCallback } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image, Animated } from 'react-native';
import { Theme, PxFit, SCREEN_WIDTH } from '@src/utils';
import { Iconfont, TouchFeedback } from '@src/components';
import { useLinearAnimation } from '@src/common';
import { app, config } from '@src/store';
import { useMutation, GQL } from '@src/apollo';
import { observer } from '@src/screens/answer/store';
import AuditResultOverlay from '@src/screens/answer/components/AuditResultOverlay';

const auditImage = {
    pending: require('@src/assets/images/auditing.png'),
    reject: require('@src/assets/images/audit_reject.png'),
    resolve: require('@src/assets/images/audited.png'),
};

type AuditStatus = 'pending' | 'reject' | 'resolve';

export default observer(({ store }) => {
    const { question, audited, auditQuestion } = store;
    const [auditStatus, setAuditStatus] = useState('pending');
    const [animation, startAnimation] = useLinearAnimation({ initValue: 0, duration: 300 });
    const [auditMutation] = useMutation(GQL.auditMutation, {
        variables: {
            question_id: question.id,
            status: auditStatus === 'resolve',
        },
        refetchQueries: () => [
            {
                query: GQL.UserMetaQuery,
                variables: { id: app.me.id },
                fetchPolicy: 'network-only',
            },
        ],
    });

    useEffect(() => {
        startAnimation();
    }, []);

    const animationStyle = useMemo(() => {
        return {
            opacity: animation,
            transform: [
                {
                    translateY: animation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-SCREEN_WIDTH / 3, 0],
                        extrapolate: 'clamp',
                    }),
                },
            ],
        };
    }, [animation]);

    const onAudit = useCallback(async (status: AuditStatus) => {
        setAuditStatus(status);
        AuditResultOverlay.show({});
        try {
            await auditMutation();
        } catch (errors) {
            const str = errors.toString().replace(/Error: GraphQL error: /, '');
            Toast.show({ content: str });
            setAuditStatus('pending');
        }
        auditQuestion();
    }, []);

    return (
        <Animated.View style={[styles.footerBar, animationStyle]}>
            <View style={[styles.opinionItem, styles.opinionItemLeft]}>
                <TouchFeedback
                    style={[styles.opinionItemButton, audited && { opacity: 0.7 }]}
                    disabled={audited}
                    onPress={() => onAudit('reject')}>
                    <Text style={[styles.opinionText, { color: Theme.errorColor, marginRight: PxFit(4) }]}>反对</Text>
                    <Image source={require('@src/assets/images/oppose.png')} style={styles.opinionImage} />
                </TouchFeedback>
            </View>
            <Image source={auditImage[auditStatus]} style={styles.statusImage} />
            <View style={[styles.opinionItem, styles.opinionItemRight]}>
                <TouchFeedback
                    style={[styles.opinionItemButton, audited && { opacity: 0.7 }]}
                    disabled={audited}
                    onPress={() => onAudit('resolve')}>
                    <Image source={require('@src/assets/images/approve.png')} style={styles.opinionImage} />
                    <Text style={[styles.opinionText, { marginLeft: PxFit(4) }]}>赞成</Text>
                </TouchFeedback>
            </View>
        </Animated.View>
    );
});

const styles = StyleSheet.create({
    footerBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    opinionItem: {
        position: 'absolute',
        height: PxFit(34),
        borderRadius: PxFit(17),
    },
    opinionItemLeft: {
        left: PxFit(-17),
        paddingLeft: PxFit(22),
        paddingRight: PxFit(9),
        backgroundColor: '#f0f0f0',
    },
    opinionItemButton: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    opinionItemRight: {
        right: PxFit(-17),
        paddingRight: PxFit(22),
        paddingLeft: PxFit(9),
        backgroundColor: Theme.correctColor,
    },
    opinionText: {
        fontSize: PxFit(14),
        color: '#fff',
        fontWeight: '500',
        letterSpacing: PxFit(4),
    },
    opinionImage: {
        width: PxFit(24),
        height: PxFit(24),
    },
    statusImage: { width: SCREEN_WIDTH / 3, height: SCREEN_WIDTH / 3 },
});