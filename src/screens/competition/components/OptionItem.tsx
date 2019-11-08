/*
 * @flow
 * created by wyk made in 2019-03-28 11:52:05
 */
import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Text, Image, Animated } from 'react-native';
import { TouchFeedback, Iconfont } from 'components';
import { Theme, PxFit, SCREEN_WIDTH } from 'utils';

class OptionItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            status: null,
        };
    }
    _animated = new Animated.Value(0);

    componentDidMount() {
        this.animation();
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.questionId !== this.props.questionId) {
            this.animation();
        }
    }

    componentWillUnmount() {
        this.timer && clearInterval(this.timer);
    }

    animation() {
        this.disable = true;
        this._animated.setValue(0);
        Animated.timing(this._animated, {
            toValue: 1,
            velocity: 10,
            tension: -10,
            friction: 5,
            delay: 350,
        }).start(() => {
            this.disable = false;
        });
    }

    onPress = () => {
        let { option, selectOption, question, onSelectOption } = this.props;

        this.setState({
            status: question.answer === option.Value ? 'correct' : 'error',
        });

        onSelectOption();

        this.timer = setTimeout(() => {
            selectOption(option.Value);
            this.setState({
                status: null,
            });
        }, 500);
    };

    buildProps = () => {
        let { selectedOption, option, correct, question } = this.props;
        let labelStyle, contentStyle, label, focused;

        // focused = selectedOption && selectedOption.includes(option.Value);

        // if (focused) {
        //     if (correct) {
        //         status = 'correct';
        //     } else {
        //         status = 'error';
        //     }
        // } else if (correct) {
        //     status = 'missing';
        // }

        switch (this.state.status) {
            case 'correct':
                labelStyle = { backgroundColor: Theme.correctColor, borderWidth: 0 };
                contentStyle = { color: Theme.correctColor };
                label = <Iconfont name="correct" size={PxFit(16)} color={'#fff'} />;
                break;

            case 'error':
                labelStyle = { backgroundColor: Theme.errorColor, borderWidth: 0 };
                contentStyle = { color: Theme.errorColor };
                label = <Iconfont name="close" size={PxFit(19)} color={'#fff'} />;
                break;
            default:
                label = <Text style={styles.optionLabelText}>{option.Value}</Text>;
                break;
        }
        return { labelStyle, contentStyle, label };
    };

    render() {
        let { option, even, submit } = this.props;
        let { labelStyle, contentStyle, label } = this.buildProps();
        const animateStyles = {
            opacity: this._animated,
            transform: [
                {
                    translateX: this._animated.interpolate({
                        inputRange: [0, 1],
                        outputRange: [even ? -SCREEN_WIDTH : SCREEN_WIDTH, 0],
                        // extrapolate: 'clamp',
                    }),
                },
            ],
        };

        console.log('submit', submit);
        return (
            <Animated.View style={animateStyles}>
                <View style={styles.optionItemWrap}>
                    <TouchFeedback style={styles.optionItem} onPress={this.onPress} disabled={submit}>
                        <View style={[styles.optionLabel, labelStyle]}>{label}</View>
                        <View style={styles.optionContent}>
                            <Text style={[styles.optionContentText, contentStyle]}>{option.Text}</Text>
                        </View>
                    </TouchFeedback>
                </View>
            </Animated.View>
        );
    }
}

const styles = StyleSheet.create({
    optionItemWrap: {
        marginBottom: PxFit(20),
    },
    optionItem: {
        opacity: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    optionLabel: {
        marginRight: PxFit(15),
        width: PxFit(34),
        height: PxFit(34),
        borderRadius: PxFit(17),
        borderWidth: PxFit(1),
        borderColor: Theme.borderColor,
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedOption: { backgroundColor: '#b6c2e1', borderWidth: 0 },
    correctOption: { backgroundColor: Theme.correctColor, borderWidth: 0 },
    errorOption: { backgroundColor: Theme.errorColor, borderWidth: 0 },
    optionLabelText: {
        fontSize: PxFit(16),
        color: Theme.white,
    },
    optionContent: {
        flex: 1,
        minHeight: PxFit(34),
        justifyContent: 'center',
    },
    optionContentText: {
        fontSize: PxFit(16),
        lineHeight: PxFit(20),
        color: Theme.white,
    },
});

export default OptionItem;
