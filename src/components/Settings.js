import React from 'react';
import {Platform, ScrollView} from 'react-native';
import SettingsItemAndroid from './SettingsItemAndroid';
import SettingsItemIos from './SettingsItemIos';
import {settings} from '../util/constants';

function SettingsItem(props) {
  if (Platform.OS == 'ios') return <SettingsItemIos {...props} />;
  else if (Platform.OS == 'android') return <SettingsItemAndroid {...props} />;
}

function Settings(props) {
  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollViewContent}>
      {settings.map((item, i) => (
        <SettingsItem {...item} key={i} bg={props.bg} fg={props.fg} />
      ))}
    </ScrollView>
  );
}

export default Settings;

const styles = {
  scrollView: {flex: 1},
  scrollViewContent: {
    alignItems: 'flex-start',
    paddingBottom: 50,
  },
};
