import React from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {Divider} from 'react-native-elements/dist/divider/Divider';

function SpeechOptions(props) {
  return (
    <View style={styles.view}>
      <TouchableOpacity style={styles.button}>
        <Text>1x</Text>
      </TouchableOpacity>
      <Divider orientation="vertical" />
      <TouchableOpacity style={styles.button}>
        <MaterialIcon name="fast-rewind" size={25} style={styles.icon} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.playButton}>
        <MaterialIcon name="play-arrow" size={25} style={styles.icon} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <MaterialIcon name="fast-forward" size={25} style={styles.icon} />
      </TouchableOpacity>
      <Divider orientation="vertical" />
      <TouchableOpacity style={styles.button}>
        <MaterialIcon name="stop" size={25} style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
}

export default SpeechOptions;

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
    height: 40,
    width: 40,
    borderRadius: 40,
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
