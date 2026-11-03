export type Job={
  id:number;
  area:string;
  title:string;
  shortTitle:string;
  category:string;
  pay:string;
  shortPay:string;
  extra:string;
  distance:string;
  time:string;
  latitude:number;
  longitude:number;
  keywords?:string;
};

export const categories=[
  '全部',
  '仓库物流',
  '餐饮',
  '司机运输',
  '建筑装修',
  '清洁家政',
  '美容美甲',
  '工厂生产',
  '办公室',
  '销售零售',
  '维修技术',
  '其它工作'
];

export const JOB_TEMPLATES={

  仓库物流:[
    '仓库理货员',
    '仓库打包员',
    '仓库拣货员',
    '仓库扫描员',
    '叉车司机',
    '高叉司机',
    '站式叉车司机',
    '坐式叉车司机',
    '仓库装卸工',
    '仓库搬运工',
    '仓库管理员',
    '库存管理员',
    '仓库领班',
    '物流协调员',
    '出库员',
    '入库员',
    '退货处理员',
    '贴标员',
    '电商仓配员',
    '卡板整理员'
  ],

  餐饮:[
    '炒锅师傅',
    '中餐大厨',
    '二厨',
    '帮厨',
    '厨房打杂',
    '切配师傅',
    '砧板师傅',
    '洗碗工',
    '烧腊师傅',
    '面点师',
    '拉面师傅',
    '寿司师傅',
    '铁板烧师傅',
    '烧烤师傅',
    '炸锅师傅',
    '餐厅服务员',
    '餐厅前台',
    '餐厅收银员',
    '奶茶店店员',
    '咖啡师',
    '烘焙师',
    '甜点师',
    '餐厅经理',
    '餐厅领班'
  ],

  司机运输:[
    '送货司机',
    '仓库配送司机',
    '餐馆送餐司机',
    '卡车司机',
    'CDL A卡车司机',
    'CDL B司机',
    '本地货运司机',
    '长途卡车司机',
    '箱货司机',
    '面包车司机',
    '机场接送司机',
    '搬家公司司机',
    '校车司机',
    '巴士司机',
    '拖车司机'
  ],

  建筑装修:[
    '装修小工',
    '装修大工',
    '建筑小工',
    '木工',
    '木工助手',
    '油漆工',
    '油漆助手',
    '瓷砖工',
    '地板安装工',
    '水电工',
    '电工助手',
    '水管工',
    '水管助手',
    '拆除工',
    '石膏板安装工',
    '泥水工',
    '屋顶工',
    '橱柜安装工',
    '门窗安装工',
    '园林工'
  ],

  清洁家政:[
    '家庭保洁',
    '办公室清洁',
    '酒店客房清洁',
    '民宿清洁',
    '餐厅清洁工',
    '商场清洁工',
    '地毯清洁员',
    '家政阿姨',
    '住家保姆',
    '通勤保姆',
    '月嫂',
    '育儿嫂',
    '老人看护',
    '住家老人看护',
    '陪护员'
  ],

  美容美甲:[
    '美甲师',
    '美甲学徒',
    '美睫师',
    '美睫学徒',
    '美容师',
    '纹绣师',
    '理发师',
    '发型师',
    '洗头工',
    '按摩师',
    'SPA前台',
    '美甲店前台'
  ],

  工厂生产:[
    '工厂普工',
    '生产线操作员',
    '机器操作员',
    '电子产品组装员',
    '家具组装工',
    '产品包装员',
    '质检员',
    '生产主管',
    '食品厂操作员',
    '服装厂车工',
    '缝纫工',
    '印刷厂操作员'
  ],

  办公室:[
    '办公室文员',
    '行政助理',
    '前台接待',
    '客服专员',
    '中文客服',
    '会计助理',
    '会计',
    '出纳',
    '人事助理',
    '招聘专员',
    '电商运营',
    '电商客服',
    '订单处理员',
    '货代操作员',
    '报关助理',
    '进出口文员',
    '数据录入员',
    '采购助理',
    '办公室经理'
  ],

  销售零售:[
    '超市理货员',
    '超市收银员',
    '便利店店员',
    '手机店店员',
    '服装店店员',
    '礼品店店员',
    '销售代表',
    '电话销售',
    '汽车销售',
    '地产助理',
    '地产经纪助理',
    '珠宝店销售',
    '家具店销售'
  ],

  维修技术:[
    '汽车维修技师',
    '汽修学徒',
    '汽车钣金工',
    '汽车喷漆工',
    '轮胎技师',
    '换油技师',
    '电脑维修员',
    '手机维修员',
    '打印机维修员',
    '设备维修员',
    '机器维修工',
    '空调维修技师',
    '空调安装助手',
    '家电维修员',
    '网络安装员'
  ],

  其它工作:[
    '搬家公司搬运工',
    '宠物店店员',
    '宠物美容助手',
    '宠物看护',
    '洗车工',
    '汽车美容员',
    '停车场管理员',
    '保安',
    '夜班保安',
    '活动工作人员',
    '展会工作人员',
    '临时工',
    '电影院工作人员',
    '酒店前台',
    '酒店行李员'
  ]

};

type Area={
  name:string;
  latitude:number;
  longitude:number;
};

const AREAS:Area[]=[
  {
    name:'Ontario',
    latitude:34.0633,
    longitude:-117.6509
  },
  {
    name:'Rancho Cucamonga',
    latitude:34.1064,
    longitude:-117.5931
  },
  {
    name:'Pomona',
    latitude:34.0551,
    longitude:-117.7499
  },
  {
    name:'Los Angeles',
    latitude:34.0522,
    longitude:-118.2437
  },
  {
    name:'Monterey Park',
    latitude:34.0625,
    longitude:-118.1228
  },
  {
    name:'Alhambra',
    latitude:34.0953,
    longitude:-118.1270
  },
  {
    name:'West Covina',
    latitude:34.0686,
    longitude:-117.9390
  },
  {
    name:'El Monte',
    latitude:34.0686,
    longitude:-118.0276
  },
  {
    name:'Fontana',
    latitude:34.0922,
    longitude:-117.4350
  },
  {
    name:'Riverside',
    latitude:33.9806,
    longitude:-117.3755
  },
  {
    name:'Chino',
    latitude:34.0122,
    longitude:-117.6889
  },
  {
    name:'Anaheim',
    latitude:33.8366,
    longitude:-117.9143
  },
  {
    name:'Fullerton',
    latitude:33.8704,
    longitude:-117.9242
  },
  {
    name:'Santa Ana',
    latitude:33.7455,
    longitude:-117.8677
  }
];

function seededRandom(seed:number){

  const value=
    Math.sin(seed*12.9898)*
    43758.5453;

  return value-Math.floor(value);
}

const CATEGORY_NAMES=[
  '仓库物流',
  '餐饮',
  '司机运输',
  '建筑装修',
  '清洁家政',
  '美容美甲',
  '工厂生产',
  '办公室',
  '销售零售',
  '维修技术',
  '其它工作'
] as const;

function makeShortTitle(title:string){

  if(title.length<=6){
    return title;
  }

  return title.slice(0,6);
}

function createPay(
  category:string,
  seed:number
){

  const random=seededRandom(seed);

  if(category==='餐饮'){

    const pay=
      18+
      Math.floor(random*7);

    return{
      pay:`$${pay}/小时 + 小费`,
      shortPay:`$${pay}+`
    };
  }

  if(category==='美容美甲'){

    const pay=
      20+
      Math.floor(random*11);

    return{
      pay:`$${pay}/小时`,
      shortPay:`$${pay}`
    };
  }

  if(category==='建筑装修'){

    const pay=
      22+
      Math.floor(random*14);

    return{
      pay:`$${pay}/小时`,
      shortPay:`$${pay}`
    };
  }

  if(category==='司机运输'){

    const pay=
      22+
      Math.floor(random*12);

    return{
      pay:`$${pay}/小时`,
      shortPay:`$${pay}`
    };
  }

  const pay=
    18+
    Math.floor(random*11);

  return{
    pay:`$${pay}/小时`,
    shortPay:`$${pay}`
  };
}

function createExtra(
  category:string,
  seed:number
){

  const options=[
    '全职 · 可加班',
    '全职 · 长期稳定',
    '全职/兼职',
    '白班 · 周末可上班',
    '经验优先',
    '可培训 · 长期招聘'
  ];

  if(category==='餐饮'){
    options.push('全职/兼职 · 有小费');
  }

  if(category==='仓库物流'){
    options.push('全职 · 仓库经验优先');
  }

  if(category==='司机运输'){
    options.push('全职 · 需要驾照');
  }

  const index=
    Math.floor(
      seededRandom(seed)*
      options.length
    );

  return options[index];
}

const BASE_JOBS:Job[]=[
  {
    id:1,
    area:'Ontario',
    title:'仓库理货员',
    shortTitle:'仓库理货',
    category:'仓库物流',
    pay:'$22/小时',
    shortPay:'$22',
    extra:'全职 · 可加班',
    distance:'2.3 mi',
    time:'10分钟前',
    latitude:34.0633,
    longitude:-117.6509,
    keywords:'仓库 理货 warehouse picker'
  },

  {
    id:2,
    area:'Rancho Cucamonga',
    title:'叉车司机',
    shortTitle:'叉车司机',
    category:'仓库物流',
    pay:'$25/小时',
    shortPay:'$25',
    extra:'全职 · 需要叉车经验',
    distance:'4.1 mi',
    time:'25分钟前',
    latitude:34.0722,
    longitude:-117.6240,
    keywords:'叉车 forklift driver 仓库'
  },

  {
    id:3,
    area:'Pomona',
    title:'餐厅服务员',
    shortTitle:'服务员',
    category:'餐饮',
    pay:'$20/小时 + 小费',
    shortPay:'$20+',
    extra:'全职/兼职 · 有小费',
    distance:'6.8 mi',
    time:'1小时前',
    latitude:34.0500,
    longitude:-117.7000,
    keywords:'餐厅 服务员 waiter restaurant'
  }
];

const EXTRA_JOBS:Job[]=
  Array.from({
    length:27
  }).map((_,index)=>{

    const id=index+4;

    const category=
      CATEGORY_NAMES[
        index%CATEGORY_NAMES.length
      ];

    const templateList=
      JOB_TEMPLATES[category];

    const titleIndex=
      Math.floor(
        seededRandom(id*17)*
        templateList.length
      );

    const title=
      templateList[titleIndex];

    const areaIndex=
      Math.floor(
        seededRandom(id*31)*
        AREAS.length
      );

    const area=
      AREAS[areaIndex];

    /*
      给工作坐标增加一点固定偏移。

      这样同一个城市里的工作不会全部
      堆在完全相同的位置。
    */

    const latitudeOffset=
      (
        seededRandom(id*47)-0.5
      )*0.06;

    const longitudeOffset=
      (
        seededRandom(id*71)-0.5
      )*0.06;

    const payInfo=
      createPay(
        category,
        id*83
      );

    const distanceNumber=
      (
        0.8+
        seededRandom(id*97)*11
      ).toFixed(1);

    const minutes=
      5+
      Math.floor(
        seededRandom(id*113)*180
      );

    let time:string;

    if(minutes<60){
      time=`${minutes}分钟前`;
    }else{
      time=`${Math.floor(minutes/60)}小时前`;
    }

    return{
      id,

      area:area.name,

      title,

      shortTitle:
        makeShortTitle(title),

      category,

      pay:payInfo.pay,

      shortPay:payInfo.shortPay,

      extra:
        createExtra(
          category,
          id*127
        ),

      distance:
        `${distanceNumber} mi`,

      time,

      latitude:
        area.latitude+
        latitudeOffset,

      longitude:
        area.longitude+
        longitudeOffset,

      keywords:
        `${area.name} ${title} ${category}`
    };
  });

export const jobs:Job[]=[
  ...BASE_JOBS,
  ...EXTRA_JOBS
];