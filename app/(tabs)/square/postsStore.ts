export type SquarePost={
    id:number;
    userName:string;
    avatar:string;
    category:string;
    meta:string;
    title:string;
    body:string;
    location:string;
    rightText:string;
    price?:boolean;
    contact?:string;
  };
  
  let posts:SquarePost[]=[
    {
      id:1,
      userName:'小王',
      avatar:'王',
      category:'找工作',
      meta:'10分钟前 · Ontario',
      title:'本人找仓库工作，会开叉车',
      body:'住Ontario附近，有仓库工作经验，会开站式叉车和坐式叉车，可以马上上班。',
      location:'Ontario',
      rightText:'刚刚更新'
    },
    {
      id:2,
      userName:'李女士',
      avatar:'李',
      category:'租房',
      meta:'25分钟前 · Rowland Heights',
      title:'罗兰岗有一个房间出租',
      body:'环境安静，停车方便，附近有华人超市，希望找爱干净、生活规律的租客。',
      location:'Rowland Heights',
      rightText:'$850/月'
    },
    {
      id:3,
      userName:'老陈',
      avatar:'陈',
      category:'二手',
      meta:'1小时前 · San Gabriel',
      title:'搬家出一个九成新的电脑桌',
      body:'买了半年，使用正常，没有明显损坏，需要自己过来取。',
      location:'San Gabriel',
      rightText:'$35',
      price:true
    }
  ];
  
  export function getPosts(){
    return posts;
  }
  
  export function addPost(post:SquarePost){
    posts=[
      post,
      ...posts
    ];
  }