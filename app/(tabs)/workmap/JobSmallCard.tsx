import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Job } from './data/JOBS';




type JobSmallCardProps={
  job:Job;
  onClose:()=>void;
  onDetail:()=>void;
};


export default function JobSmallCard({
  job,
  onClose,
  onDetail
}:JobSmallCardProps){

  return(

    <View style={styles.card}>

      <View style={styles.content}>

        <View style={styles.topRow}>

          <View style={styles.titleBox}>

            <Text style={styles.title}>
              {job.title}
            </Text>

            <Text style={styles.area}>
              {job.area}
            </Text>

          </View>


          <TouchableOpacity
            style={
              styles.closeButton
            }

            onPress={
              onClose
            }

            activeOpacity={0.7}
          >

            <Text
              style={
                styles.closeText
              }
            >
              ×
            </Text>

          </TouchableOpacity>

        </View>


        <View style={styles.infoRow}>

          <Text style={styles.pay}>
            {job.pay}
          </Text>

          <Text style={styles.extra}>
            {job.extra}
          </Text>

        </View>


        <View style={styles.bottomRow}>

          <Text style={styles.meta}>
            {job.distance} · {job.time}
          </Text>


          <TouchableOpacity
            style={
              styles.detailButton
            }

            onPress={
              onDetail
            }

            activeOpacity={0.8}
          >

            <Text
              style={
                styles.detailText
              }
            >
              查看详情
            </Text>

          </TouchableOpacity>

        </View>

      </View>

    </View>

  );

}


const styles=
  StyleSheet.create({

    card:{
      position:'absolute',

      left:12,
      right:12,

      /*
        原来是 bottom:20

        现在底部导航高度92，
        再留10px间距。
      */
      bottom:102,

      height:155,

      backgroundColor:'#fff',

      borderRadius:22,

      shadowColor:'#000',
      shadowOpacity:0.22,
      shadowRadius:14,

      shadowOffset:{
        width:0,
        height:5
      },

      elevation:20,

      overflow:'hidden'
    },


    content:{
      flex:1,

      paddingTop:18,
      paddingHorizontal:18,
      paddingBottom:8
    },


    topRow:{
      flexDirection:'row',
      alignItems:'flex-start'
    },


    titleBox:{
      flex:1
    },


    title:{
      fontSize:20,
      color:'#111',
      fontWeight:'900'
    },


    area:{
      marginTop:3,
      fontSize:13,
      color:'#777',
      fontWeight:'600'
    },


    closeButton:{
      width:32,
      height:32,

      borderRadius:16,

      justifyContent:'center',
      alignItems:'center',

      marginLeft:10
    },


    closeText:{
      fontSize:28,
      color:'#777',
      lineHeight:30
    },


    infoRow:{
      marginTop:12,

      flexDirection:'row',
      alignItems:'center'
    },


    pay:{
      fontSize:16,
      color:'#365E7D',
      fontWeight:'900'
    },


    extra:{
      marginLeft:10,

      fontSize:13,
      color:'#666',
      fontWeight:'600'
    },


    bottomRow:{
      marginTop:14,

      flexDirection:'row',
      alignItems:'center',
      justifyContent:'space-between'
    },


    meta:{
      fontSize:13,
      color:'#888',
      fontWeight:'600'
    },


    detailButton:{
      height:34,

      paddingHorizontal:15,

      borderRadius:17,

      backgroundColor:'#111',

      justifyContent:'center',
      alignItems:'center'
    },


    detailText:{
      color:'#fff',
      fontSize:13,
      fontWeight:'800'
    }

  });