import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Job } from './data/JOBS';



type JobDetailCardProps={
  job:Job;
  onClose:()=>void;
};

export default function JobDetailCard({
  job,
  onClose
}:JobDetailCardProps){

  return(

    <View style={styles.card}>

      <TouchableOpacity
        style={styles.closeButton}
        onPress={onClose}
        activeOpacity={0.7}
      >

        <Text style={styles.closeText}>
          ×
        </Text>

      </TouchableOpacity>

      <ScrollView
        style={styles.scroll}

        contentContainerStyle={
          styles.scrollContent
        }

        showsVerticalScrollIndicator={
          false
        }
      >

        <View style={styles.categoryBadge}>

          <Text style={styles.categoryText}>
            {job.category}
          </Text>

        </View>

        <Text style={styles.title}>
          {job.title}
        </Text>

        <Text style={styles.meta}>
          {job.area} · {job.distance} · {job.time}
        </Text>

        <View style={styles.payCard}>

          <Text style={styles.pay}>
            {job.pay}
          </Text>

          <Text style={styles.extra}>
            {job.extra}
          </Text>

        </View>

        <Text style={styles.sectionTitle}>
          工作介绍
        </Text>

        <Text style={styles.sectionText}>
          招聘一名{job.title}，工作稳定，具体工作内容和排班时间可与招聘方沟通。
        </Text>

        <Text style={styles.sectionTitle}>
          工作要求
        </Text>

        <Text style={styles.sectionText}>
          认真负责，能够按时到岗。有相关工作经验者优先，具体要求以招聘方沟通为准。
        </Text>

        <Text style={styles.sectionTitle}>
          工作时间
        </Text>

        <Text style={styles.sectionText}>
          具体班次和工作时间请联系招聘方确认。
        </Text>

        <Text style={styles.sectionTitle}>
          工作地点
        </Text>

        <Text style={styles.sectionText}>
          {job.area}
        </Text>

        <Text style={styles.sectionTitle}>
          招聘方
        </Text>

        <Text style={styles.sectionText}>
          招聘方信息将在后续接入真实发布数据。
        </Text>

        <View style={styles.safetyBox}>

          <Text style={styles.safetyTitle}>
            安全提醒
          </Text>

          <Text style={styles.safetyText}>
            求职过程中请注意核实招聘信息，不要提前支付押金、培训费或其他不明费用。
          </Text>

        </View>

      </ScrollView>

      <View style={styles.actionBar}>

        <TouchableOpacity
          style={styles.favoriteButton}
          activeOpacity={0.8}
        >

          <Text style={styles.favoriteText}>
            收藏
          </Text>

        </TouchableOpacity>

        <TouchableOpacity
          style={styles.contactButton}
          activeOpacity={0.8}
        >

          <Text style={styles.contactText}>
            联系招聘方
          </Text>

        </TouchableOpacity>

      </View>

    </View>

  );
}

const styles=
  StyleSheet.create({

    card:{
      position:'absolute',

      top:185,
      left:12,
      right:12,
      bottom:100,

      backgroundColor:'#fff',

      borderRadius:24,

      shadowColor:'#000',
      shadowOpacity:0.24,
      shadowRadius:18,

      shadowOffset:{
        width:0,
        height:6
      },

      elevation:25,

      overflow:'hidden'
    },

    closeButton:{
      position:'absolute',

      top:14,
      right:14,

      width:38,
      height:38,

      borderRadius:19,

      backgroundColor:
        'rgba(245,245,245,0.96)',

      justifyContent:'center',
      alignItems:'center',

      zIndex:10
    },

    closeText:{
      fontSize:27,
      color:'#555',
      fontWeight:'500',
      lineHeight:29
    },

    scroll:{
      flex:1
    },

    scrollContent:{
      paddingTop:24,
      paddingHorizontal:20,
      paddingBottom:110
    },

    categoryBadge:{
      alignSelf:'flex-start',

      backgroundColor:'#E8F0EB',

      paddingHorizontal:10,
      paddingVertical:6,

      borderRadius:12,

      marginTop:4
    },

    categoryText:{
      color:'#6F8F7A',
      fontSize:12,
      fontWeight:'800'
    },

    title:{
      marginTop:12,

      paddingRight:45,

      fontSize:26,
      color:'#111',
      fontWeight:'900'
    },

    meta:{
      marginTop:6,
      fontSize:13,
      color:'#777',
      fontWeight:'600'
    },

    payCard:{
      marginTop:18,

      backgroundColor:'#F4F7F9',

      borderRadius:18,

      padding:16
    },

    pay:{
      color:'#365E7D',
      fontSize:22,
      fontWeight:'900'
    },

    extra:{
      marginTop:5,
      color:'#666',
      fontSize:14,
      fontWeight:'600'
    },

    sectionTitle:{
      marginTop:24,
      fontSize:17,
      color:'#111',
      fontWeight:'900'
    },

    sectionText:{
      marginTop:8,
      color:'#555',
      fontSize:14,
      lineHeight:22
    },

    safetyBox:{
      marginTop:26,

      backgroundColor:'#F7F7F7',

      borderRadius:16,

      padding:15
    },

    safetyTitle:{
      fontSize:14,
      color:'#111',
      fontWeight:'900'
    },

    safetyText:{
      marginTop:6,
      fontSize:13,
      lineHeight:20,
      color:'#777'
    },

    actionBar:{
      position:'absolute',

      left:0,
      right:0,
      bottom:0,

      height:82,

      backgroundColor:'#fff',

      borderTopWidth:1,
      borderTopColor:'#EEEEEE',

      flexDirection:'row',
      alignItems:'center',

      paddingHorizontal:16,

      gap:10
    },

    favoriteButton:{
      width:84,
      height:48,

      borderRadius:24,

      borderWidth:1.5,
      borderColor:'#365E7D',

      justifyContent:'center',
      alignItems:'center'
    },

    favoriteText:{
      color:'#365E7D',
      fontSize:15,
      fontWeight:'800'
    },

    contactButton:{
      flex:1,
      height:48,

      borderRadius:24,

      backgroundColor:'#111',

      justifyContent:'center',
      alignItems:'center'
    },

    contactText:{
      color:'#fff',
      fontSize:15,
      fontWeight:'900'
    }

  });