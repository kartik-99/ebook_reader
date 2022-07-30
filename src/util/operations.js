import RNFS from 'react-native-fs';
import {unzip} from 'react-native-zip-archive';
var parser = require('fast-xml-parser');
import {Platform} from 'react-native';
const dirpath = RNFS.DocumentDirectoryPath;

export const getBookData = async (res) => {
  var title,
    author,
    coverPath = '';
  try {
    // unzipping ebook
    let unzipped_path = await unzip(
      res.fileCopyUri,
      dirpath + '/serverRoot/' + res.name.split('.')[0],
    );

    // reading container for metadata path
    let metapath = unzipped_path + '/META-INF/container.xml';
    if (await RNFS.exists(metapath)) {
      let cont = await RNFS.readFile(metapath);
      let container = parser.parse(cont, {ignoreAttributes: false});

      // reading metadata
      let opf = await RNFS.readFile(
        unzipped_path +
          '/' +
          container.container.rootfiles.rootfile['@_full-path'],
      );
      let parsed_opf = parser.parse(opf, {ignoreAttributes: false});

      // title
      if (typeof parsed_opf.package.metadata['dc:title'] !== 'string') {
        title = parsed_opf.package.metadata['dc:title']['#text'];
      } else {
        title = parsed_opf.package.metadata['dc:title'];
      }

      // author
      if (typeof parsed_opf.package.metadata['dc:creator'] !== 'string') {
        author = parsed_opf.package.metadata['dc:creator']['#text'];
      } else {
        author = parsed_opf.package.metadata['dc:creator'];
      }

      // cover path
      parsed_opf.package.manifest.item.forEach((item) => {
        if (
          item['@_id'].toLowerCase().includes('cover') &&
          item['@_media-type'].startsWith('image')
        ) {
          coverPath = 'file://' + unzipped_path + '/' + item['@_href'];
        }
      });
      if (!(await RNFS.exists(coverPath))) coverPath = '';
    }
  } catch (err) {
    console.log('Error : ', err);
  }

  // copy book into DocumentDirectoryPath at the time of selection
  let bookPath = RNFS.DocumentDirectoryPath + '/serverRoot/' + res.name;
  let acturi = Platform.OS === 'ios' ? decodeURI(res.uri) : res.uri;
  try {
    await RNFS.copyFile(acturi, bookPath);
    console.log('Book copied', res.name);
  } catch (err) {
    console.log('book uri invalid here specifically');
    console.log(err);
    console.log(acturi);
  }
  return [title, author, coverPath];
};

export async function setUpServerDir(book) {
  const path = RNFS.DocumentDirectoryPath + '/serverRoot';

  const existingFiles = [
    '/jszip.min.js',
    '/index.html',
    '/epub.min.js',
    '/epub.js',
  ];
  const files = [
    'serverRoot/jszip.min.js',
    'serverRoot/index.html',
    'serverRoot/epub.js',
    'serverRoot/' + Platform.OS + '/epub.min.js',
  ];

  try {
    // deleting existing files
    for (var i in existingFiles) {
      console.log(path + existingFiles[i]);
      try {
        await RNFS.unlink(path + existingFiles[i]);
        console.log('File deleted : ', existingFiles[i]);
      } catch (error) {
        console.log('Deletion Error : ', error);
      }
    }
    // copying base files
    if (Platform.OS === 'android') {
      //android
      if (!(await RNFS.exists(path))) {
        await RNFS.mkdir(path);
      }
      await files.forEach(async (file) => {
        let destPath = file.endsWith('epub.min.js')
          ? RNFS.DocumentDirectoryPath + '/serverRoot/epub.min.js'
          : RNFS.DocumentDirectoryPath + '/' + file;
        if (!(await RNFS.exists(destPath))) {
          await RNFS.copyFileAssets(file, destPath);
        }
      });
    } else {
      //ios
      if (!(await RNFS.exists(path))) {
        await RNFS.mkdir(path, {
          NSURLIsExcludedFromBackupKey: true,
        });
      }
      await files.forEach(async (file) => {
        let destpath = file.endsWith('epub.min.js')
          ? RNFS.DocumentDirectoryPath + '/serverRoot/epub.min.js'
          : RNFS.DocumentDirectoryPath + '/' + file;

        if (!(await RNFS.exists(destpath))) {
          await RNFS.copyFile(RNFS.MainBundlePath + '/' + file, destpath);
        }
      });
    }

    // removed copying book from here since it is already done during selection
    // let bookPath = RNFS.DocumentDirectoryPath + '/serverRoot/' + book.name;
    // if (!(await RNFS.exists(bookPath))) {
    //   await RNFS.copyFile(book.uri, bookPath);
    // } else {
    //   console.log('book uri invalid');
    // }
  } catch (err) {
    console.log('Error during server setup : ');
    console.log(err);
  }
}
