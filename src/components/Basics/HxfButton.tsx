import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View, Text, ActivityIndicator } from 'react-native';
import GradientView from './GradientView';
import { Theme, PxFit } from '../../utils';

type Size = 'mini' | 'small' | 'medium' | 'default';

interface Direction {
    x: number;
    y: number;
}

export interface Props {
    title?: string;
    theme?: string;
    gradient?: boolean;
    size?: Size;
    onPress?: (e: SyntheticEvent) => void;
    plain?: bool;
    icon?: bool;
    loading?: bool;
    disabled?: bool;
    disabledColors?: string[];
    colors?: string[];
    start?: Direction;
    end?: Direction;
}

class HxfButton extends Component<Props, any> {
    public constructor(props: Props) {
        super(props);
    }

    public buildProps() {
        const { theme, size, plain, ...others } = this.props;

        let buttonStyle, titleStyle;
        if (plain) {
            buttonStyle = {
                ...buttonLayout[size],
                borderWidth: PxFit(1),
                borderColor: theme,
            };
            titleStyle = { ...buttonTitle[size], color: theme };
        } else {
            buttonStyle = { ...buttonLayout[size], backgroundColor: theme };
            titleStyle = { ...buttonTitle[size], color: '#fff' };
        }
        return {
            buttonStyle,
            titleStyle,
            ...others,
        };
    }

    private renderIcon() {
        const { theme, size, icon, loading } = this.props;
        let Iconfont;
        if (loading) {
            Iconfont = <ActivityIndicator color={theme} size={size === 'small' ? size : 'large'} />;
        }
        if (icon) {
            Iconfont = icon;
        }
        if (Iconfont) {
            return (
                <View style={iconWrapStyle[size]}>
                    <Iconfont />
                </View>
            );
        }
        return null;
    }

    public render() {
        const {
            start,
            end,
            gradient,
            style,
            buttonStyle,
            titleStyle,
            title,
            children,
            disabled,
            disabledColors,
            colors,
            onPress,
        } = this.buildProps();
        if (gradient) {
            return (
                <GradientView
                    start={start}
                    end={end}
                    colors={disabled ? disabledColors : colors}
                    style={[styles.buttonWrap, style]}>
                    <TouchableOpacity style={[{ flex: 1 }, styles.buttonWrap]} disabled={disabled} onPress={onPress}>
                        {this.renderIcon()}
                        {children || <Text style={titleStyle}>{title}</Text>}
                    </TouchableOpacity>
                </GradientView>
            );
        }
        return (
            <TouchableOpacity
                style={[styles.buttonWrap, buttonStyle, style, disabled && { backgroundColor: '#a8a8a8' }]}
                disabled={disabled}
                onPress={onPress}>
                {this.renderIcon()}
                {children || <Text style={titleStyle}>{title}</Text>}
            </TouchableOpacity>
        );
    }
}

HxfButton.defaultProps = {
    theme: Theme.primaryColor,
    size: 'default',
    plain: false,
    icon: false,
    loading: false,
    disabled: false,
    disabledColors: ['#787878', '#a4a4a4'],
    colors: [Theme.primaryColor, Theme.secondaryColor],
};

const styles = StyleSheet.create({
    buttonWrap: {
        alignItems: 'center',
        borderRadius: PxFit(4),
        flexDirection: 'row',
        justifyContent: 'center',
        overflow: 'hidden',
    },
});

export default HxfButton;

const buttonLayout = {
    mini: {
        paddingVertical: PxFit(4),
        paddingHorizontal: PxFit(9),
    },
    small: {
        paddingVertical: PxFit(6),
        paddingHorizontal: PxFit(11),
    },
    medium: {
        paddingVertical: PxFit(9),
        paddingHorizontal: PxFit(14),
    },
    default: {
        paddingVertical: PxFit(11),
        paddingHorizontal: PxFit(17),
    },
};

const buttonTitle = {
    mini: {
        fontSize: PxFit(13),
    },
    small: {
        fontSize: PxFit(13),
    },
    medium: {
        fontSize: PxFit(15),
    },
    default: {
        fontSize: PxFit(16),
    },
};

const iconWrapStyle = {
    mini: {
        marginRight: PxFit(2),
    },
    small: {
        marginRight: PxFit(3),
    },
    medium: {
        marginRight: PxFit(4),
    },
    default: {
        marginRight: PxFit(5),
    },
};
