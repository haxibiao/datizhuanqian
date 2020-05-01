/*
 * @flow
 * created by wyk made in 2019-05-10 22:42:25
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
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
            isSpider,
            showCommentModal,
        } = this.props;
        return (
            <Modal
                isVisible={visible}
                onBackdropPress={hideModal}
                backdropOpacity={0}
                style={{ justifyContent: 'flex-end', width: Device.WIDTH, margin: 0 }}
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
                        isSpider={isSpider}
                        showCommentModal={showCommentModal}
                    />
                    {Device.IOS && <KeyboardSpacer />}
                </View>
            </Modal>
        );
    }
}

export default InputModal;
