/*
 * @flow
 * created by wyk made in 2018-12-08 17:58:13
 */
import React from 'react';
import { Text } from 'react-native';
import { createIconSet } from 'react-native-vector-icons';

export default function(glyphMap, fontName, expoAssetId) {
    const font = {
        [fontName]: expoAssetId,
    };
    const RNVIconComponent = createIconSet(glyphMap, fontName);

    class Icon extends React.Component {
        static propTypes = RNVIconComponent.propTypes;
        static defaultProps = RNVIconComponent.defaultProps;

        state = {
            fontIsLoaded: true, // Font.isLoaded(fontName),
        };

        async componentDidMount() {
            this._mounted = true;
            if (!this.state.fontIsLoaded) {
                // await Font.loadAsync(font);
                this._mounted &&
                    this.setState({
                        fontIsLoaded: true,
                    });
            }
        }

        componentWillUnmount() {
            this._mounted = false;
        }

        setNativeProps(props) {
            if (this._icon) {
                this._icon.setNativeProps(props);
            }
        }

        render() {
            if (!this.state.fontIsLoaded) {
                return <Text />;
            }

            return (
                <RNVIconComponent
                    ref={view => {
                        this._icon = view;
                    }}
                    {...this.props}
                />
            );
        }
    }

    Icon.glyphMap = glyphMap;
    Icon.font = font;

    return Icon;
}
