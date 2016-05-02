

import React, {
  AppRegistry,
  Component,
  Image,
  StyleSheet,
  Text,
  View,
  Navigator,
  ToolbarAndroid,
  TouchableHighlight,
  ListView,
  TextInput,
} from 'react-native';

//var request = require('./node_modules/request');
var t = require('tcomb-form-native');
var Form = t.form.Form;
var Person = t.struct({
  full_name: t.String,              // a required string
//  surname: t.maybe(t.String),  // an optional string
  email: t.String,               // a required number
  ten_digit_phone_number: t.Number,
  short_bio: t.String,
  skills: t.String,
//  rememberMe: t.Boolean        // a boolean
});
var options = {};

class whistle extends React.Component{
  render() {
    return (
      <Navigator
        initialRoute={{id: 'welcome'}}
        renderScene={this.navigatorRenderScene} />
    );
  }

  navigatorRenderScene(route, navigator) {
    _navigator = navigator;
    switch (route.id) {
      case 'welcome':
        return (<WelcomeScreen navigator={navigator} title="Welcome"/>);
      case 'signUp':
        return (<SignScreen navigator={navigator} title="Fill the form" />);
      case 'home':
        return (<HomeScreen navigator={navigator} title="CODECAMP16" />);
      case 'notification':
        return (<NotificationScreen navigator={navigator} title="Friend Requests"/>);
      case 'account':
        return (<AccountScreen navigator={navigator} title="Your profile" />);
      case 'profile':
        return (<FriendProfile navigator={navigator} title="Friend" />);
      case 'modal':
        return (<ConfirmModal navigator={navigator} title="The modal" />);
        
      
        

    }
  }
}

class WelcomeScreen extends React.Component{
  navSecond(){
    this.props.navigator.push({
      id: 'signUp'
    })
  }
  render() {
    return (
      <View>
        <ToolbarAndroid style={styles.tb}
                        title={this.props.title}
                        titleColor={'#FFFFFF'}/>
        <TouchableHighlight style={styles.bottomButton} onPress={this.navSecond.bind(this)}>
          <Text style={styles.bodyText}>SIGN UP</Text>
        </TouchableHighlight>
      </View>
    );
  }
}


class SignScreen extends React.Component{
  navThird(){
    this.props.navigator.push({
      id: 'home'
    })
  };
  onPress = () => {

    // call getValue() to get the values of the form
    var value = this.refs.form.getValue();
    if (value) { // if validation fails, value will be null
      console.log(value); // value here is an instance of Person
      console.log(value.full_name);
      this.navThird();
      fetch('http://11.11.11.18:3000/api/users/', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: value.full_name,
            emailID: value.email,
            phoneNumber: value.ten_digit_phone_number.toString(), //convert to string
            description: value.short_bio,
            skills: [value.skills], //convert to array

          })
      })
      .catch((error) => {
        console.warn(error);
      });
    }
  }

      

  render() {
    return (
      <View>
        <ToolbarAndroid 
          style={styles.tb}
          title={this.props.title}
          titleColor={'#FFFFFF'}
        />

        <Form
          ref="form"
          type={Person}
          options={options}
        />

        <TouchableHighlight style={styles.bottomButton} 
//          onPress={this.navThird.bind(this)}
          onPress={this.onPress}
        >
          <Text style={styles.bodyText}>SUBMIT</Text>
        </TouchableHighlight>
      </View>
    );
  }
};


class HomeScreen extends React.Component{
  navnotif(){
    this.props.navigator.push({
      id: 'notification'
    })
  }
  onActionSelected= function(position){
    if (position === 0) {
      this.props.navigator.push({
        id: 'notification'
      })
    }
    else if (position === 1) {
      this.props.navigator.push({
        id: 'account'
      })
    }
  }

  render() {
    return (
      <View>
        <ToolbarAndroid style={styles.tb}
                        title={this.props.title}
                        titleColor={'#FFFFFF'}
                        actions={[{title: 'Notifications', icon: require('./notif.png'), show: 'always'},{title: 'Account', icon: require('./account.png'), show: 'always'}]}
                        onActionSelected={this.onActionSelected.bind(this)}/>
          <Text style={styles.bodyText}>Welcome to codecamp</Text>
      </View>
    );
  }
};


class NotificationScreen extends React.Component{
  render() {
    return (
      <View>
        <ToolbarAndroid style={styles.tb}
                        title={this.props.title}
                        titleColor={'#FFFFFF'}
                        navIcon={require('./back.png')}
                        onIconClicked={this.props.navigator.pop}/>

          <Text style={styles.bodyText}>These are the requests that you have</Text>
      </View>
    );
  }
};


class AccountScreen extends React.Component{
  render() {
    var userInfo="random value";
    fetch('http://11.11.11.18:3000/api/users/')
      .then(
        function(response) {
          userInfo = response;
        }
      )
      
      .catch((error) => {
        console.warn(error);
    });
    return (
      <View>
        <ToolbarAndroid style={styles.tb}
                        title={this.props.title}
                        titleColor={'#FFFFFF'}
                        navIcon={require('./back.png')}
                        onIconClicked={this.props.navigator.pop}/>
          <Text style={styles.bodyText}>{userInfo}</Text>
      </View>
    );
  }
};


class FriendProfile extends React.Component{
  
  render() {

    return (
      <View>
        <ToolbarAndroid style={styles.tb}
                        title={this.props.title}
                        titleColor={'#FFFFFF'}
                        navIcon={require('./notif.png')}
                        onIconClicked={this.props.navigator.pop}/>
          <Text style={styles.bodyText}>This is a person's profile</Text>
      </View>
    );
  }
};


class ConfirmModal extends React.Component{
  render() {
    return (
      <View>
        <ToolbarAndroid style={styles.tb}
                        title={this.props.title}
                        titleColor={'#FFFFFF'}
                        navIcon={require('./notif.png')}
                        onIconClicked={this.props.navigator.pop}/>
          <Text style={styles.bodyText}>Welcome to codecamp</Text>
      </View>
    );
  }
};


const styles = StyleSheet.create({
  tb:{
    height: 56,
    backgroundColor: '#16C340',
  },
  bodyText:{
    fontSize: 40,
  },
  bottomButton: {
    backgroundColor: 'red',
  },
  inputField: {
    height: 48,
  },
});



AppRegistry.registerComponent('whistle', () => whistle);
