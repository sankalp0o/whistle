

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
  AsyncStorage,
} from 'react-native';


var userId;





//needed for using the form
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

//API URLs
var userApi = 'http://11.11.11.14:3000/api/users/';
//var getUserById = 'http://11.11.11.14:3000/api/users/';


class whistle extends React.Component{
  render() {
    return (
      <Navigator
        initialRoute={{id: 'welcome'}} //splash
        renderScene={this.navigatorRenderScene} />
    );
  }

  navigatorRenderScene(route, navigator) {
    _navigator = navigator;
    switch (route.id) {
      case 'splash':
        return (<SplashScreen navigator={navigator} title="Welcome"/>);
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
        return (<FriendProfile navigator={navigator} title="Friend" friendId={route.friendId} />);
      case 'modal':
        return (<ConfirmModal navigator={navigator} title="The modal" />);
    }
  }
}


class SplashScreen extends React.Component{
  navFirst(){
    this.props.navigator.push({
        id: this.getStartRoute()
    })
    console.log("userId in navFirst", userId);

  }

  getStartRoute() {
    console.log("userId in getStartRoute", userId);

    if (!userId) {return 'welcome'}
    else {return 'home'};
  }

  componentDidMount() {
    AsyncStorage.getItem("userId")
      .then((value) => {
        userId = value;
        console.log("User ID recieved", value);
        this.navFirst();
      })
      .catch((error) => {
        console.log(error);
      })
      .done();
  }

  render() {
    return (
      <View>
        <Text>CODECAMP16</Text>        

      </View>
    );
  }
}

class WelcomeScreen extends React.Component{
  navSecond(){
    this.props.navigator.push({
      id: 'home' // 'signup'
    })
  }
  render() {
    return (
      <View style={styles.welcomeScreen}>
        <Text style={{color: 'white', marginTop: 180, fontSize: 30,}}>CODECAMP16</Text>
        <Text>Gumakkad</Text>
        <TouchableHighlight style={styles.welcomeButton} onPress={this.navSecond.bind(this)}>
          <View style={{flexDirection: 'row', height: 48, alignItems: 'center', justifyContent: 'center',}}><Text style={styles.bodyText}>GET INTRODUCED</Text></View>
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
      fetch(userApi, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: value.full_name,
            emailID: value.email,
            phoneNumber: value.ten_digit_phone_number.toString(), //converted to string
            description: value.short_bio,
            skills: [value.skills], //converted to array
          })
      })
      .then((response) =>  response.json())
      .then((jsonData) => {
        console.log(jsonData.id);
        userId = jsonData.id;
        this.navThird();
      })
      // will have to work on error handling, lookup .catch error and how promises work
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
        <View style={{margin: 20}}>
          <Form
            ref="form"
            type={Person}
            options={options}
          />
         </View> 
        <TouchableHighlight style={styles.bottomButton} onPress={this.onPress}>
          <View style={{flexDirection: 'row', height: 48, alignItems: 'center', justifyContent: 'center',}}><Text style={styles.bodyText, { color: 'white', }}>SUBMIT</Text></View>
        </TouchableHighlight>
      </View>
    );
  }
};


class HomeScreen extends React.Component{

  onActionSelected = function(position){
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
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      loaded: false,
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    fetch(userApi)
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(responseData), //change movies with something else
          loaded: true,
        });
      })
      .done();
  }

  render() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }
    console.log("Inside render method", this);

    return (
      <View>
        <ToolbarAndroid style={styles.tb}
                          title={this.props.title}
                          titleColor={'#FFFFFF'}
                          actions={[{title: 'Notifications', icon: require('./notif.png'), show: 'always'},{title: 'Account', icon: require('./account.png'), show: 'always'}]}
                          onActionSelected={this.onActionSelected.bind(this)} />
        <Text style={styles.bodyText}>Welcome to codecamp</Text>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderUser.bind(this)}
          style={styles.listView}
        />
      </View>
    );
  }

  renderLoadingView() {
    return (
      <View style={styles.container}>
        <Text>
          Loading...
        </Text>
      </View>
    );
  }



  renderUser(userInfo) { //change this function to render a user 
    console.log("Abhishek", this);
    return (  
      <View>
        <TouchableHighlight 
          onPress={ () => this.seeFriend(userInfo.id) }
        >
        <View>
          <Text>{userInfo.name}</Text>
          <Text>{userInfo.id}</Text>
        </View>
        </TouchableHighlight>
      </View>
    );
  };

seeFriend(id) {
  this.props.navigator.push({
    id: 'profile',
    friendId: id,
  })

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

  constructor(props) {
    super(props);
    this.state = {
      userInfo: 'Loading ..',
    };
  }

  componentDidMount() {
    fetch(userApi)
      .then((response) =>response.json())
      .then((responseData) => {
        console.log(responseData[0].name);
        this.setState({userInfo: responseData[0].name});
      })

      .catch((error) => {
        console.warn(error);
    });
  }

  render() {
    
    return (
      <View>
        <ToolbarAndroid style={styles.tb}
                        title={this.props.title}
                        titleColor={'#FFFFFF'}
                        navIcon={require('./back.png')}
                        onIconClicked={this.props.navigator.pop}/>
          <Text style={styles.bodyText}>{this.state.userInfo}</Text>
      </View>
    );
  }
};


class FriendProfile extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      friendInfo: {
        name: "loading",
      },
      loaded: false,
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    fetch(userApi+this.props.friendId)
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({
          friendInfo: responseData,
          loaded: true,
        });
      })
      .done();
  }

  render() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }
    console.log("Inside render method", this);

    return (
      <View>
        <ToolbarAndroid style={styles.tb}
                        title={this.props.title}
                        titleColor={'#FFFFFF'}
                        navIcon={require('./back.png')}
                        onIconClicked={this.props.navigator.pop}/>
        <Text style={styles.bodyText}>This is a person</Text>
        <Text>{this.state.friendInfo.name}</Text>
        <Text>{this.props.friendId}</Text>
        
      </View>
    );
  }

  renderLoadingView() {
    return (
      <View style={styles.container}>
        <Text>
          Loading...
        </Text>
      </View>
    );
  }



  renderold() {

    return (
      <View>
        <ToolbarAndroid style={styles.tb}
                        title={this.props.title}
                        titleColor={'#FFFFFF'}
                        navIcon={require('./back.png')}
                        onIconClicked={this.props.navigator.pop}/>
          <Text style={styles.bodyText}>{this.props.friendId}</Text>

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
    fontSize: 16,
    color: '#16C340',
  },
  bottomButton: {
    backgroundColor: '#16C340',
    borderRadius: 24,
    width: 200,
    height: 48,
    alignSelf: 'center',
  },
  inputField: {
    height: 48,
  },
  welcomeScreen: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#16C340',
    flex: 1,
  },
  welcomeButton: {
    marginTop: 200,
    backgroundColor: 'white',
    borderRadius: 24,
    width: 200,
    height: 48,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  listView: {
    paddingTop: 20,
    backgroundColor: '#F5FCFF',
  },
});



AppRegistry.registerComponent('whistle', () => whistle);
