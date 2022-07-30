import React from 'react';
import {View, Text, TouchableWithoutFeedback} from 'react-native';
import Slider from '@react-native-community/slider';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

function Footer(props) {
  function goTo(n) {
    props.goToLocation(n);
  }
  return (
    <View style={{...styles.wrapper, backgroundColor: props.bg}}>
      <TouchableWithoutFeedback onPress={props.goPrev}>
        <View style={styles.buttonWrapper}>
          <MaterialIcon name="chevron-left" size={24} color={props.fg} />
        </View>
      </TouchableWithoutFeedback>
      <View style={styles.progressWrapper}>
        {props.recievedLocationsFromWebview === false ? (
          <Text style={styles.text}>{'Loading...'}</Text>
        ) : (
          <Text
            style={{
              ...styles.text,
              color: props.fg,
            }}>{`${props.currentPage} / ${props.totalPages}`}</Text>
        )}
        <Slider
          style={styles.slider}
          disabled={props.totalPages === undefined}
          step={1}
          value={props.currentPage || 1}
          minimumValue={1}
          maximumValue={props.totalPages || 1}
          onSlidingComplete={goTo}
          minimumTrackTintColor={props.fg}
          maximumTrackTintColor={props.fg}
        />
      </View>
      <TouchableWithoutFeedback onPress={props.goNext}>
        <View style={styles.buttonWrapper}>
          <MaterialIcon name="chevron-right" size={24} color={props.fg} />
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

export default Footer;

const styles = {
  wrapper: {
    height: 60,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonWrapper: {
    height: 52,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressWrapper: {
    flex: 1,
    height: 52,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  text: {
    fontSize: 14,
    marginBottom: 8,
    marginTop: 8,
  },
  slider: {
    width: '95%',
    height: 6,
  },
};
