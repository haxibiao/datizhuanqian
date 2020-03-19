/*
 * @Author: Gaoxuan
 * @Date:   2019-03-22 13:18:57
 */

import React, { Component } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Button, PageContainer, CustomTextInput, ImagePickerViewer } from 'components';

import { withApollo, GQL } from 'apollo';

class Feedback extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content: '',
            pictures: [],
            titile: '',
            submitting: false,
        };
    }

    submitFeedback = async () => {
        const { navigation, client } = this.props;
        let { title, pictures, content } = this.state;
        this.setState({
            submitting: true,
        });

        let promises = [
            client.mutate({
                mutation: GQL.CreateFeedbackMutation,
                variables: {
                    title: title,
                    content: content,
                    images: pictures,
                },
            }),
            new Promise(function(resolve, reject) {
                setTimeout(() => reject(new Error('网络超时')), 30000);
            }),
        ];
        //超时检测

        Promise.race(promises)
            .then(result => {
                this.setState({
                    submitting: false,
                });
                Toast.show({ content: '反馈成功,有价值的反馈被审核通过后可获得奖励哦！' });
                navigation.navigate('FeedbackDetails', {
                    feedback_id: result.data.createFeedback.id,
                });
                this._imagePickerViewer && this._imagePickerViewer.removeAllPicture();
                this.setState({
                    pictures: [],
                    content: '',
                });
            })
            .catch(rejected => {
                this.setState({
                    submitting: false,
                });
                let str = rejected.toString().replace(/Error: GraphQL error: /, '');
                Toast.show({ content: str });
            });
    };

    render() {
        let { content, submitting } = this.state;
        return (
            <PageContainer hiddenNavBar tabLabel="意见反馈" submitting={submitting} autoKeyboardInsets={false}>
                <ScrollView style={styles.container} keyboardShouldPersistTaps={'always'}>
                    <View style={styles.main}>
                        <CustomTextInput
                            style={styles.input}
                            maxLength={140}
                            placeholder={'请简要描述您的问题和意见,我们将为您不断改进'}
                            multiline
                            underline
                            textAlignVertical={'top'}
                            defaultValue={content}
                            onChangeText={value => {
                                this.setState({
                                    content: value,
                                });
                            }}
                        />
                        <View style={{ marginLeft: PxFit(Theme.itemSpace) }}>
                            <ImagePickerViewer
                                ref={ref => (this._imagePickerViewer = ref)}
                                onResponse={images => {
                                    this.setState({ pictures: images });
                                }}
                            />
                        </View>
                    </View>
                    <Button title={'提交'} style={styles.button} onPress={this.submitFeedback} disabled={!content} />
                </ScrollView>
            </PageContainer>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.white,
    },
    main: {
        paddingVertical: PxFit(15),
        marginBottom: PxFit(15),
        borderBottomWidth: PxFit(1),
        borderBottomColor: Theme.lightBorder,
    },
    input: {
        backgroundColor: 'transparent',
        fontSize: PxFit(15),
        padding: 0,
        height: PxFit(200),
        paddingHorizontal: PxFit(20),
        justifyContent: 'flex-start',
    },
    button: {
        height: PxFit(42),
        marginHorizontal: PxFit(20),
        marginBottom: PxFit(20),
        backgroundColor: Theme.primaryColor,
    },
});

export default withApollo(Feedback);
