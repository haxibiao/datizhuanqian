/*
 * @Author: Gaoxuan
 * @Date:   2019-08-16 14:40:47
 * @Last Modified by:   Gaoxuan
 * @Last Modified time: 2019-08-16 14:40:47
 */

import Share from './Share';
import VideoUploader from './VideoUploader';
import ad from './ad';
import WeChat from './WeChat';
import Util from './Util';
import AppUtil from './AppUtil';
import Alipay from './Alipay';
import Matomo from './Matomo';

//答题赚钱在 matomo.haxibiao.com siteid=1
// Matomo.initTracker(('http://matomo.haxibiao.com', 1));
Matomo.initTracker('http://matomo.haxibiao.com/matomo.php', 1);

//设置心跳30秒提交统计事件
Matomo.setDispatchInterval(30);

export { Share, VideoUploader, WeChat, Util, ad, AppUtil, Alipay, Matomo };
