// libs
import React from 'react';
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  AppState,
  Animated,
  BackHandler,
  Alert,
} from 'react-native';
import StaticServer from 'react-native-static-server';
import WebView from 'react-native-webview';
import RNFS from 'react-native-fs';
import Drawer from 'react-native-drawer';
import {Divider} from 'react-native-elements/dist/divider/Divider';
import {connect} from 'react-redux';
import * as actions from '../redux/actions';
import DeviceInfo from 'react-native-device-info';
// internal
import DrawerContent from '../components/DrawerContent';
import {setUpServerDir} from '../util/operations';
import {themeToStyles} from '../util/themeUtils';
import Footer from '../components/Footer';
import TextOptions from '../components/TextOptions';
import SpeechOptions from '../components/SpeechOptions';
import Header from '../components/Header';
class ReaderScreen extends React.Component {
  // LIFECYLCE
  constructor(props) {
    super(props);
    this.state = {
      showMarginals: true,
      footerHeight: new Animated.Value(0),
      headerHeight: new Animated.Value(0),
      lastUploaded: null,
      lastDownloaded: null,
      startTime: new Date().valueOf(),
      loading: true,
      bookReady: false,
      progress: false,
      recievedLocationsFromWebview: false,
      url: null,
      showDrawer: false,
      showTextOptions: false,
      showSpeechOptions: false,
      searchResults: [],
      selection: {
        cfi: '',
        text: '',
      },
      selectedHighlight: undefined,
      highlights: [],
      markClicked: false,
      note: undefined,
      useOld: props.route.params.useOld,
    };
  }

  async componentDidMount() {
    this.appStateListener = AppState.addEventListener(
      'change',
      this._handleAppStateChange,
    );
    BackHandler.addEventListener('hardwareBackPress', this.goToLibrary);
    var common = `window.BOOK_PATH = "${this.props.route.params.name}";
    window.THEME = ${JSON.stringify(
      themeToStyles({
        bg: '#fafafa',
        fg: '#000000',
        size: '100%',
        height: 'normal',
      }),
    )};`;
    this.injectJSNew = `window.useOld=false;` + common;
    this.injectJSOld = `window.useOld=true;` + common;

    await setUpServerDir(this.props.route.params);
    const path = RNFS.DocumentDirectoryPath + '/serverRoot/';
    this.server = new StaticServer(8080, path, {
      localOnly: true,
      keepAlive: true,
    });
    this.server.start().then((url) => {
      let newState = this.state;
      newState.url = url;
      this.setState(newState);
    });
    console.log('Server setup complete');
  }

  componentWillUnmount() {
    this.closeReader();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.settings !== prevProps.settings) {
      this.injectTheme();
      this.toggleDrawer();
    }
  }

  // COMMUNICATION
  // Sending Messages
  sendMessage(obj) {
    var str = JSON.stringify(obj);
    if (!this.webref) {
      return;
    }
    this.webref.postMessage(str);
  }

  // Recieving Messages
  handleMessage = (mes) => {
    let parsedData = JSON.parse(mes.nativeEvent.data);
    if (parsedData.method !== 'locations' || parsedData.method !== 'contents') {
      console.log('message : ', parsedData);
    }
    let {method} = parsedData;

    switch (method) {
      case 'notOpening':
        if (this.state.useOld === false) {
          this.setUseOld(true);
          this.webref.reload();
          this.webref.injectJavaScript('window.useOld=true;true;');
        } else {
          Alert.alert(
            'We Apologise!',
            'We are not able to open this book. Kindly send this ebook to us for further inspection',
            [
              {
                text: 'OK',
                onPress: () => {
                  this.props.navigation.replace(
                    'Library',
                    this.props.route.params,
                  );
                },
              },
            ],
          );
        }

        break;
      case 'locations':
        var newState = this.state;
        newState.locations = JSON.parse(parsedData.locations);
        newState.totalPages = newState.locations.length;
        newState.progress = true;
        newState.recievedLocationsFromWebview = true;
        this.setState(newState);
        break;
      case 'loc':
        if (this.state.recievedLocationsFromWebview) {
          var newState = this.state;
          newState.currentPage = parsedData.progress;
          newState.progress = true;
          this.setState(newState);
        }
        break;
      case 'contents':
        var newState = this.state;
        newState.contents = parsedData.contents;
        newState.progress = true;
        this.setState(newState);
        break;
      case 'touchStarted':
        if (this.state.showTextOptions) {
          this.toggleTextOptions();
          this.updateSelection({cfi: '', text: ''});
          this.resetSelectedHighlight();
          this.state.markClicked === true && this.toggleMarkClicked();
        }
        break;
      case 'selected':
        this.state.showTextOptions === false && this.toggleTextOptions();
        this.updateSelection(parsedData);
        break;
      case 'searchResults':
        var newState = this.state;
        newState.searchResults = parsedData.results;
        this.setState(newState);
        break;
      case 'markClicked':
        this.state.markClicked === false && this.toggleMarkClicked();
        let highlight = this.state.highlights.find(
          (o) => o.cfi === parsedData.cfi,
        );
        this.updateSelection({cfi: parsedData.cfi, text: highlight.text});
        this.updateSelectedHighlight(highlight);
        this.state.showTextOptions === false && this.toggleTextOptions();
        console.log('state : ', this.state.markClicked, this.state.selection);
        break;
      case 'bookReady':
        this.webref.injectJavaScript('window.bookReady = true;true;');
        setTimeout(() => {
          var newState = this.state;
          newState.bookReady = true;
          this.setState(newState);
          this.setStartTime();
          this.periodicSaver = setInterval(() => this.saveReaderState(), 10000);
          this.restoreReaderState();
        }, 3000);
        break;
      case 'press':
        if (!this.state.markClicked) this.toggleMarginals();
        break;
    }
  };

  // MAINTAINING BOOK STATE
  // Saving book state
  saveReaderState = () => {
    if (
      this.state.lastUploaded !== null &&
      new Date().valueOf() - this.state.lastUploaded < 1000
    )
      return;

    if (this.state.bookReady && this.state.progress === false) {
      return;
    }

    var progressObject = {
      id: this.props.route.params.id,
      name: this.props.route.params.name,
      contents: this.state.contents,
      highlights: this.state.highlights,
      startTime: this.state.startTime,
      useOld: this.state.useOld,
    };
    if (
      this.state.locations !== undefined &&
      this.state.locations !== null &&
      this.state.locations.length !== 0
    ) {
      progressObject.locations = this.state.locations;
      progressObject.currentPage = this.state.currentPage;
    }
    this.props.saveBookProgress(progressObject);
    this.setlastUploadedTime();
    this.props.updateDailyTimer({
      time: new Date().valueOf() - this.state.startTime,
    });
    this.setStartTime();
    console.log('book saved');
  };

  // Restoring book state
  restoreReaderState = () => {
    if (
      this.state.lastDownloaded !== null &&
      new Date().valueOf() - this.state.lastDownloaded < 1000
    )
      return;

    this.state.loading === false && this.toggleLoading();
    // inject themes first
    this.injectTheme();

    // inject book state
    this.injectBookState();

    // inject highlights
    if (this.state.highlights.length !== 0) {
      for (const i in this.state.highlights) {
        let inj = `rendition.annotations.highlight('${this.state.highlights[i].cfi}', {}, (e) => { console.log(e) }, undefined, { 'fill': '${this.state.highlights[i].color}' });window.getSelection().removeAllRanges();true`;
        this.webref.injectJavaScript(inj);
        console.log(inj);
      }
    }

    // inject previous position
    if (this.state.currentPage != undefined && this.state.currentPage != null) {
      this.goToLocation(this.state.currentPage);
    }

    this.setlastDownloadedTime();
    this.state.loading && this.toggleLoading();
    console.log('book restored');
  };

  injectTheme = () => {
    let inj = `
      rendition.themes.register({ theme: ${JSON.stringify(
        themeToStyles(this.props.settings),
      )}});
      rendition.themes.select('theme');true`;
    this.webref.injectJavaScript(inj);
  };

  injectBookState = () => {
    let newState = this.state;
    // newState.contents = this.props.route.params.contents;
    newState.highlights = this.props.route.params.annotations.highlights;
    newState.locations = this.props.route.params.pages.locations;
    newState.currentPage = this.props.route.params.pages.currentPage;
    if (
      newState.locations !== undefined &&
      newState.locations !== null &&
      newState.locations.length !== 0
    ) {
      newState.totalPages = newState.locations.length;
    }
    this.setState(newState);
  };

  // NAVIGATION
  goPrev = () => {
    this.sendMessage({method: 'prev'});
  };

  goNext = () => {
    this.sendMessage({method: 'next'});
  };

  goToLocation = (n) => {
    let location = typeof n === 'number' ? this.state.locations[n] : n;
    let inj = `rendition.display('${location}');true`;
    this.webref.injectJavaScript(inj);
    console.log(inj);
    this.state.showDrawer && this.toggleDrawer();
  };

  // ANNOTATIONS
  highlight = (color) => {
    // first delete existing highlight if any
    let highlight = this.state.highlights.find(
      (o) => o.cfi === this.state.selection.cfi,
    );
    let note = undefined;
    if (highlight !== undefined) {
      if (highlight.note !== undefined) note = highlight.note;
      this.deleteAnnotation();
    }

    this.updateNote(note);
    // now create new highlight
    let inj = `rendition.annotations.highlight('${this.state.selection.cfi}', {}, (e) => { console.log(e) }, undefined, { 'fill': '${color}' });window.getSelection().removeAllRanges();true`;
    this.webref.injectJavaScript(inj);
    console.log(inj);
    this.addHighlight(color, note);
    // this.state.showTextOptions === true && this.toggleTextOptions();
  };

  deleteAnnotation = () => {
    let inj = `rendition.annotations.remove('${this.state.selection.cfi}', "highlight")`;
    for (let i = 0; i < 10; i++) {
      this.webref.injectJavaScript(inj);
    }

    console.log(inj);
    this.resetSelectedHighlight();
    // this.state.markClicked === true && this.toggleMarkClicked();
    this.removeHighlight();
    // this.state.showTextOptions === true && this.toggleTextOptions();
  };

  // BOOK SEARCH
  onSearch = (q) => {
    this.webref.injectJavaScript(`
      Promise.all(
        window.book.spine.spineItems.map((item) => {
          return item.load(window.book.load.bind(window.book)).then(() => {
            let results = item.find('${q}'.trim());
            item.unload();
            return Promise.resolve(results);
          });
        })
      ).then((results) =>
        sendMessage({ method: "searchResults", results: [].concat.apply([], results) })
      );true;`);
  };

  goToSearchResult = (cfi) => {
    this.goToLocation(cfi);
    let inj = `rendition.annotations.highlight('${cfi}', {}, (e) => { console.log(e) }, undefined, { 'fill': '#0000ff' });window.getSelection().removeAllRanges();true`;
    this.webref.injectJavaScript(inj);
    setTimeout(() => {
      // this.removeSearchResultHighlight(cfi);
      this.webref.injectJavaScript(
        `rendition.annotations.remove('${cfi}', "highlight")`,
      );
    }, 5000);
  };

  // BACKGROUND FUNCTIONS
  _handleAppStateChange = (nextAppState) => {
    if (nextAppState.match(/inactive|background/)) {
      this.saveReaderState();
      console.log('App has gone to the background!');
    } else {
      this.restoreReaderState();
      console.log('App has come to the foreground!');
    }
  };

  goToLibrary = () => {
    this.props.navigation.replace('Library');
    // this return statement is there because backhandler callback function needs a boolean return
    // default return is false, which closes the whole app. We do not want that. So return true has to be there
    return true;
  };

  closeReader = () => {
    this.saveReaderState();
    clearInterval(this.periodicSaver);
    if (this.server && this.server.isRunning()) {
      this.server.stop();
    }
    console.log('Server destroyed');

    // AppState.removeEventListener('change', this._handleAppStateChange);
    this.appStateListener.remove();
    BackHandler.removeEventListener('hardwareBackPress', this.goToLibrary);
  };

  // STATE MANIPULATION
  toggleDrawer = () => {
    let newState = this.state;
    newState.showDrawer = !this.state.showDrawer;
    this.setState(newState);
  };

  toggleTextOptions = () => {
    let newState = this.state;
    newState.showTextOptions = !this.state.showTextOptions;
    // remove selected highlight from state
    if (
      // this.state.showTextOptions &&
      this.state.selectedHighlight !== undefined
    ) {
      if (this.state.note !== undefined && this.state.note !== '') {
        newState.highlights.splice(
          newState.highlights.findIndex(
            (a) => a.cfi === this.state.selectedHighlight.cfi,
          ),
          1,
        );
        let tempHighlight = this.state.selectedHighlight;
        tempHighlight.note = this.state.note;
        newState.highlights.push(tempHighlight);
      }
      newState.selectedHighlight = undefined;
      newState.note = undefined;
    }
    this.setState(newState);
  };

  updateSelection = (obj) => {
    let newState = this.state;
    newState.selection = {
      cfi: obj.cfi,
      text: obj.text,
    };
    this.setState(newState);
  };

  updateSelectedHighlight = (highlight) => {
    let newState = this.state;
    newState.selectedHighlight = highlight;
    newState.note = highlight.note;
    this.setState(newState);
  };

  resetSelectedHighlight = () => {
    let newState = this.state;
    newState.selectedHighlight = undefined;
    newState.note = undefined;
    this.setState(newState);
  };

  updateNote = (note) => {
    let newState = this.state;
    newState.note = note;
    this.setState(newState);
  };

  addHighlight = (color, note) => {
    let newState = this.state;
    let newHighlight = {
      ...this.state.selection,
      color: color,
    };
    newHighlight.note = note;
    newState.highlights.push(newHighlight);
    newState.selectedHighlight = newHighlight;
    newState.progress = true;
    this.setState(newState);
  };

  removeHighlight() {
    let newState = this.state;
    newState.highlights.splice(
      newState.highlights.findIndex((a) => a.cfi === this.state.selection.cfi),
      1,
    );
    newState.progress = true;
    this.setState(newState);
  }

  toggleMarkClicked = () => {
    let newState = this.state;
    newState.markClicked = !this.state.markClicked;
    this.setState(newState);
  };

  toggleLoading = () => {
    let newState = this.state;
    newState.loading = !this.state.loading;
    this.setState(newState);
  };

  setStartTime = () => {
    let newState = this.state;
    newState.startTime = new Date().valueOf();
    this.setState(newState);
  };

  setlastUploadedTime = () => {
    let newState = this.state;
    newState.lastUploaded = new Date().valueOf();
    this.setState(newState);
  };

  setlastDownloadedTime = () => {
    let newState = this.state;
    newState.lastDownloaded = new Date().valueOf();
    this.setState(newState);
  };

  setUseOld = (val) => {
    var newState = this.state;
    newState.useOld = val;
    this.setState(newState);
  };

  toggleMarginals = () => {
    if (this.state.markClicked) return;
    let newState = this.state;
    newState.showMarginals = !this.state.showMarginals;
    this.setState(newState);

    let footerValue = newState.showMarginals ? 61 : 0;
    Animated.spring(this.state.footerHeight, {
      toValue: footerValue,
      velocity: 3,
      tension: 2,
      friction: 8,
      useNativeDriver: false,
    }).start();

    let headerValue = newState.showMarginals ? -70 : 0;
    Animated.spring(this.state.headerHeight, {
      toValue: headerValue,
      velocity: 3,
      tension: 2,
      friction: 8,
      useNativeDriver: false,
    }).start();
  };

  // RENDER
  render() {
    if (!this.state.url) {
      return (
        <SafeAreaView>
          <Text>Opening Book...</Text>
        </SafeAreaView>
      );
    }
    return (
      <SafeAreaView style={{backgroundColor: '#000', flex: 1}}>
        <Drawer
          type="overlay"
          side="right"
          tapToClose={true}
          open={this.state.showDrawer}
          onOpen={() => {
            !this.state.showDrawer && this.toggleDrawer();
          }}
          onClose={() => {
            this.state.showDrawer && this.toggleDrawer();
          }}
          content={
            <DrawerContent
              bookContents={this.state.contents}
              goToLocation={this.goToLocation}
              goToSearchResult={this.goToSearchResult}
              onSearch={this.onSearch}
              searchResults={this.state.searchResults}
              highlights={this.state.highlights}
              style={{marginLeft: 10, marginTop: 40, marginBottom: 40}}
              bg={this.props.settings.bg}
              fg={this.props.settings.fg}
            />
          }
          openDrawerOffset={DeviceInfo.isTablet() ? 0.6 : 0.2}>
          <View
            style={{
              height: '100%',
              width: '100%',
              backgroundColor: this.props.settings.bg,
              overflow: 'hidden',
            }}>
            {this.state.loading && (
              <View style={styles.loading}>
                <ActivityIndicator
                  animating={true}
                  size="large"
                  style={{opacity: 1}}
                  color="#fff"
                />
              </View>
            )}

            <Animated.View
              style={{
                ...styles.marginal,
                top: 0,
                transform: [{translateY: this.state.headerHeight}],
              }}>
              <Header
                goBack={this.goToLibrary}
                showDrawer={this.toggleDrawer}
                title={this.props.route.params.title}
                bg={this.props.settings.bg}
                fg={this.props.settings.fg}
              />
              <Divider orientation="horizontal" />
              {this.state.showTextOptions && (
                <TextOptions
                  highlight={this.highlight}
                  selectedHighlight={this.state.selectedHighlight}
                  underline={this.underline}
                  deleteAnnotation={this.deleteAnnotation}
                  markClicked={this.state.markClicked}
                  note={this.state.note}
                  updateNote={this.updateNote}
                  bg={this.props.settings.bg}
                  fg={this.props.settings.fg}
                />
              )}
            </Animated.View>

            <WebView
              style={{flex: 1, backgroundColor: this.props.settings.bg}}
              source={{uri: this.state.url}}
              ref={(r) => (this.webref = r)}
              injectedJavaScriptBeforeContentLoaded={
                this.state.useOld ? this.injectJSOld : this.injectJSNew
              }
              originWhitelist={['*']}
              onMessage={this.handleMessage}
              javaScriptEnabledAndroid={true}
            />

            <Animated.View
              style={{
                ...styles.marginal,
                bottom: 0,
                transform: [{translateY: this.state.footerHeight}],
              }}>
              <Divider orientation="horizontal" />
              {this.state.showSpeechOptions && <SpeechOptions />}
              <Divider orientation="horizontal" />

              <Divider orientation="horizontal" />
              <Footer
                currentPage={this.state.currentPage}
                totalPages={this.state.totalPages}
                goNext={this.goNext}
                goPrev={this.goPrev}
                goToLocation={this.goToLocation}
                recievedLocationsFromWebview={
                  this.state.recievedLocationsFromWebview
                }
                bg={this.props.settings.bg}
                fg={this.props.settings.fg}
              />
            </Animated.View>
          </View>
        </Drawer>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => ({
  settings: state.settings,
});

export default connect(mapStateToProps, actions)(ReaderScreen);

const styles = StyleSheet.create({
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.8,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    elevation: 40,
  },
  marginal: {
    width: '100%',
    position: 'absolute',
    backgroundColor: '#fff',
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -5,
    },
    shadowOpacity: 0.4,
    shadowRadius: 13.16,
    elevation: 30,
  },
});
