import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Theme } from '../../utils';

interface Direction {
    x: number;
    y: number;
}

interface Porps {
    start?: Direction;
    end?: Direction;
    locations?: any[];
    colors?: any[];
    style?: any;
}
class GradientView extends Component<Porps> {
    static defaultProps = {
        start: { x: 0, y: 0 },
        end: { x: 1, y: 1 },
        locations: [0.2, 1],
        colors: [Theme.primaryColor, Theme.secondaryColor],
    };

    render() {
        const { children, ...other } = this.props;
        return <LinearGradient {...other}>{children}</LinearGradient>;
    }
}

const styles = StyleSheet.create({});

export default GradientView;
