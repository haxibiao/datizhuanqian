/*
 * @flow
 * created by wyk made in 2019-03-25 10:52:46
 */
'use strict';
import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Image, Text, TouchableOpacity, Animated } from 'react-native';
import {
	PlaceholderImage,
	PageContainer,
	TouchFeedback,
	OverlayViewer,
	Iconfont,
	Row,
	PullChooser
} from '../../components';
import { Theme, PxFit, Config, Tools, SCREEN_WIDTH } from '../../utils';

import ImageViewer from 'react-native-image-zoom-viewer';

import QuestionOptions from './components/QuestionOptions';
import UserInfo from './components/UserInfo';
import QuestionBody from './components/QuestionBody';
import AnswerCorrectRate from './components/AnswerCorrectRate';
import CommentOverlay from './components/CommentOverlay';
import FooterBar from './components/FooterBar';

class index extends Component {
	constructor(props) {
		super(props);

		this.state = {
			showComment: false
		};
	}

	showComment = () => {
		this.setState({ showComment: true });
	};

	hideComment = () => {
		this.setState({ showComment: false });
	};

	showOptions = question => {
		let { navigation } = this.props;
		PullChooser.show([
			{
				title: '举报',
				onPress: () => navigation.navigate('Curation', { question })
			}
		]);
	};

	render() {
		let { showComment } = this.state;
		let { navigation } = this.props;
		let question = navigation.getParam('question', {});
		let { description, image, selections_array, category, answer, video } = question;
		return (
			<PageContainer
				title="题目详情"
				rightView={
					<TouchFeedback style={styles.optionsButton} onPress={() => this.showOptions(question)}>
						<Iconfont name="more-horizontal" color="#fff" size={PxFit(18)} />
					</TouchFeedback>
				}
			>
				<ScrollView
					contentContainerStyle={{ flexGrow: 1 }}
					keyboardShouldPersistTaps="always"
					showsVerticalScrollIndicator={false}
					bounces={false}
				>
					<View style={styles.content}>
						<UserInfo question={question} navigation={navigation} />
						<QuestionBody question={question} />
						<QuestionOptions
							selections={question.selections_array}
							onSelectOption={this.selectOption}
							submited
							answer={question.answer}
						/>
					</View>
					<AnswerCorrectRate correct={question.correct_count} count={question.count} />
				</ScrollView>
				<FooterBar
					navigation={navigation}
					question={question}
					submited
					showComment={this.showComment}
					oSubmit={this.onSubmit}
				/>
				<CommentOverlay visible={showComment} onHide={this.hideComment} questionId={question.id} />
			</PageContainer>
		);
	}
}

const styles = StyleSheet.create({
	content: {
		paddingTop: PxFit(20),
		paddingHorizontal: PxFit(Theme.itemSpace)
	},
	optionsButton: {
		flex: 1,
		justifyContent: 'center'
	},
	optionsText: { fontSize: PxFit(15), textAlign: 'center', color: Theme.secondaryColor },
	tipsView: {
		marginHorizontal: PxFit(Theme.itemSpace),
		padding: PxFit(10)
	},
	answerText: {
		fontSize: PxFit(15),
		color: Theme.defaultTextColor,
		marginBottom: PxFit(5)
	},
	curationText: {
		fontSize: PxFit(13),
		color: Theme.subTextColor
	},
	errorText: {
		fontSize: PxFit(13),
		paddingLeft: PxFit(5),
		color: Theme.errorColor
	}
});

export default index;
