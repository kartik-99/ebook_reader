// libs
import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  SafeAreaView,
} from 'react-native';
import {BarChart} from 'react-native-gifted-charts';
import {connect} from 'react-redux';
import {monthName} from '../util/constants';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
// internal
import * as actions from '../redux/actions';
import {
  getWeek,
  getDailyStreak,
  getDailyTargetStreak,
  getMonths,
  getCurrentMonth,
} from '../util/stats';
import {Card} from 'react-native-elements';
import {Divider} from 'react-native-elements/dist/divider/Divider';

function Statistics(props) {
  props.navigation.setOptions({
    headerStyle: {
      backgroundColor: '#6300ef',
    },
    headerTitleStyle: {
      color: '#fff',
    },
    headerTintColor: 'white',
    // header: {tintColor: 'white'},
  });
  const [monthData, setMonthData] = useState({
    name:
      monthName[
        parseInt(getCurrentMonth().substring(0, getCurrentMonth().indexOf('.')))
      ],
    books: props.files.progress.monthly[getCurrentMonth()],
  });
  let dstreak = getDailyStreak(props.files.progress.daily);
  let dtstreak = getDailyTargetStreak(
    props.files.progress.daily,
    props.files.targets.daily,
  );
  let currWeek = getWeek();
  let latestMonths = getMonths();

  let dailyBarData = currWeek.map((day) => {
    let value =
      props.files.progress.daily[day] == undefined
        ? 0
        : props.files.progress.daily[day] / 60000;
    return {
      value: value,
      label: day.substring(0, day.indexOf('.')),
      frontColor: value > props.files.targets.daily ? '#177AD5' : '#DE651F',
      topLabelComponent: () => {
        return <Text>{Math.floor(value)}</Text>;
      },
      onPress: (inp) => {
        let rets = {date: day, value: value};
        console.log(rets);
        return rets;
      },
    };
  });

  let monthlyBarData = latestMonths.map((month) => {
    let value =
      props.files.progress.monthly[month] === undefined
        ? 0
        : props.files.progress.monthly[month].length;
    return {
      value: value,
      label: monthName[parseInt(month.substring(0, month.indexOf('.')))],
      frontColor: value > props.files.targets.monthly ? '#177AD5' : '#DE651F',
      topLabelComponent: () => {
        return <Text>{value}</Text>;
      },
      onPress: (inp) => {
        let rets = {
          name: monthName[parseInt(month.substring(0, month.indexOf('.')))],
          books: props.files.progress.monthly[month],
        };
        console.log(rets);
        setMonthData(rets);
        return rets;
      },
    };
  });

  // console.log(monthlyBarData);
  return (
    <SafeAreaView style={{flex: 1, height: '100%'}}>
      <ScrollView style={{flex: 1, height: '100%'}}>
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            alignItems: 'center',
            height: '100%',
          }}>
          {dstreak > 0 && (
            <View style={{alignItems: 'center', width: '100%'}}>
              <TouchableOpacity style={styles.streakCard}>
                <Text>
                  <Text style={{fontWeight: 'bold'}}>{dstreak}</Text> Days
                  Streak of reading Daily!
                </Text>
                <Card.Divider color="#fff" />
                <Text>
                  <Text style={{fontWeight: 'bold'}}>{dtstreak}</Text> Days
                  Streak of meeting daily targets!
                </Text>
              </TouchableOpacity>
            </View>
          )}
          <Text style={styles.text}>Minutes of reading daily</Text>

          <View
            style={{
              flexDirection: 'column',
              alignItems: 'baseline',
              alignContent: 'center',
              justifyContent: 'center',
            }}>
            <BarChart
              style={{width: '100%'}}
              barWidth={30}
              noOfSections={4}
              barBorderRadius={4}
              data={dailyBarData}
              yAxisThickness={0}
              xAxisThickness={3}
            />
          </View>
          <Text style={styles.text}>Books read Monthly</Text>
          <View
            style={{
              alignItems: 'baseline',
              alignContent: 'center',
              justifyContent: 'center',
              paddingTop: 10,
            }}>
            <BarChart
              style={{width: '100%'}}
              barWidth={30}
              noOfSections={4}
              barBorderRadius={4}
              data={monthlyBarData}
              yAxisThickness={0}
              xAxisThickness={3}
            />
          </View>
        </View>
        {monthData.books !== undefined && (
          <>
            <Text style={styles.text}>
              Books Read in month : {monthData.name}
            </Text>
            <View
              style={{
                flexDirection: 'column',
                alignItems: 'baseline',
                alignContent: 'center',
                justifyContent: 'center',

                padding: 20,
              }}>
              {monthData.books.map((book) => {
                return (
                  <>
                    <Text style={styles.thinText}>{book}</Text>
                    <Divider orientation="horizontal" color="#000" />
                  </>
                );
              })}
            </View>
          </>
        )}
        <View style={{alignItems: 'center', width: '100%'}}>
          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                'Warning',
                'This will reset your daily and monthly targets! Are you sure?',
                [
                  {
                    text: 'Yes',
                    onPress: () => {
                      props.resetTargets();
                      console.log('Yes button clicked');
                      props.navigation.replace('Onboarder');
                    },
                  },
                  {
                    text: 'No',
                    onPress: () => console.log('No button clicked'),
                    style: 'cancel',
                  },
                ],
                {
                  cancelable: true,
                },
              );
            }}
            style={{...styles.streakCard, backgroundColor: '#FFC300'}}>
            <Text style={{fontWeight: 'bold'}}>Reset Targets</Text>
          </TouchableOpacity>
        </View>
        <View style={{alignItems: 'center', width: '100%'}}>
          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                'Warning',
                'This will reset all your progress! Are you sure?',
                [
                  {
                    text: 'Yes',
                    onPress: () => {
                      props.resetStats();
                      props.navigation.replace('Library');
                      console.log('Yes button clicked');
                    },
                  },
                  {
                    text: 'No',
                    onPress: () => console.log('No button clicked'),
                    style: 'cancel',
                  },
                ],
                {
                  cancelable: true,
                },
              );
            }}
            style={{...styles.streakCard, backgroundColor: '#FF0000'}}>
            <Text style={{fontWeight: 'bold', color: '#fff'}}>
              Reset Statistics
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
function mapStateToProps(state) {
  return {files: state.files};
}

export default connect(mapStateToProps, actions)(Statistics);

const styles = StyleSheet.create({
  streakCard: {
    padding: 15,
    margin: 10,
    backgroundColor: '#FF9005',
    width: '90%',
    borderRadius: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 2, height: 3},
    shadowOpacity: 0.7,
    shadowRadius: 1,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: 'bold',
    width: '100%',
    textAlign: 'center',
    paddingTop: 20,
  },
  thinText: {
    width: '100%',
    textAlign: 'left',
    paddingTop: 20,
    // backgroundColor: '#000',
  },
});
