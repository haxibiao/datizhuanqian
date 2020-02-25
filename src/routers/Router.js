/*
 * @Author: Gaoxuan
 * @Date:   2019-08-01 09:55:03
 */
import MainTabNavigator from './MainTabNavigator';
// 登录注验证
import LoginScreen from '../screens/login';
import ForgetPasswordScreen from '../screens/login/ForgetPassword';
import RetrievePasswordScreen from '../screens/login/RetrievePassword';
import PhoneBindScreen from '../screens/login/PhoneBind';
import VerificationPhoneScreen from '../screens/login/VerificationPhone';
import RegisterSetPasswordScreen from '../screens/login/RegisterSetPassword';
import PasswordLoginScreen from '../screens/login/PasswordLogin';
// 答题
import AnswerScreen from '../screens/answer';
import ExerciseScreen from '../screens/answer/Exercise'; //新的答题页
import ExamScreen from '../screens/answer/Exam'; //新的考试页
import UserAnswerScreen from '../screens/answer/UserAnswer';
import MoreCategoriesScreen from '../screens/home/MoreCategories';
import SearchScreen from '../screens/home/Search';
import ExamResultScreen from '../screens/answer/ExamResult';
// 答题对垒
import CompetitionCategoriesScreen from '../screens/competition/categories';
import CompetitionMatchingScreen from '../screens/competition/matching';
import CompeteScreen from '../screens/competition/compete';
import GameSettlementScreen from '../screens/competition/settlement';
// 小视频
// import MediumScreen from '../screens/video';
// 视频动态
import VideoPostScreen from '../screens/media/VideoPost';
// 题目详情
import QuestionScreen from '../screens/question';
import VideoExplanationScreen from '../screens/question/VideoExplanation';
// 提现
import WithdrawLogDetailScreen from '../screens/withdraw/WithdrawLogDetails';
import WithdrawApplyScreen from '../screens/withdraw/WithdrawApply';
// 任务
import CpcTaskScreen from '../screens/task/CpcTask';
import SubmitTaskScreen from '../screens/task/SubmitTask';
import SpiderVideoTaskScreen from '../screens/task/SpiderVideoTask';

// 排行
import RankScreen from '../screens/rank';
import ParticipationScreen from '../screens/participation';

// 出题
import editQuestion from '../screens/contribute/edit'; //新的出题页
import ContributeScreen from '../screens/contribute';
import ContributesScreen from '../screens/contribute/Contributes';
import ContributeRuleScreen from '../screens/contribute/ContributeRule';
import ContributeSubmitedScreen from '../screens/contribute/Submit';
import ContributeEditCategoryScreen from '../screens/contribute/EditCategory';
import ContributeEditOptionsScreen from '../screens/contribute/EditOptions';
import ContributeEditExplainScreen from '../screens/contribute/EditExplain';
import AskQuestionScreen from '../screens/contribute/AskQuestion';

// 分享
import ShareScreen from '../screens/share';
import InviteeListScreen from '../screens/share/InviteeList';
import AppShareCardScreen from '../screens/share/AppShareCard';

// 个人
import EditScreen from '../screens/profile/Edit';
import FavoritesLogScreen from '../screens/profile/FavoritesLog';
import AnswerLogScreen from '../screens/profile/AnswerLog';
import CommonIssueScreen from '../screens/profile/CommonIssue';
import ModifyAliPayScreen from '../screens/profile/ModifyAliPay';
import ModifyPasswordScreen from '../screens/profile/ModifyPassword';
import ModifyAccountScreen from '../screens/profile/ModifyAccount';
import VerificationCodeScreen from '../screens/profile/VerificationCode';
import BillingRecordScreen from '../screens/profile/BillingRecord';
import IntroduceScreen from '../screens/profile/Introduce';
import SocietyScreen from '../screens/profile/Society';
import RecruitScreen from '../screens/profile/Recruit';
import MakeMoenyManualScreen from '../screens/profile/MakeMoenyManual';
import MyPublishScreen from '../screens/profile/MyPublish';
// 通知
import NotificationScreen from '../screens/notification';
import SystemNotificationScreen from '../screens/notification/SystemNotification';
import OfficialNoticeScreen from '../screens/notification/OfficialNotice';
import CommentNotificationScreen from '../screens/notification/CommentNotification';
import FansNotificationScreen from '../screens/notification/FansNotification';
import PushNotificationScreen from '../screens/notification/PushNotification';
import LikeNotificationScreen from '../screens/notification/LikeNotification';
import NoticeItemDetailScreen from '../screens/notification/NoticeItemDetail';
import ChatScreen from '../screens/chat';

// 反馈
import FeedbackScreen from '../screens/feedback';
import FeedbackDetails from '../screens/feedback/FeedbackDetails';

// 举报
import ReportCommentScreen from '../screens/comment/ReportComment';
import ReportUserScreen from '../screens/user/ReportUser';
import ReportQuestionScreen from '../screens/question/ReportQuestion';

// 用户信息
import UserScreen from '../screens/user';
import MedalScreen from '../screens/user/Medal';

// 设置
import SettingScreen from '../screens/setting';
import AccountSecurityScreen from '../screens/setting/AccountSecurity';
import GradeDescriptionScreen from '../screens/setting/GradeDescription';
import UserProtocolScreen from '../screens/setting/UserProtocol';
import ShareAppScreen from '../screens/setting/ShareApp';
import AboutUsScreen from '../screens/setting/AboutUs';
import UpdateLogScreen from '../screens/setting/UpdateLog';
import PrivacyPolicyScreen from '../screens/setting/PrivacyPolicy';
import SetLoginInfoScreen from '../screens/setting/SetLoginInfo';
import SettingWithdrawInfoScreen from '../screens/setting/SettingWithdrawInfo';

export default {
    Main: {
        screen: MainTabNavigator,
    },
    // 登录验证
    Login: {
        screen: LoginScreen,
    },
    ForgetPassword: {
        screen: ForgetPasswordScreen,
    },
    RetrievePassword: {
        screen: RetrievePasswordScreen,
    },
    PhoneBind: {
        screen: PhoneBindScreen,
    },
    VerificationPhone: {
        screen: VerificationPhoneScreen,
    },
    RegisterSetPassword: {
        screen: RegisterSetPasswordScreen,
    },
    PasswordLogin: {
        screen: PasswordLoginScreen,
    },
    // 答题
    Answer: {
        screen: ExerciseScreen,
    },
    Exam: {
        screen: ExamScreen,
    },
    // 答题
    UserAnswer: {
        screen: UserAnswerScreen,
    },
    MoreCategories: {
        screen: MoreCategoriesScreen,
    },
    Search: {
        screen: SearchScreen,
    },
    ExamResult: {
        screen: ExamResultScreen,
    },
    // 答题对垒
    CompetitionCategories: {
        screen: CompetitionCategoriesScreen,
    },
    // 匹配
    Matching: {
        screen: CompetitionMatchingScreen,
    },
    // 比赛
    Compete: {
        screen: CompeteScreen,
    },
    // 比赛
    GameSettlement: {
        screen: GameSettlementScreen,
    },
    // 短视频
    // Medium: {
    //     screen: MediumScreen,
    // },
    // 题目详情
    Question: {
        screen: QuestionScreen,
    },
    VideoPost: {
        screen: VideoPostScreen,
    },
    VideoExplanation: {
        screen: VideoExplanationScreen,
    },
    // 提现
    withdrawLogDetails: {
        screen: WithdrawLogDetailScreen,
    },
    WithdrawApply: {
        screen: WithdrawApplyScreen,
    },
    // 任务
    CpcTask: {
        screen: CpcTaskScreen,
    },
    SubmitTask: {
        screen: SubmitTaskScreen,
    },
    SpiderVideoTask: {
        screen: SpiderVideoTaskScreen,
    },
    // 排行
    Rank: {
        screen: RankScreen,
    },
    // 分红
    Participation: {
        screen: ParticipationScreen,
    },
    // 出题
    Contribute: {
        screen: editQuestion,
    },
    Contributes: {
        screen: ContributesScreen,
    },
    ContributeRule: {
        screen: ContributeRuleScreen,
    },
    ContributeSubmited: {
        screen: ContributeSubmitedScreen,
    },
    EditCategory: {
        screen: ContributeEditCategoryScreen,
    },
    EditOptions: {
        screen: ContributeEditOptionsScreen,
    },
    EditExplain: {
        screen: ContributeEditExplainScreen,
    },
    AskQuestion: {
        screen: AskQuestionScreen,
    },

    // 分享
    Share: {
        screen: ShareScreen,
    },
    InviteeList: {
        screen: InviteeListScreen,
    },
    AppShareCard: {
        screen: AppShareCardScreen,
    },

    // 个人
    EditProfile: {
        screen: EditScreen,
    },
    FavoritesLog: {
        screen: FavoritesLogScreen,
    },
    AnswerLog: {
        screen: AnswerLogScreen,
    },

    CommonIssue: {
        screen: CommonIssueScreen,
    },
    ModifyAliPay: {
        screen: ModifyAliPayScreen,
    },
    ModifyPassword: {
        screen: ModifyPasswordScreen,
    },
    ModifyAccount: {
        screen: ModifyAccountScreen,
    },
    VerificationCode: {
        screen: VerificationCodeScreen,
    },
    BillingRecord: {
        screen: BillingRecordScreen,
    },
    Introduce: {
        screen: IntroduceScreen,
    },
    Society: {
        screen: SocietyScreen,
    },
    Recruit: {
        screen: RecruitScreen,
    },
    MakeMoenyManual: {
        screen: MakeMoenyManualScreen,
    },
    MyPublish: {
        screen: MyPublishScreen,
    },
    // 通知
    Notification: {
        screen: NotificationScreen,
    },
    SystemNotification: {
        screen: SystemNotificationScreen,
    },
    OfficialNotice: {
        screen: OfficialNoticeScreen,
    },
    CommentNotification: {
        screen: CommentNotificationScreen,
    },
    FansNotification: {
        screen: FansNotificationScreen,
    },
    PushNotification: {
        screen: PushNotificationScreen,
    },
    LikeNotification: {
        screen: LikeNotificationScreen,
    },
    NoticeItemDetail: {
        screen: NoticeItemDetailScreen,
    },
    Chat: {
        screen: ChatScreen,
    },
    // 反馈
    Feedback: {
        screen: FeedbackScreen,
    },
    FeedbackDetails: {
        screen: FeedbackDetails,
    },
    // 举报
    ReportUser: {
        screen: ReportUserScreen,
    },
    ReportComment: {
        screen: ReportCommentScreen,
    },
    ReportQuestion: {
        screen: ReportQuestionScreen,
    },
    // 用户
    User: {
        screen: UserScreen,
    },
    Medal: {
        screen: MedalScreen,
    },
    //  设置
    Setting: {
        screen: SettingScreen,
    },
    AccountSecurity: {
        screen: AccountSecurityScreen,
    },
    GradeDescription: {
        screen: GradeDescriptionScreen,
    },
    UserProtocol: {
        screen: UserProtocolScreen,
    },
    ShareApp: {
        screen: ShareAppScreen,
    },
    AboutUs: {
        screen: AboutUsScreen,
    },
    UpdateLog: {
        screen: UpdateLogScreen,
    },
    PrivacyPolicy: {
        screen: PrivacyPolicyScreen,
    },
    SetLoginInfo: {
        screen: SetLoginInfoScreen,
    },
    SettingWithdrawInfo: {
        screen: SettingWithdrawInfoScreen,
    },
};
