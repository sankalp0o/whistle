/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, {
  AppRegistry,
  Component,
  Image,
  StyleSheet,
  Text,
  View
} from 'react-native';

import { Button, Icon } from 'react-native-material-design';


class whistle extends Component {
  render() {
    return (
        <View style={styles.container}>
          <View style={styles.appBar}>
            <Text style={styles.titleText}>CODECAMP16</Text>
            <View style={styles.iconContainer}> 
              <Icon style={styles.titleIcon} name="menu" color="rgba(255,255,255,1)" />
            </View>
            </View>
          <Image style={styles.imageCentre} source={{uri: 'https://d13yacurqjgara.cloudfront.net/users/26792/screenshots/2565067/rd4.jpg'}} />
          <Button text="NORMAL FLAT" onPress={()=> console.log("I pressed a flat button")} />
          <Button text="NORMAL RAISED" raised={true} onPress={()=> console.log("I pressed a raised button")} />

        </View>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    flexDirection: 'column',
  },
  appBar: {
    flexDirection: 'row',
    height: 56,
    backgroundColor: 'blue',
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'left',
    marginLeft: 24,
    marginTop: 15,
    flex: 3,
  },
  iconContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  titleIcon: {
    width: 20,
    height: 20,
    marginRight: 24,
    marginTop: 15,
  },
  imageCentre:{
    width: 200,
    height: 200,
    alignSelf: 'center',
  },
});

AppRegistry.registerComponent('whistle', () => whistle);






