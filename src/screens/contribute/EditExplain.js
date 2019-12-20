import React, { useCallback } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native';
import { PageContainer, TouchFeedback, Iconfont, Row, CustomTextInput, KeyboardSpacer, Button } from 'components';
import { Theme, PxFit, SCREEN_WIDTH, SCREEN_HEIGHT, Tools } from 'utils';
import ContributeStore from './ContributeStore';
import MediaSelect from './components/MediaSelect';
import { observer, app } from 'store';
import { Provider } from 'mobx-react';

export default observer(props => {
    const store = new ContributeStore();
    const { explain_text, inputQuestionExplain } = store;

    const onPress = useCallback(() => {
        props.navigation.goBack();
    }, []);

    return (
        <Provider contributeStore={store}>
            <PageContainer white title="题目解析">
                <ScrollView style={styles.container}>
                    <View style={styles.inputContainer}>
                        <CustomTextInput
                            style={styles.explainInput}
                            value={explain_text}
                            multiline
                            textAlignVertical="top"
                            onChangeText={inputQuestionExplain}
                            placeholder="请填写题目解析......"
                        />
                        <View>
                            <Text
                                style={{
                                    fontSize: PxFit(13),
                                    color: Theme.secondaryTextColor,
                                    marginBottom: PxFit(10),
                                }}>
                                * 插入图片或者视频
                            </Text>
                            <MediaSelect type="explain_" />
                        </View>
                    </View>

                    <Button onPress={onPress} title="确认" style={styles.button} titleStyle={styles.buttonText} />
                </ScrollView>
            </PageContainer>
        </Provider>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.groundColour,
    },
    inputContainer: {
        marginBottom: PxFit(Theme.itemSpace),
        padding: PxFit(10),
        backgroundColor: '#fff',
    },
    explainInput: {
        height: PxFit(120),
        paddingHorizontal: PxFit(10),
        paddingTop: PxFit(10),
        borderWidth: PxFit(1),
        borderRadius: PxFit(5),
        borderColor: Theme.borderColor,
        justifyContent: 'center',
        marginBottom: PxFit(Theme.itemSpace),
    },
    button: {
        margin: PxFit(Theme.itemSpace),
        height: PxFit(40),
        borderRadius: PxFit(5),
        backgroundColor: Theme.primaryColor,
    },
    buttonText: {
        fontSize: PxFit(17),
        color: '#fff',
    },
});
