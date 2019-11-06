import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';

type Props = {
    ...Text.propTypes,
    shadowText?: boolean,
};

class SafeText extends Component<Props> {
    render() {
        const { children, style, shadowText, ...other } = this.props;
        const map = { String: 'String', Number: 'Number', Array: 'Array' };
        if (React.isValidElement(children) || map[Object.prototype.toString.call(children).slice(8, -1)]) {
            return (
                <Text {...other} style={[styles.fontFamily, style, shadowText && styles.textShadow]}>
                    {children}
                </Text>
            );
        } else return null;
    }
}

const styles = StyleSheet.create({
    fontFamily: {
        ...Platform.select({
            ios: {},
            android: {
                fontFamily: ' ',
            },
        }),
    },
    textShadow: {
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
    },
});

export default SafeText;
