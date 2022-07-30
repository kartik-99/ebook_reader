import React, {useState, useEffect} from 'react';
import {StyleSheet} from 'react-native';
import {View, Animated} from 'react-native';
import {connect} from 'react-redux';

function SplashScreen(props) {
  useEffect(() => {
    function goToNextScreen() {
      props.files.onboarded
        ? props.navigation.replace('Library')
        : props.navigation.replace('Onboarder');
    }
    setTimeout(() => goToNextScreen(), 2000);
  }, []);
  const opacity = useState(new Animated.Value(0))[0];
  function fadeInLogo() {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
      }}>
      <Animated.Image
        onLoad={fadeInLogo}
        source={require('../../assets/images/logo_transparent_gradient_25.png')}
        style={{...styles.emptyImage, opacity}}
      />
    </View>
  );
}

function mapStateToProps(state) {
  return {files: state.files};
}

export default connect(mapStateToProps, null)(SplashScreen);

const styles = StyleSheet.create({
  emptyImage: {
    width: '100%',
    resizeMode: 'center',
  },
});
