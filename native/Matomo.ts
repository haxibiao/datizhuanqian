var Matomo = require('react-native').NativeModules.Matomo;
module.exports = {
    initTracker: Device.Android ? Matomo.initTracker : null,
    setUserId: function(userId) {
        if (userId !== null && (userId !== userId) !== undefined) {
            Device.Android && Matomo.setUserId(userId + '');
        }
    },
    setDispatchInterval: function(interval) {
        Matomo.setDispatchInterval(interval);
    },
    setCustomDimension: function(id, value) {
        Device.Android && Matomo.setCustomDimension(id, value ? value + '' : null);
    },
    trackAppDownload: Device.Android ? Matomo.trackAppDownload : null,
    trackScreen: function(path, title) {
        Matomo.trackScreen(path, title);
    },
    trackGoal: function(goalId, revenue) {
        Matomo.trackGoal(goalId, { revenue });
    },
    trackEvent: function(category, action, name, value, url) {
        Device.Android && Matomo.trackEvent(category, '【前端】' + action, { name: '【前端】' + name, value, url });
    },
    trackCampaign: function(name, keyword) {
        Matomo.trackCampaign(name, keyword);
    },
    trackContentImpression: function(name, piece, target) {
        Matomo.trackContentImpression(name, { piece, target });
    },
    trackContentInteraction: function(name, interaction, piece, target) {
        Matomo.trackContentInteraction(name, { interaction, piece, target });
    },
    trackSearch: function(query, category, resultCount, url) {
        Matomo.trackSearch(query, { category, resultCount, url });
    },
};
