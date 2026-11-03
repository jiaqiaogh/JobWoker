import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link, useFocusEffect } from 'expo-router';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Animated, Easing, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Region } from 'react-native-maps';
// react-native-map-clustering 包了一层 MapView，职位图钉多了会自动按距离聚合成一个数字气泡，
// 不用再自己手写聚合算法——这是之前卡顿/崩溃的根本原因
import ClusterMap from 'react-native-map-clustering';
import { Job, jobs } from './data/JOBS';
import JobDetailCard from './JobDetailCard';
import JobMarker from './JobMarker';
import JobSmallCard from './JobSmallCard';





const PUBLISHED_JOBS_KEY='findwork_published_jobs';

const initialRegion:Region={
  latitude:34.02,
  longitude:-117.95,
  latitudeDelta:0.75,
  longitudeDelta:0.75
};


const categories=[
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


export default function WorkMap(){

  const mapRef=useRef<any>(null);


  const [selectedJob,setSelectedJob]=
    useState<Job|null>(null);

  const [detailOpen,setDetailOpen]=
    useState(false);

  const [currentRegion,setCurrentRegion]=
    useState<Region>(initialRegion);

  const [searchText,setSearchText]=
    useState('');

  const [selectedCategory,setSelectedCategory]=
    useState('全部');

  const [jobsHidden,setJobsHidden]=
    useState(false);


  const [allJobs,setAllJobs]=
    useState<Job[]>(jobs);


  useFocusEffect(
    useCallback(()=>{
      let active=true;

      const loadPublishedJobs=async()=>{
        try{
          const raw=await AsyncStorage.getItem(PUBLISHED_JOBS_KEY);
          const published:Job[]=raw ? JSON.parse(raw) : [];
          if(active){
            setAllJobs([...published,...jobs]);
          }
        }catch(error){
          console.log('读取已发布招聘失败:',error);
          if(active){
            setAllJobs(jobs);
          }
        }
      };

      loadPublishedJobs();
      return()=>{ active=false; };
    },[])
  );


  const smallY=
    useRef(new Animated.Value(215)).current;

  const smallOpacity=
    useRef(new Animated.Value(0)).current;

  const detailY=
    useRef(new Animated.Value(260)).current;

  const detailOpacity=
    useRef(new Animated.Value(0)).current;


  const keyword=
    searchText.trim().toLowerCase();


  // 用 useMemo 包住：只有 allJobs/分类/关键词真正变化时才重新计算一遍，
  // 不然每次输入框打字、动画触发的渲染都会重新生成一个新数组，
  // 导致下面依赖它的聚合地图以为数据变了，白白重新计算
  const filteredJobs=
    useMemo(()=>allJobs.filter(job=>{

      const categoryMatch=
        selectedCategory==='全部' ||
        job.category===selectedCategory;

      if(!categoryMatch){
        return false;
      }

      if(!keyword){
        return true;
      }

      const searchSource=[
        (job as Job & {company?:string}).company||'',
        job.title,
        job.shortTitle,
        job.category,
        job.pay,
        job.shortPay,
        job.extra,
        job.keywords||''
      ]
        .join(' ')
        .toLowerCase();

      return searchSource.includes(keyword);

    }),[allJobs,selectedCategory,keyword]);


  // 职位图钉现在交给 ClusterMap 自动聚合，不用再根据缩放级别手动切换
  // "显示蓝色热点圈"还是"显示单个图钉"这两套逻辑——聚合库会自己处理密集程度
  const showJobs=
    !jobsHidden;


  const visibleJobs=
    useMemo(()=>filteredJobs.filter(job=>{

      const latitudeHalf=
        currentRegion.latitudeDelta/2;

      const longitudeHalf=
        currentRegion.longitudeDelta/2;

      const minLatitude=
        currentRegion.latitude-
        latitudeHalf;

      const maxLatitude=
        currentRegion.latitude+
        latitudeHalf;

      const minLongitude=
        currentRegion.longitude-
        longitudeHalf;

      const maxLongitude=
        currentRegion.longitude+
        longitudeHalf;

      return(
        job.latitude>=minLatitude &&
        job.latitude<=maxLatitude &&
        job.longitude>=minLongitude &&
        job.longitude<=maxLongitude
      );

    }),[filteredJobs,currentRegion]);


  const currentAreaJobCount=
    visibleJobs.length;




  const resetCards=()=>{

    setSelectedJob(null);
    setDetailOpen(false);

    smallOpacity.setValue(0);
    smallY.setValue(215);

    detailOpacity.setValue(0);
    detailY.setValue(260);

  };


  const toggleJobsHidden=()=>{

    if(!jobsHidden){
      resetCards();
    }

    setJobsHidden(
      current=>!current
    );

  };


  const showJob=(job:Job)=>{

    setDetailOpen(false);
    setSelectedJob(job);


    mapRef.current?.animateToRegion({

      latitude:job.latitude,
      longitude:job.longitude,

      latitudeDelta:
        currentRegion.latitudeDelta,

      longitudeDelta:
        currentRegion.longitudeDelta

    },350);


    smallY.stopAnimation();
    smallOpacity.stopAnimation();

    smallY.setValue(215);
    smallOpacity.setValue(0);


    requestAnimationFrame(()=>{

      requestAnimationFrame(()=>{

        Animated.parallel([

          Animated.timing(
            smallOpacity,
            {
              toValue:1,
              duration:140,

              easing:
                Easing.out(
                  Easing.quad
                ),

              useNativeDriver:true
            }
          ),


          Animated.spring(
            smallY,
            {
              toValue:0,

              damping:26,
              stiffness:130,
              mass:1,

              useNativeDriver:true
            }
          )

        ]).start();

      });

    });

  };


  const closeJob=()=>{

    smallY.stopAnimation();
    smallOpacity.stopAnimation();


    Animated.parallel([

      Animated.timing(
        smallOpacity,
        {
          toValue:0,
          duration:120,

          easing:
            Easing.in(
              Easing.quad
            ),

          useNativeDriver:true
        }
      ),


      Animated.timing(
        smallY,
        {
          toValue:215,
          duration:180,

          easing:
            Easing.in(
              Easing.quad
            ),

          useNativeDriver:true
        }
      )

    ]).start(()=>{

      setSelectedJob(null);
      setDetailOpen(false);

    });

  };


  const openDetail=()=>{

    if(!selectedJob){
      return;
    }


    smallY.stopAnimation();
    smallOpacity.stopAnimation();

    detailY.stopAnimation();
    detailOpacity.stopAnimation();


    detailY.setValue(260);
    detailOpacity.setValue(0);


    Animated.parallel([

      Animated.timing(
        smallOpacity,
        {
          toValue:0,
          duration:120,

          easing:
            Easing.out(
              Easing.quad
            ),

          useNativeDriver:true
        }
      ),


      Animated.timing(
        smallY,
        {
          toValue:40,
          duration:160,

          easing:
            Easing.out(
              Easing.quad
            ),

          useNativeDriver:true
        }
      )

    ]).start(()=>{

      setDetailOpen(true);


      requestAnimationFrame(()=>{

        Animated.parallel([

          Animated.timing(
            detailOpacity,
            {
              toValue:1,
              duration:180,

              easing:
                Easing.out(
                  Easing.quad
                ),

              useNativeDriver:true
            }
          ),


          Animated.spring(
            detailY,
            {
              toValue:0,

              damping:26,
              stiffness:140,
              mass:1,

              useNativeDriver:true
            }
          )

        ]).start();

      });

    });

  };


  const closeDetail=()=>{

    detailY.stopAnimation();
    detailOpacity.stopAnimation();


    Animated.parallel([

      Animated.timing(
        detailOpacity,
        {
          toValue:0,
          duration:180,

          easing:
            Easing.in(
              Easing.quad
            ),

          useNativeDriver:true
        }
      ),


      Animated.timing(
        detailY,
        {
          toValue:260,
          duration:280,

          easing:
            Easing.inOut(
              Easing.cubic
            ),

          useNativeDriver:true
        }
      )

    ]).start(()=>{

      resetCards();

    });

  };


  return(

    <View style={styles.container}>


      {/* 地图：ClusterMap 会自动把距离近的图钉聚合成一个数字气泡，
          缩小时看聚合数量，放大后自动散开成单个职位图钉 */}

      <ClusterMap
        ref={mapRef}

        style={styles.map}

        initialRegion={
          initialRegion
        }

        radius={60} // 聚合半径(像素)，数值越大越容易聚在一起，图钉越不容易卡
        extent={512}
        minZoom={1}
        maxZoom={20}
        clusterColor="#6F8F7A"
        clusterTextColor="#fff"

        onPress={()=>{

          if(
            selectedJob &&
            !detailOpen
          ){

            closeJob();

          }

        }}

        onRegionChangeComplete={
          (region:Region)=>{
            setCurrentRegion(region);
          }
        }
      >


        {/* 工作气泡 */}

        {showJobs&&
         filteredJobs.map(job=>(

          <JobMarker
            key={job.id}

            title={
              job.shortTitle
            }

            pay={
              job.shortPay
            }

            latitude={
              job.latitude
            }

            longitude={
              job.longitude
            }

            /*
              iOS稳定优先。

              不再让选中的Marker变色，
              防止tracksViewChanges=false
              时气泡消失。
            */
            selected={false}

            onPress={()=>
              showJob(job)
            }
          />

        ))}


      </ClusterMap>


      {/* 顶部搜索 + 分类 */}

      <View style={styles.topArea}>

        <View style={styles.searchWrap}>

          <TextInput
            style={styles.searchInput}

            value={
              searchText
            }

            onChangeText={
              setSearchText
            }

            placeholder=
              "搜索职位、店铺或关键词"

            placeholderTextColor=
              "#888"

            returnKeyType=
              "search"

            clearButtonMode=
              "while-editing"

            autoCorrect={false}

            autoCapitalize=
              "none"
          />

        </View>


        <ScrollView
          horizontal

          showsHorizontalScrollIndicator={
            false
          }

          contentContainerStyle={
            styles.categoryContent
          }

          keyboardShouldPersistTaps=
            "handled"
        >

          {categories.map(
            category=>{

              const active=
                selectedCategory===
                category;


              return(

                <TouchableOpacity
                  key={category}

                  style={[

                    styles.categoryButton,

                    active&&
                    styles.categoryButtonActive

                  ]}

                  activeOpacity={0.8}

                  onPress={()=>{

                    setSelectedCategory(
                      current=>
                        current===category
                          ? '全部'
                          : category
                    );

                  }}
                >

                  <Text
                    style={[

                      styles.categoryText,

                      active&&
                      styles.categoryTextActive

                    ]}
                  >

                    {category}

                  </Text>

                </TouchableOpacity>

              );

            }
          )}

        </ScrollView>

      </View>


      {/* 当前区域工作数量 */}

      <View
        pointerEvents="box-none"

        style={
          styles.mapInfoArea
        }
      >

        <View
          style={
            styles.mapInfoPill
          }
        >

          <Text
            style={
              styles.areaCountText
            }
          >

            当前区域有 {currentAreaJobCount} 个工作

          </Text>


          <View
            style={
              styles.mapInfoDivider
            }
          />


          <TouchableOpacity
            style={
              styles.hideJobsTouch
            }

            activeOpacity={0.7}

            onPress={
              toggleJobsHidden
            }
          >

            <Text
              style={[

                styles.hideJobsText,

                jobsHidden&&
                styles.hideJobsTextActive

              ]}
            >

              {jobsHidden
                ? '显示工作'
                : '隐藏工作'}

            </Text>

          </TouchableOpacity>

        </View>

      </View>


      {/* 小工作卡片 */}

      {selectedJob&&
       !detailOpen&&
       showJobs&&(

        <Animated.View
          pointerEvents="box-none"

          style={[

            styles.smallCardWrap,

            {
              opacity:
                smallOpacity,

              transform:[
                {
                  translateY:
                    smallY
                }
              ]
            }

          ]}
        >

          <JobSmallCard
            job={
              selectedJob
            }

            onClose={
              closeJob
            }

            onDetail={
              openDetail
            }
          />

        </Animated.View>

      )}


      {/* 大工作详情卡 */}

      {selectedJob&&
       detailOpen&&
       showJobs&&(

        <Animated.View
          pointerEvents="box-none"

          style={[

            styles.detailCardWrap,

            {
              opacity:
                detailOpacity,

              transform:[
                {
                  translateY:
                    detailY
                }
              ]
            }

          ]}
        >

          <JobDetailCard
            job={
              selectedJob
            }

            onClose={
              closeDetail
            }
          />

        </Animated.View>

      )}


      {/* ========================= */}
      {/* 底部导航栏 */}
      {/* ========================= */}

      <View style={styles.bottomDock}>


        {/* 地图 */}

        <TouchableOpacity
          style={styles.navItem}
          activeOpacity={0.7}
        >

          <View
            style={
              styles.activeDot
            }
          />

          <Text
            style={
              styles.navTextActive
            }
          >
            地图
          </Text>

        </TouchableOpacity>


        {/* 信息广场 */}


<Link href="/square" asChild>
  <TouchableOpacity
    style={styles.navItem}
    activeOpacity={0.7}
  >
    <View style={styles.inactiveDot} />

    <Text style={styles.navText}>
      信息广场
    </Text>
  </TouchableOpacity>
</Link>



{/* 中间发布按钮 */}

<View style={styles.plusSpace}>

<Link href="/publish-job" asChild>
  <TouchableOpacity
    style={styles.plusButton}
    activeOpacity={0.85}
  >

    <Text style={styles.plusText}>
      +
    </Text>

  </TouchableOpacity>
</Link>

<Text style={styles.plusLabel}>
  发布
</Text>

</View>


        {/* 收藏 */}

        <TouchableOpacity
          style={styles.navItem}
          activeOpacity={0.7}
        >

          <View
            style={
              styles.inactiveDot
            }
          />

          <Text
            style={
              styles.navText
            }
          >
            收藏
          </Text>

        </TouchableOpacity>


        {/* 我的 */}

        <TouchableOpacity
          style={styles.navItem}
          activeOpacity={0.7}
        >

          <View
            style={
              styles.inactiveDot
            }
          />

          <Text
            style={
              styles.navText
            }
          >
            我的
          </Text>

        </TouchableOpacity>


      </View>


    </View>

  );

}


const styles=
  StyleSheet.create({


    container:{
      flex:1,
      backgroundColor:'#fff'
    },


    map:{
      ...StyleSheet.absoluteFillObject
    },


    /*
      顶部搜索区域
    */

    topArea:{
      position:'absolute',

      top:58,
      left:0,
      right:0,

      zIndex:40
    },


    searchWrap:{
      marginHorizontal:16
    },


    searchInput:{
      height:50,

      backgroundColor:'#fff',

      borderRadius:16,

      paddingHorizontal:18,

      fontSize:15,
      color:'#111',

      shadowColor:'#000',
      shadowOpacity:0.16,
      shadowRadius:10,

      shadowOffset:{
        width:0,
        height:3
      },

      elevation:8
    },


    /*
      分类
    */

    categoryContent:{
      paddingHorizontal:16,
      paddingTop:10,
      paddingBottom:8
    },


    categoryButton:{
      height:34,

      paddingHorizontal:14,

      marginRight:8,

      borderRadius:17,

      backgroundColor:'#fff',

      justifyContent:'center',
      alignItems:'center',

      shadowColor:'#000',
      shadowOpacity:0.10,
      shadowRadius:6,

      shadowOffset:{
        width:0,
        height:2
      },

      elevation:5
    },


    categoryButtonActive:{
      backgroundColor:'#6F8F7A'
    },


    categoryText:{
      color:'#444',
      fontSize:13,
      fontWeight:'700'
    },


    categoryTextActive:{
      color:'#fff',
      fontWeight:'800'
    },


    /*
      当前区域工作数量
    */

    mapInfoArea:{
      position:'absolute',

      top:160,
      left:0,
      right:0,

      zIndex:35,

      alignItems:'center'
    },


    mapInfoPill:{
      height:36,

      flexDirection:'row',
      alignItems:'center',

      backgroundColor:
        'rgba(255,255,255,0.96)',

      borderRadius:18,

      paddingLeft:14,
      paddingRight:6,

      shadowColor:'#000',
      shadowOpacity:0.10,
      shadowRadius:6,

      shadowOffset:{
        width:0,
        height:2
      },

      elevation:5
    },


    areaCountText:{
      color:'#444',
      fontSize:12,
      fontWeight:'800'
    },


    mapInfoDivider:{
      width:1,
      height:16,

      marginHorizontal:10,

      backgroundColor:'#DADADA'
    },


    hideJobsTouch:{
      height:30,

      paddingHorizontal:8,

      justifyContent:'center',
      alignItems:'center'
    },


    hideJobsText:{
      color:'#365E7D',
      fontSize:12,
      fontWeight:'900'
    },


    hideJobsTextActive:{
      color:'#6F8F7A'
    },


    /*
      工作卡片
    */

    smallCardWrap:{
      ...StyleSheet.absoluteFillObject,
      zIndex:50
    },


    detailCardWrap:{
      ...StyleSheet.absoluteFillObject,
      zIndex:60
    },


    /*
      =========================
      底部导航栏
      =========================
    */

    bottomDock:{
      position:'absolute',

      left:0,
      right:0,
      bottom:0,

      height:92,

      backgroundColor:
        'rgba(255,255,255,0.98)',

      borderTopWidth:1,
      borderTopColor:'#ECECEC',

      flexDirection:'row',
      alignItems:'flex-start',
      justifyContent:'space-around',

      paddingTop:13,
      paddingBottom:18,

      zIndex:100,

      shadowColor:'#000',
      shadowOpacity:0.08,
      shadowRadius:12,

      shadowOffset:{
        width:0,
        height:-3
      },

      elevation:25
    },


    navItem:{
      flex:1,

      height:58,

      justifyContent:'center',
      alignItems:'center'
    },


    activeDot:{
      width:8,
      height:8,

      borderRadius:4,

      backgroundColor:'#6F8F7A',

      marginBottom:7
    },


    inactiveDot:{
      width:8,
      height:8,

      borderRadius:4,

      backgroundColor:'#D8D8D8',

      marginBottom:7
    },


    navText:{
      color:'#888',
      fontSize:11,
      fontWeight:'700'
    },


    navTextActive:{
      color:'#6F8F7A',
      fontSize:11,
      fontWeight:'900'
    },


    /*
      中间 +
    */

    plusSpace:{
      flex:1,

      height:65,

      alignItems:'center',

      marginTop:-15
    },


    plusButton:{
      width:58,
      height:58,

      borderRadius:29,

      backgroundColor:'#111',

      borderWidth:5,
      borderColor:'#fff',

      justifyContent:'center',
      alignItems:'center',

      shadowColor:'#000',
      shadowOpacity:0.22,
      shadowRadius:8,

      shadowOffset:{
        width:0,
        height:4
      },

      elevation:12
    },


    plusText:{
      color:'#fff',

      fontSize:34,
      fontWeight:'300',

      lineHeight:36,

      marginTop:-2
    },


    plusLabel:{
      marginTop:2,

      color:'#777',

      fontSize:10,
      fontWeight:'700'
    }


  });