import React, { useMemo, useEffect } from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import { TouchFeedback, Avatar } from '@src/components';
import { Theme, PxFit, Tools } from '@src/utils';
import { observer, useQuestionStore } from '@src/screens/answer/store';

export default observer(({ question }) => {
    const store = useQuestionStore();
    const { user, correct_count, count } = question;

    const askQuestionUser = useMemo(() => {
        if (user.id == 1) {
            return null;
        }
        return (
            <TouchFeedback style={styles.userItem} onPress={() => navigation.navigate('User', { user })}>
                <Avatar source={user.avatar} userId={user.id} size={PxFit(24)} />
                <Text style={styles.userName}>{user.name}</Text>
            </TouchFeedback>
        );
    }, [user]);

    const correctRate = useMemo(() => {
        if (count < 1) {
            return '暂无统计';
        }
        return ((correct_count / count) * 100).toFixed(1) + '%';
    }, [question]);

    if (Tools.NumberFormat(count) == 0) {
        return null;
    }

    return (
        <View style={styles.shadowView} elevation={20}>
            <View style={styles.wrap}>
                <View style={styles.analysisItem}>
                    <Text style={styles.itemName}>正确答案</Text>
                    <Text style={{ fontSize: PxFit(14), color: Theme.correctColor }}>{question.answer}</Text>
                </View>
                {askQuestionUser}
            </View>
            <View style={styles.wrap}>
                <View style={styles.analysisItem}>
                    <Text style={styles.itemName}>作答人数</Text>
                    <Text style={{ fontSize: PxFit(14), color: Theme.secondaryColor }}>
                        {Tools.NumberFormat(count)}
                    </Text>
                </View>
                <View style={styles.analysisItem}>
                    <Text style={styles.itemName}>正确率</Text>
                    <Text style={{ fontSize: PxFit(14), color: Theme.primaryColor }}>{correctRate}</Text>
                </View>
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    itemName: {
        color: Theme.secondaryTextColor,
        fontSize: PxFit(15),
        fontWeight: '500',
        marginBottom: PxFit(Theme.itemSpace),
    },
    shadowView: {
        backgroundColor: '#fff',
        borderRadius: PxFit(5),
        flexDirection: 'row',
        marginBottom: PxFit(20),
        padding: PxFit(Theme.itemSpace),
        shadowColor: '#b4b4b4',
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.3,
        shadowRadius: 1,
    },
    analysisItem: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
    },
    usersContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: PxFit(Theme.itemSpace),
    },
    userItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: PxFit(Theme.itemSpace),
    },
    userName: { fontSize: PxFit(13), color: Theme.defaultTextColor, paddingLeft: PxFit(6) },
});
