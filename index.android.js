

import React, { Component } from 'react';

import {
    AppRegistry,
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
    RefreshControl,
    ToastAndroid,
} from 'react-native';





//~~~~~~~~~~~~~~~~~Local Storage~~~~~~~~~~~~~~~~~~~~
var userId; //used to store userid in shared preference
var Contacts = require('react-native-contacts');






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
var options = {
  fields: {
    full_name: {
        error: 'Please enter a name',
        enablesReturnKeyAutomatically: true

    },
    email: {
        error: 'Insert a valid email',
        keyboardType: 'email-address'
    },
    ten_digit_phone_number: {
        error: 'Insert a valid mobile number',
        keyboardType: 'numeric'
    },
    short_bio: {
        error: 'Required'
    },
    skills: {
        error: 'Required'
    }
  }
};




//~~~~~~~~~~~~~~~API URLs~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/*var userApi = 'http://11.11.11.21:3000/api/users/';
var selfApi = 'http://11.11.11.21:3000/api/users/?filter[where][id]='; // followed by something like 5730171169a2d621a5b2b88a
var userMappingApi = 'http://11.11.11.21:3000/api/userMappings/';
var selfReqApi = 'http://11.11.11.21:3000/api/userMappings/?filter[where][receiver]=';
var notifApi = 'http://11.11.11.21:3000/api/userMappings/getNotification';
*/

var userApi = 'https://serene-basin-88933.herokuapp.com/api/users/';
var selfApi = 'https://serene-basin-88933.herokuapp.com/api/users/?filter[where][id]='; // followed by something like 5730171169a2d621a5b2b88a
var userMappingApi = 'https://serene-basin-88933.herokuapp.com/api/userMappings/';
var selfReqApi = 'https://serene-basin-88933.herokuapp.com/api/userMappings/?filter[where][receiver]=';
var notifApi = 'https://serene-basin-88933.herokuapp.com/api/userMappings/getNotification';
var userListApi = 'https://serene-basin-88933.herokuapp.com/api/users/getList';





class whistlecontactmanager extends React.Component{ //-------------------------------------------------------------------------------


    render() {
        return (
            <Navigator
                initialRoute={{id: 'splash'}} //splash
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
            return (<HomeScreen navigator={navigator} title="Whistle" />);
          case 'notification':
            return (<NotificationScreen navigator={navigator} title="Friend Requests"/>);
          case 'account':
            return (<AccountScreen navigator={navigator} title="Your profile" />);
          case 'profile':
            return (<FriendProfile navigator={navigator} title="Friend" friend={route.friend} />);
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

    }


    getStartRoute() {
        if (!userId) {return 'welcome'}
        else {return 'home'}; //home
    }


    componentDidMount() {
        AsyncStorage.getItem("storedUserId")
        .then((value) => {
            userId = value;
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
                <Text style={{color: 'white', marginTop: 180, fontSize: 30,}}>Whistle</Text>
                <Text>Hillhacks 2016</Text>
                <TouchableHighlight style={styles.welcomeButton} onPress={this.navSecond.bind(this)} underlayColor={'#dddddd'}>
                    <View style={{flexDirection: 'row', height: 48, alignItems: 'center', justifyContent: 'center',}}>
                        <Text style={styles.buttonText}>GET INTRODUCED</Text>
                    </View>
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
                                <View style={{flexDirection: 'row', height: 48, alignItems: 'center', justifyContent: 'center',}}>
                                    <Text style={styles.buttonText, { color: 'white', }}>SUBMITTING</Text>
                                </View>
                            </View>;
        }
        else {
            submitButton =  <TouchableHighlight style={styles.bottomButton} onPress={this.onPress} underlayColor={'#0C862A'}>
                                <View style={{flexDirection: 'row', height: 48, alignItems: 'center', justifyContent: 'center',}}>
                                    <Text style={styles.buttonText, { color: 'white', }}>SUBMIT</Text>
                                </View>
                            </TouchableHighlight>;
        }
        return (
            <View>
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
                    <View style={{height: 300,}}></View>
                </View>
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
            isRefreshing: false,

        };
    }


    componentDidMount() {
        this.fetchData();
    }


    fetchData() {
        fetch(userListApi, {
            method: 'GET',
            headers: {
                'userId': userId,
            },
        })
        .then((response) => response.json())
        .then((responseData) => {
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(responseData.data),
                loaded: true,
            });
        })
        .done();
    }


    render() {
        if (!this.state.loaded) {
            return this.renderLoadingView();
        }
        return (
            <View style={{ flex:1,}}>
                <ToolbarAndroid 
                    style={styles.tb}
                    title={this.props.title}
                    titleColor={'#FFFFFF'}
                    actions={[{title: 'Notifications', icon: require('./resources/icons/notif.png'), show: 'always'},{title: 'Account', icon: require('./resources/icons/account.png'), show: 'always'}]}
                    onActionSelected={this.onActionSelected.bind(this)}
                />
                <Text style={styles.subTitle}>HILLHACKS PARTICIPANTS</Text>
                <ListView
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={this._onRefresh.bind(this)}
                            tintColor="#ff0000"
                            title="Loading..."
                            titleColor="#00ff00"
                            colors={['#ffffff', '#ffffff', '#ffffff']}
                            progressBackgroundColor="#16C340"
                        />
                    } 
                    dataSource={this.state.dataSource}
                    renderRow={this.renderUser.bind(this)}
                    style={styles.listView}
                    initialListSize={1}
                />
            </View>
        );
    }



    _onRefresh() {
        this.setState({isRefreshing: true});
        
        this.fetchData();

        this.setState({
            isRefreshing: false,
        });

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
        return (  
            <View style={styles.listElement}>
                <TouchableHighlight style={{height: 70,}} onPress={ () => this.seeFriend(userInfo) } underlayColor={'#dddddd'}>
                    <View>
                        <Text style={{fontSize: 20, color: 'black', marginTop: 12, marginLeft:20,}}>{userInfo.name}</Text>
                        <Text style={{fontSize: 16, color: '#888888', marginLeft:20,}}>{userInfo.description}</Text>
                    </View>
                </TouchableHighlight>
            </View>
        );
    }


    seeFriend(friendinfo) {
        this.props.navigator.push({
            id: 'profile',
            friend: friendinfo
        })
    }


};







class NotificationScreen extends React.Component{ //-----------------------------------------------------------------------------------


    constructor(props) {
        super(props);
        this.state = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            loaded: false,
            emptyDataReceived: false,
        };
    }


    componentDidMount() {
        this.fetchData();
    }


    fetchData() {
        fetch(notifApi, {
            method: 'GET',
            headers: {
                'userId': userId,
            },
        })
        .then((response) => response.json())
        .then((value) => {
            if (value.data !== 'You have no pending requests') {
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(value.data),
                    loaded: true,
                });
            }
            else {
                this.setState({
                    emptyDataReceived: true,
                    loaded: true,
                });
            }
        })
        .done();
    }


    render() {
        if (!this.state.loaded) {
            return this.renderLoadingView();
        }
        if (this.state.emptyDataReceived) {
            return this.renderEmptyView();
        }

        return (
            <View style={{ flex:1,}}>
                <ToolbarAndroid 
                    style={styles.tb}
                    title={this.props.title}
                    titleColor={'#FFFFFF'}
                    navIcon={require('./resources/icons/back.png')}
                    onIconClicked={this.props.navigator.pop}
                />
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

    renderEmptyView() {
        return (
            <View style={{ flex:1,}}>
                <ToolbarAndroid 
                    style={styles.tb}
                    title={this.props.title}
                    titleColor={'#FFFFFF'}
                    navIcon={require('./resources/icons/back.png')}
                    onIconClicked={this.props.navigator.pop}
                />
                <Text style={styles.subTitle}>NO REQUESTS</Text>

            </View>
        );
    }

    renderUser(userInfo) {
        return (  
            <View style={styles.listElement}>
                <Text style={{fontSize: 20, color: 'black', marginTop: 12,}}>{userInfo.name}</Text>
                <Text style={{fontSize: 16, color: '#888888',}}>{userInfo.description}</Text>
                <View>
                    <TouchableHighlight 
                        style={styles.twoButtons} 
                        onPress={ () => { this._onPress('accepted', userInfo.userMappingId) } } 
                        underlayColor={'#0C862A'}
                    >
                        <View style={{flexDirection: 'row', height: 48, alignItems: 'center', justifyContent: 'center',}}>
                            <Text style={styles.buttonText, { color: 'white', }}>ACCEPT</Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight 
                        style={styles.twoButtons} 
                        onPress={ () => { this._onPress('rejected', userInfo.userMappingId) } } 
                        underlayColor={'#0C862A'}
                    >
                        <View style={{flexDirection: 'row', height: 48, alignItems: 'center', justifyContent: 'center',}}>
                            <Text style={styles.buttonText, { color: 'white', }}>IGNORE</Text>
                        </View>
                    </TouchableHighlight>
                </View>
            </View>
        );
    };


    seeFriend(id) {
        this.props.navigator.push({
            id: 'profile',
            friendId: id,
        })
    }


    _onPress(status, requestId) {
        var that = this;
        var value = {
            "status": status //status
        };

        fetch(userMappingApi+requestId, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(value)
        })
        .then(() => {
            this.fetchData()
        })
        .catch((error) => {
            console.warn(error);   
        });
    };

}






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
        return (
            <View>
                <ToolbarAndroid 
                    style={styles.tb}
                    title={this.props.title}
                    titleColor={'#FFFFFF'}
                    navIcon={require('./resources/icons/back.png')}
                    onIconClicked={this.props.navigator.pop}
                />
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
                <Text>Loading...</Text>
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
//            loaded: true,
//            requestSent:false,
            buttonType: "hidden",
            showPrivate: false
        };
    }


    componentDidMount() {
//        this.fetchData();
        if (this.props.friend.status==='initiated') {
            if (!this.props.friend.sender) {
                this.setState({
                    buttonType: 'inactive',
                    showPrivate: false,
                });
            }
            else {
                this.setState({
                    buttonType: 'acceptReject',
                    showPrivate: false,
                });
            }
        }

        else if (this.props.friend.status==='accepted') {
            this.setState({
                    buttonType: 'hidden',
                    showPrivate: true,
            });
        }

        else if (this.props.friend.status==='rejected') {
            if (!this.props.friend.sender) {
                this.setState({
                    buttonType: 'inactive',
                    showPrivate: false,
                });
            }
            else {
                this.setState({
                    buttonType: 'hidden',
                    showPrivate: false,
                });
            }
        }

        else {
            this.setState({
                buttonType: 'active',
                showPrivate: false,
            });
        }
    }


    fetchData() {
        fetch(userApi+this.props.friend.id)
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
/*        if (!this.state.loaded) {
            return this.renderLoadingView();
        }*/


        if (this.state.buttonType==='inactive') {
            friendButton =  <View style={styles.inactiveBottomButton}>
                                <View style={{flexDirection: 'row', height: 48, alignItems: 'center', justifyContent: 'center',}}>
                                    <Text style={styles.buttonText, { color: 'white', }}>REQUEST SENT</Text>
                                </View>
                            </View>;
        } 
        else if (this.state.buttonType==='active') {
            friendButton =  <TouchableHighlight style={styles.bottomButton} onPress={this.onPress} underlayColor={'#0C862A'}>
                                <View style={{flexDirection: 'row', height: 48, alignItems: 'center', justifyContent: 'center',}}>
                                    <Text style={styles.buttonText, { color: 'white', }}>ADD AS FRIEND</Text>
                                </View>
                            </TouchableHighlight>;
        }
        else if (this.state.buttonType==='acceptReject') {
            friendButton =  <View>
                                <TouchableHighlight 
                                    style={styles.twoButtons} 
                                    underlayColor={'#0C862A'}
                                    onPress={() => { this.onAcceptRejectPress('accepted', this.props.friend.userMappingId)} }
                                >
                                    <View style={{flexDirection: 'row', height: 48, alignItems: 'center', justifyContent: 'center',}}>
                                        <Text style={styles.buttonText, { color: 'white', }}>ACCEPT</Text>
                                    </View>
                                </TouchableHighlight>
                                <TouchableHighlight 
                                    style={styles.twoButtons} 
                                    underlayColor={'#0C862A'}
                                    onPress={() => {this.onAcceptRejectPress('rejected', this.props.friend.userMappingId)} }

                                >
                                    <View style={{flexDirection: 'row', height: 48, alignItems: 'center', justifyContent: 'center',}}>
                                        <Text style={styles.buttonText, { color: 'white', }}>IGNORE</Text>
                                    </View>
                                </TouchableHighlight>
                            </View>;


                            /*
                            <TouchableHighlight style={styles.bottomButton} onPress={this.onPress} underlayColor={'#0C862A'}>
                                <View style={{flexDirection: 'row', height: 48, alignItems: 'center', justifyContent: 'center',}}>
                                    <Text style={styles.buttonText, { color: 'white', }}>ADD AS FRIEND</Text>
                                </View>
                            </TouchableHighlight>;
                            */ //change this to code from notifiationsScreen
        }
        else if (this.state.buttonType==='hidden') {
            friendButton =  <View>
                            </View>;
        }


        if (this.state.showPrivate) {
            privateInfo = 
                <View>
                    <Text style={styles.subheading}>EMAIL</Text>
                    <Text style={styles.bodyText}>{this.props.friend.emailId}</Text>
                    <Text style={styles.subheading}>PHONE NO.</Text>
                    <Text style={styles.bodyText}>{this.props.friend.phoneNumber}</Text>
                    <TouchableHighlight onPress={this.addContact} style={styles.bottomButton}>
                        <View style={{flexDirection: 'row', height: 48, alignItems: 'center', justifyContent: 'center',}}>
                            <Text style={styles.buttonText, { color: 'white', }}>SAVE TO PHONEBOOK</Text>
                        </View>
                    </TouchableHighlight>
                </View>;
        }
        else {
            privateInfo = 
                <View>
                </View>;
        }

        return (
            <View>
                <ToolbarAndroid 
                    style={styles.tb}
                    title={this.props.title}
                    titleColor={'#FFFFFF'}
                    navIcon={require('./resources/icons/back.png')}
                    onIconClicked={this.props.navigator.pop}
                />
                <Text style={styles.subheading}>NAME</Text>
                <Text style={styles.bodyText}>{this.props.friend.name}</Text>
                <Text style={styles.subheading}>SHORT BIO</Text>
                <Text style={styles.bodyText}>{this.props.friend.description}</Text>
                {privateInfo}
                {friendButton}
        
            </View>
        );
    }


    onPress = () => {
        var value = {
            "sender": userId, //will need to change this !!! - - -   - -  
            "receiver": this.props.friend.id,
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
            this.setState({
                buttonType: 'inactive',
                showPrivate: false,
            })
        })
        .catch((error) => {
            console.warn(error);   
        });
    };


    onAcceptRejectPress(status, requestId) {
        var value = {
            "status": status //status
        };

        fetch(userMappingApi+this.props.friend.userMappingId, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(value)
        })
        .then(() => {
            if (status ==='accepted') {
                this.setState({
                    buttonType: 'hidden',
                    showPrivate: true,
                })
            }
            else {
                this.setState({
                    buttonType: 'hidden',
                    showPrivate: false,
                })
            }
        })
        /*.then(() => {
            this.fetchData()
        })*/
        .catch((error) => {
            console.warn(error);   
        });
    };


    addContact = () => {
        var newPerson = {
            familyName: '',
            givenName: this.props.friend.name,
            emailAddresses: [{
                label: "work",
                email: this.props.friend.emailId,
            }],
            phoneNumbers: [{
                label: "mobile",
                number: this.props.friend.phoneNumber,
            }],
        }
        Contacts.addContact(newPerson, (err) => { /*...*/ })
        ToastAndroid.show(this.props.friend.name+' saved to your phonebook', ToastAndroid.LONG)
    }


    renderLoadingView() {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

};









class ConfirmModal extends React.Component{ //-----------------------------------------------------------------------------------


    render() {
        return (
            <View>
                <ToolbarAndroid 
                    style={styles.tb}
                    title={this.props.title}
                    titleColor={'#FFFFFF'}
                    navIcon={require('./resources/icons/notif.png')}
                    onIconClicked={this.props.navigator.pop}
                />
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
        marginTop: 20,
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
        backgroundColor: '#FFFFFF',
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
    twoButtons:{
        backgroundColor: '#16C340',
        borderRadius: 24,
        width: 150,
        height: 48,
        marginTop: 20,
    },
});


AppRegistry.registerComponent('whistlecontactmanager', () => whistlecontactmanager);
