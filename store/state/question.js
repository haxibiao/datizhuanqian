import { Record, List } from "immutable";

export const question = Record({
	plate: [
		{
			id: 1,
			name: "英语学习",
			description: "学习全球通用语言的板块",
			avatar: require("../../assets/images/yingyu.png")
		},
		{
			id: 2,
			name: "动漫知识",
			description: "幻想,二次元快来成为热血的英雄吧",
			avatar: require("../../assets/images/dongman.jpeg")
		},
		{
			id: 3,
			name: "游戏问答",
			description: "同学们,游戏富裕你生命快来作战吧",
			avatar: require("../../assets/images/youxi2.jpeg")
		},
		{
			id: 4,
			name: "驾考知识",
			description: "驾考理论知识不可缺少",
			avatar: require("../../assets/images/jiakao.jpeg")
		},
		{
			id: 5,
			name: "动漫知识",
			description: "幻想,二次元快来成为热血的英雄吧",
			avatar: require("../../assets/images/dongman.jpeg")
		},
		{
			id: 6,
			name: "游戏问答",
			description: "同学们,游戏富裕你生命快来作战吧",
			avatar: require("../../assets/images/youxi2.jpeg")
		},
		{
			id: 7,
			name: "动漫知识",
			description: "幻想,二次元快来成为热血的英雄吧",
			avatar: require("../../assets/images/dongman.jpeg")
		},
		{
			id: 8,
			name: "动漫知识",
			description: "幻想,二次元快来成为热血的英雄吧",
			avatar: require("../../assets/images/dongman.jpeg")
		},
		{
			id: 9,
			name: "英语学习",
			description: "学习全球通用语言的板块",
			avatar: require("../../assets/images/yingyu.png")
		}
	],
	nextPlate: [
		{
			id: 10,
			name: "动漫知识",
			description: "幻想,二次元快来成为热血的英雄吧",
			avatar: require("../../assets/images/dongman.jpeg")
		},
		{
			id: 11,
			name: "游戏问答",
			description: "同学们,游戏富裕你生命快来作战吧",
			avatar: require("../../assets/images/youxi2.jpeg")
		},
		{
			id: 12,
			name: "英语学习",
			description: "学习全球通用语言的板块",
			avatar: require("../../assets/images/yingyu.png")
		},
		{
			id: 13,
			name: "动漫知识",
			description: "幻想,二次元快来成为热血的英雄吧",
			avatar: require("../../assets/images/dongman.jpeg")
		},
		{
			id: 14,
			name: "游戏问答",
			description: "同学们,游戏富裕你生命快来作战吧",
			avatar: require("../../assets/images/youxi2.jpeg")
		}
	],
	question: [
		{
			id: 1,
			title: "英雄联盟S1的冠军是？",
			answer: 3,
			option: {
				a: "SKT",
				b: "WE",
				c: "Fnatic",
				d: "TPA"
			},
			value: 1
		},
		{
			id: 2,
			title: "中国英雄联盟第一个世界冠军是？",
			answer: 2,
			option: {
				a: "EDG",
				b: "WE",
				c: "IG",
				d: "RNG"
			},
			value: 1
		},
		{
			id: 3,
			title: "绝地求生S1897的弹夹有少发子弹？",
			answer: 2,
			option: {
				a: "5",
				b: "7",
				c: "9",
				d: "15"
			},
			value: 1
		}
	],
	prop: [
		{
			id: 1,
			logo: "http://pic40.photophoto.cn/20160811/0007020070469426_b.jpg",
			name: "道具1",
			value: 3
		},
		{
			id: 2,
			logo: "http://pic40.photophoto.cn/20160811/0007020070469426_b.jpg",
			name: "道具2",
			value: 3
		},
		{
			id: 3,
			logo: "http://pic40.photophoto.cn/20160811/0007020070469426_b.jpg",
			name: "道具3",
			value: 1
		}
	]
});
