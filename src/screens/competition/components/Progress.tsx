import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

interface Props {
    questions: Array<object>;
    index: any;
}

const Progress = (props: Props) => {
    const { questions, index } = props;

    return (
        <View style={styles.container}>
            <View
                style={{
                    height: PxFit(16),
                    width: Device.WIDTH - PxFit(65),
                    backgroundColor: 'rgba(110,148,247,0.4)',
                    borderRadius: PxFit(8),
                }}>
                <View
                    style={{
                        height: PxFit(16),
                        width: ((Device.WIDTH - PxFit(65)) * (index + 1)) / questions.length || 1,
                        backgroundColor: '#F5D461',
                        borderRadius: PxFit(8),
                    }}></View>
            </View>
            <Text style={{ color: Theme.white }}>{`${index + 1}/${questions.length}`}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: PxFit(15),
        marginTop: PxFit(20),
    },
});

export default Progress;
