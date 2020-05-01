import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Image, ImageBackground } from 'react-native';
import { TouchFeedback, Row, Iconfont, StatusView } from 'components';
import { useQuery, GQL } from 'apollo';
import { Overlay } from 'teaset';
import MedalIntro from './components/MedalIntro';
import service from 'service';

interface Props {
    navigation: any;
}

const Medal = (props: Props) => {
    const { navigation } = props;
    const user = navigation.getParam('user', {});
    // const medals = navigation.getParam('medals', []);

    const showMedalIntro = medal => {
        const overlayView = (
            <Overlay.View animated>
                <View style={styles.overlayInner}>
                    <MedalIntro hide={() => Overlay.hide(OverlayKey)} medal={medal} />
                </View>
            </Overlay.View>
        );
        const OverlayKey = Overlay.show(overlayView);
    };

    const { data, loading, error, refetch } = useQuery(GQL.MedalsQuery, {
        variables: {
            user_id: user.id,
        },
        fetchPolicy: 'network-only',
    });

    console.log('user :', user, data, error);
    if (error) return <StatusView.ErrorView onPress={refetch} />;
    if (loading) return <StatusView.LoadingSpinner />;

    const owneds = data.medals.filter(elem => {
        return elem.owned == true;
    });

    return (
        <View>
            <ImageBackground
                source={require('@src/assets/images/medal_bg.png')}
                style={{
                    width: Device.WIDTH,
                    height: (Device.WIDTH * 687) / 1080,
                }}>
                <Row style={styles.header}>
                    <TouchFeedback onPress={() => navigation.goBack()}>
                        <Iconfont name="left" color={Theme.navBarTitleColor} size={PxFit(21)} />
                    </TouchFeedback>
                    <View style={styles.headerCenter}>
                        <Text style={styles.headerText}>勋章中心</Text>
                    </View>
                </Row>
                <Row style={styles.title}>
                    <Text style={styles.titleCount}>{owneds.length}</Text>
                    <Text style={styles.titleText}>个</Text>
                </Row>
            </ImageBackground>
            <View style={styles.medalList}>
                {data.medals.map((medal, index) => {
                    return (
                        <TouchFeedback style={styles.medalContent} key={index} onPress={() => showMedalIntro(medal)}>
                            <Image
                                source={{ uri: medal.owned ? medal.done_icon_url : medal.undone_icon_url }}
                                style={styles.medalImage}
                            />
                            <Text>{medal.name_cn || '才高八斗'}</Text>
                        </TouchFeedback>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        height: Device.NAVBAR_HEIGHT,
        paddingTop: PxFit(Device.statusBarHeight) + PxFit(10),
        paddingLeft: PxFit(15),
    },
    headerCenter: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'center',
    },
    headerText: {
        fontSize: PxFit(17),
        color: Theme.navBarTitleColor,
        paddingRight: PxFit(10),
    },
    title: {
        marginTop: PxFit(25),
        justifyContent: 'center',
    },
    titleCount: {
        fontSize: PxFit(50),
        fontWeight: '600',
        color: Theme.white,
    },
    titleText: {
        fontSize: PxFit(15),
        color: Theme.white,
        paddingTop: PxFit(26),
        paddingLeft: PxFit(10),
    },
    medalList: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: PxFit(15),
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        backgroundColor: '#FEFEFE',
    },
    medalContent: {
        alignItems: 'center',
        marginTop: PxFit(25),
    },
    medalImage: {
        width: Device.WIDTH / 4,
        height: Device.WIDTH / 4,
        marginBottom: PxFit(10),
    },
    overlayInner: {
        flex: 1,
        width: Device.WIDTH,
        height: Device.HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rule: {
        flex: 1,
        justifyContent: 'center',
    },
});
export default Medal;
