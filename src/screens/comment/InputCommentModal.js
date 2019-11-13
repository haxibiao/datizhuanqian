/*
 * @flow
 * created by wyk made in 2019-05-10 22:42:25
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Theme, PxFit, SCREEN_WIDTH, SCREEN_HEIGHT, ISIOS, Tools } from 'utils';
import { KeyboardSpacer } from 'components';

import Modal from 'react-native-modal';
import CommentInput from './CommentInput';

class InputModal extends Component {
    render() {
        const {
            visible,
            hideModal,
            onCommented,
            comment_id,
            questionId,
            reply,
            switchReplyType,
            parent_comment_id,
            count_comments,
            isPost,
        } = this.props;
        return (
            <Modal
                isVisible={visible}
                onBackdropPress={hideModal}
                backdropOpacity={0}
                style={{ justifyContent: 'flex-end', width: SCREEN_WIDTH, margin: 0 }}
                onModalShow={() => {
                    this.textInput.focus();
                }}
                onModalHide={() => {
                    switchReplyType();
                }}>
                <View>
                    <CommentInput
                        questionId={questionId}
                        onCommented={onCommented}
                        comment_id={comment_id}
                        parent_comment_id={parent_comment_id}
                        textInputRef={input => {
                            this.textInput = input;
                        }}
                        reply={reply}
                        hideModal={hideModal}
                        switchReplyType={switchReplyType}
                        count_comments={count_comments}
                        isPost={isPost}
                    />
                    {ISIOS && <KeyboardSpacer />}
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({});

export default InputModal;
