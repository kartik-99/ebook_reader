import React from 'react';
import {View, Platform} from 'react-native';

import SpeechOptionsSimple from './SpeechOptionsSimple';
import SpeechOptionsElaborate from './SpeechOptionsElaborate';

function SpeechOptions(props) {
  return (
    <View>
      {Platform.OS === 'ios' && <SpeechOptionsSimple {...props} />}
      {Platform.OS === 'android' && <SpeechOptionsElaborate {...props} />}
    </View>
  );
}

export default SpeechOptions;
