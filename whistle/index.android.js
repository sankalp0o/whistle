

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
  ScrollView,
} from 'react-native';


//~~~~~~~~~~~~~~~~~Local Storage~~~~~~~~~~~~~~~~~~~~
var userId; //used to store userid in shared preference
var store = require('react-native-simple-store');



//~~~~~~~~~~~~~~~ Needed for using the form ~~~~~~~~~~~~
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


//~~~~~~~~~~~~~~~API URLs~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//var userApi = 'http://11.11.11.38:3000/api/users/';
//var selfApi = 'http://11.11.11.38:3000/api/users/?filter[where][id]='; // followed by something like 5730171169a2d621a5b2b88a
//var userMappingApi = 'http://11.11.11.38:3000/api/userMappings/';
//var selfReqApi = 'http://11.11.11.38:3000/api/userMappings/?filter[where][receiver]='
console.log(userId);

var userApi = 'https://serene-basin-88933.herokuapp.com/api/users/';
var selfApi = 'https://serene-basin-88933.herokuapp.com/api/users/?filter[where][id]='; // followed by something like 5730171169a2d621a5b2b88a
var userMappingApi = 'https://serene-basin-88933.herokuapp.com/api/userMappings/';
var selfReqApi = 'https://serene-basin-88933.herokuapp.com/api/userMappings/?filter[where][receiver]='


class whistle extends React.Component{ //-------------------------------------------------------------------------------

  render() {
    return (
      <Navigator
        initialRoute={{id: 'home'}} //splash
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


class SplashScreen extends React.Component{ //------------------------------------------------------------------------------

  navFirst(){
    this.props.navigator.push({
        id: this.getStartRoute()
    })
    console.log("userId in navFirst", userId);

  }

  getStartRoute() {
    console.log("userId in getStartRoute", userId);

    if (!userId) {return 'welcome'}
    else {return 'welcome'}; //home
  }

  componentDidMount() {
    AsyncStorage.getItem("storedUserId")
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
      <View style={styles.container}>
        <Text>
          Loading...
        </Text>
      </View>
    );
  }
}


class WelcomeScreen extends React.Component{ //------------------------------------------------------------------------
  navSecond(){
    this.props.navigator.push({
      id: 'signUp' // 'signUp'
    })
  }
  render() {
    return (
      <View style={styles.welcomeScreen}>
        <Text style={{color: 'white', marginTop: 180, fontSize: 30,}}>CODECAMP16</Text>
        <Text>Gumakkad</Text>
        <TouchableHighlight style={styles.welcomeButton} onPress={this.navSecond.bind(this)} underlayColor={'#dddddd'}>
          <View style={{flexDirection: 'row', height: 48, alignItems: 'center', justifyContent: 'center',}}><Text style={styles.buttonText}>GET INTRODUCED</Text></View>
        </TouchableHighlight>
      </View>
    );
  }
}


class SignScreen extends React.Component{ //----------------------------------------------------------------------------


  constructor(props) {
    super(props);
    this.state = {
      requestSent:false,
    };
  }

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

      this.setState({requestSent: true,}) //changes the button to inactive

      fetch(userApi, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: value.full_name,
            emailId: value.email,
            phoneNumber: value.ten_digit_phone_number.toString(), //converted to string
            description: value.short_bio,
            skills: [value.skills], //converted to array
          })
      })
      .then((response) =>  response.json())
      .then((jsonData) => {
        console.log(jsonData.id);
        AsyncStorage.setItem('storedUserId', jsonData.id); //sets userID in AsyncStorage
        userId = jsonData.id; // sets the current userId for use in rest of the pages
      })
      .then(() => {
        this.navThird();
      })
      .catch((error) => {
        console.warn(error);   
      });
    }
  }

  render() {

    if (this.state.requestSent) {
      submitButton =  <View style={styles.inactiveBottomButton}>
                        <View style={{flexDirection: 'row', height: 48, alignItems: 'center', justifyContent: 'center',}}><Text style={styles.buttonText, { color: 'white', }}>SUBMITTING</Text></View>
                      </View>;
    }
    else {
      submitButton =  <TouchableHighlight style={styles.bottomButton} onPress={this.onPress} underlayColor={'#0C862A'}>
                        <View style={{flexDirection: 'row', height: 48, alignItems: 'center', justifyContent: 'center',}}><Text style={styles.buttonText, { color: 'white', }}>SUBMIT</Text></View>
                      </TouchableHighlight>;
    }

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
         {submitButton}
        
      </View>
    );
  }
};


class HomeScreen extends React.Component{ //-----------------------------------------------------------------------------------

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
          dataSource: this.state.dataSource.cloneWithRows(responseData),
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

      <View style={{ flex:1,}}>
        <ToolbarAndroid style={styles.tb}
                        title={this.props.title}
                        titleColor={'#FFFFFF'}
                        actions={[{title: 'Notifications', icon: require('./notif.png'), show: 'always'},{title: 'Account', icon: require('./account.png'), show: 'always'}]}
                        onActionSelected={this.onActionSelected.bind(this)} />
        <Text style={styles.subTitle}>PARTICIPANTS</Text>
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
          Fetching data from our slow servers on free plan...
        </Text>
      </View>
    );
  }



  renderUser(userInfo) {
    console.log("Abhishek", this);
    return (  
      <View style={styles.listElement}>
        <TouchableHighlight style={{height: 70,}} onPress={ () => this.seeFriend(userInfo.id) } underlayColor={'#dddddd'}>
        <View>
          <Text style={{fontSize: 20, color: 'black', marginTop: 12,}}>{userInfo.name}</Text>
          <Text style={{fontSize: 16, color: '#888888',}}>ID: {userInfo.id}</Text>
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


class NotificationScreen extends React.Component{ //-----------------------------------------------------------------------------------

  oldRender() {
    return (
      <View>
        

          <Text style={styles.subTitle}>These are the requests that you have</Text>
      </View>
    );
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
    fetch(selfReqApi+userId)
    .then((response) => response.json())
    /*.then((responseData) => async.map(responseData, function(item, index, arr){
      console.log("inside async-map", responseData);
      fetch(selfApi+item.sender)  
      .then((user) => user.json())
      .then((userJson) => userJson.map((currentValue) => {
        console.log("inside map", userJson[0].name);
        currentValue.senderName = userJson[0].name;
      }))
    }))*/
      
//        console.log("initial responseData",responseData);
        
       /* responseData.forEach((currentValue) => {
          console.log("currentValue",currentValue);
          console.log("Sender: ", currentValue.sender);
          fetch(selfApi+currentValue.sender)
            .then((user) => {
              console.log("user in json", user);
              return user.json();
            })
            .then((userJson) => {
              console.log("userJson name", userJson[0].name);
              currentValue.senderName = userJson[0].name;
              console.log("sender name", currentValue.senderName);
            })
        });*/
/*        var result = responseData.map(function(currentValue) {
          fetch(selfApi+currentValue.sender)
            .then((user) => {
              console.log("user in json", user);
              return user.json();
            })
            .then((userJson) => {
              console.log("userJson name", userJson[0].name);
              currentValue.senderName = userJson[0].name;
              console.log("sender name", currentValue.senderName);
            })
        });*/

/*        return (responseData.map(function(currentValue) {
          fetch(selfApi+currentValue.sender)
            .then((user) => {
              console.log("user in json", user);
              return user.json();
            })
            .then((userJson) => {
              console.log("userJson name", userJson[0].name);
              currentValue.senderName = userJson[0].name;
              console.log("sender name", currentValue.senderName);
            })
        }));*/

      .then((value) => {
        console.log("value", value);
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(value),
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

      <View style={{ flex:1,}}>
        <ToolbarAndroid style={styles.tb}
                        title={this.props.title}
                        titleColor={'#FFFFFF'}
                        navIcon={require('./back.png')}
                        onIconClicked={this.props.navigator.pop}/>
        <Text style={styles.subTitle}>Requests</Text>
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



  renderUser(userInfo) {
    console.log("Abhishek", this);
    return (  
      <View style={styles.listElement}>
{/*        <TouchableHighlight style={{height: 70,}} onPress={ () => this.seeFriend(userInfo.id) }>*/}
        <View>
          <Text style={{fontSize: 20, color: 'black', marginTop: 12,}}>{userInfo.sender}</Text>
          <Text style={{fontSize: 16, color: '#888888',}}>ID: {userInfo.sender}</Text>
        </View>
{/*        </TouchableHighlight>*/}
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


class AccountScreen extends React.Component{ //-----------------------------------------------------------------------------------

  constructor(props) {
    super(props);
    this.state = {
      selfInfo: {
        name: "loading",
      },
      loaded: false,
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    fetch(selfApi+userId)
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({
          selfInfo: responseData[0],
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
        <Text style={styles.subheading}>NAME</Text>
        <Text style={styles.bodyText}>{this.state.selfInfo.name}</Text>
        <Text style={styles.subheading}>EMAIL</Text>
        <Text style={styles.bodyText}>{this.state.selfInfo.emailId}</Text>
        <Text style={styles.subheading}>PHONE NO.</Text>
        <Text style={styles.bodyText}>{this.state.selfInfo.phoneNumber}</Text>
        <Text style={styles.subheading}>SHORT BIO</Text>
        <Text style={styles.bodyText}>{this.state.selfInfo.description}</Text>
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
};


class FriendProfile extends React.Component{ //-----------------------------------------------------------------------------------

  constructor(props) {
    super(props);
    this.state = {
      friendInfo: {
        name: "loading",
      },
      loaded: false,
      requestSent:false,
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

    if (this.state.requestSent) {
      friendButton =  <View style={styles.inactiveBottomButton}>
                        <View style={{flexDirection: 'row', height: 48, alignItems: 'center', justifyContent: 'center',}}><Text style={styles.buttonText, { color: 'white', }}>REQUEST SENT</Text></View>
                      </View>;
    }
    else {
      friendButton =  <TouchableHighlight style={styles.bottomButton} onPress={this.onPress} underlayColor={'#0C862A'}>
                        <View style={{flexDirection: 'row', height: 48, alignItems: 'center', justifyContent: 'center',}}><Text style={styles.buttonText, { color: 'white', }}>ADD AS FRIEND</Text></View>
                      </TouchableHighlight>;
    }

    return (
      <View>
        <ToolbarAndroid style={styles.tb}
                        title={this.props.title}
                        titleColor={'#FFFFFF'}
                        navIcon={require('./back.png')}
                        onIconClicked={this.props.navigator.pop}/>
        <Text style={styles.subheading}>NAME</Text>
        <Text style={styles.bodyText}>{this.state.friendInfo.name}</Text>
        <Text style={styles.subheading}>EMAIL</Text>
        <Text style={styles.bodyText}>{this.state.friendInfo.emailId}</Text>
        <Text style={styles.subheading}>PHONE NO.</Text>
        <Text style={styles.bodyText}>{this.state.friendInfo.phoneNumber}</Text>
        <Text style={styles.subheading}>SHORT BIO</Text>
        <Text style={styles.bodyText}>{this.state.friendInfo.description}</Text>
        {friendButton}
        
      </View>
    );
  }

  onPress = () => {
    var value = {
      "sender": userId, //will need to change this !!! - - -   - -  
      "receiver": this.state.friendInfo.id,
      "status": "initiated"
    };
    fetch(userMappingApi, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(value)
    })
      .then((response) =>  response.json())
      .then((jsonData) => {

        this.setState({requestSent: true,})
      })
      .catch((error) => {
        console.warn(error);   
      });
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

};


class ConfirmModal extends React.Component{ //-----------------------------------------------------------------------------------
  render() {
    return (
      <View>
        <ToolbarAndroid style={styles.tb}
                        title={this.props.title}
                        titleColor={'#FFFFFF'}
                        navIcon={require('./notif.png')}
                        onIconClicked={this.props.navigator.pop}/>
          <Text style={styles.subTitle}>Welcome to codecamp</Text>
      </View>
    );
  }
};


const styles = StyleSheet.create({ //-------------------------------------------------------------------------------------------
  tb:{
    height: 56,
    backgroundColor: '#16C340',
  },
  buttonText:{
    fontSize: 16,
    color: '#16C340',
  },
  subTitle:{
    fontSize: 16,
    color: '#16C340',
    margin: 20,
  },
  bottomButton: {
    backgroundColor: '#16C340',
    borderRadius: 24,
    width: 200,
    height: 48,
    alignSelf: 'center',
    marginTop: 20,

  },
  inactiveBottomButton: {
    backgroundColor: '#bbbbbb',
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
    backgroundColor: '#FFFFFF',
  },
  listView: {
//    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: '#FFFFFF',
//    height: 500,
  },
  listElement: {
    borderBottomWidth: 1,
    borderBottomColor: '#DDDDDD',
  },
  subheading:{
    fontSize: 16,
    color: '#16C340',
    marginLeft: 20,
    marginRight: 20,
    marginTop: 30,
    marginBottom: 10,
  },
  bodyText:{
    fontSize: 20,
    color: '#333333',
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
    marginBottom: 10,
  },
});


AppRegistry.registerComponent('whistle', () => whistle);
