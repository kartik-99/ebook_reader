import React from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {Divider} from 'react-native-elements/dist/divider/Divider';

function SpeechOptionsElaborate(props) {
  return (
    <View style={styles.view}>
      <TouchableOpacity style={styles.button}>
        <Text>1x</Text>
      </TouchableOpacity>
      <Divider orientation="vertical" />
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'space-evenly',
        }}>
        <TouchableOpacity style={styles.button}>
          <MaterialIcon name="skip-previous" size={25} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <MaterialIcon name="fast-rewind" size={25} style={styles.icon} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.playButton}>
        <MaterialIcon name="play-arrow" size={25} style={styles.icon} />
      </TouchableOpacity>
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'space-evenly',
        }}>
        <TouchableOpacity style={styles.button}>
          <MaterialIcon name="skip-next" size={25} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <MaterialIcon name="fast-forward" size={25} style={styles.icon} />
        </TouchableOpacity>
      </View>
      <Divider orientation="vertical" />
      <TouchableOpacity style={styles.button}>
        <MaterialIcon name="stop" size={25} style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
}

export default SpeechOptionsElaborate;

const styles = StyleSheet.create({
  view: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    padding: 10,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#cccccc',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    height: 35,
    width: 35,
    borderRadius: 35,
    margin: 5,
  },
  playButton: {
    backgroundColor: '#cccccc',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    width: 60,
    borderRadius: 60,
  },
  icon: {padding: '0%'},
});
