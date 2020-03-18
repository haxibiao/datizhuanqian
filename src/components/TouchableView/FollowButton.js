/*
 * @flow
 * created by wyk made in 2018-12-12 12:01:36
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { withNavigation } from 'react-navigation';
import { PxFit, Theme, Tools } from 'utils';
import Iconfont from '../Iconfont';

import { GQL, graphql, compose } from 'apollo';
import { app } from 'store';

type Props = {
    id: number,
    followedStatus: boolean | number,
    style?: any,
    titleStyle?: any,
    activeColor?: any,
    tintColor?: any,
    ...TouchableWithoutFeedback.propTypes,
};

class FollowButton extends Component<Props> {
    static defaultProps = {
        activeOpacity: 0.6,
        activeColor: Theme.subTextColor,
        tintColor: '#fff',
    };

    constructor(props: Props) {
        super(props);
        this.onFollowHandler = __.throttle(this.onFollowHandler(), 500);
        this.state = {
            followed: props.followedStatus ? true : false,
        };
    }

    buildProps() {
        let { followed } = this.state;
        let { style, titleStyle, activeColor, tintColor, ...others } = this.props;
        let title, backgroundColor, textColor, children;
        if (followed) {
            title = '已关注';
            textColor = activeColor;
            backgroundColor = Theme.groundColour;
        } else {
            title = '关注';
            textColor = tintColor;
            backgroundColor = Theme.primaryColor;
        }

        style = {
            backgroundColor,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            ...style,
        };

        titleStyle = {
            fontSize: PxFit(13),
            color: textColor,
            overflow: 'hidden',
            ...titleStyle,
        };

        children = (
            <Text style={titleStyle} numberOfLines={1}>
                {title}
            </Text>
        );

        return { children, style, ...others };
    }

    render() {
        if (app.me.id === this.props.id) {
            return null;
        }
        let { children, style, ...others } = this.buildProps();
        return (
            <TouchableOpacity {...others} style={style} onPress={this.onFollowHandler}>
                {children}
            </TouchableOpacity>
        );
    }

    onFollowHandler = () => {
        console.log('触发');
        if (!app.login) {
            return () => {
                this.props.navigation.navigate('Register');
            };
        } else {
            console.log('true');
            return () => {
                this.setState({ followed: !this.state.followed }, () => {
                    this.follow();
                });
            };
        }
    };

    follow = async () => {
        console.log('follow');
        let { id, followUser } = this.props;
        try {
            await this.props.followUser({
                variables: {
                    followed_type: 'users',
                    followed_id: id,
                },
                refetchQueries: () => [
                    {
                        query: GQL.FollowsQuery,
                        variables: { filter: 'users' },
                    },
                ],
            });
        } catch (error) {
            Toast.show({ content: '操作失败', layout: 'top' });
        }
    };
}

const styles = StyleSheet.create({});

export default compose(withNavigation, graphql(GQL.FollowToggbleMutation, { name: 'followUser' }))(FollowButton);
