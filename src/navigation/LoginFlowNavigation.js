import React, { useState } from "react";
import Splash from "../screens/Splash";
import Login from '../screens/Login';
import Signup from '../screens/Signup'
import { createStackNavigator } from '@react-navigation/stack';
import { navigationStrings } from "./navigationStrings";
import ForgotPassword from "../screens/ForgotPassword";
import ChangePassword from "../screens/ChangePassword";
import VerifyCode from "../screens/VerifyCode";
import { AppWebView } from "../screens/AppWebView";
import TermsScreen from "../screens/TermScreen";

const LoginStack = createStackNavigator();

const LoginStackNavigator = () => {
    const headerShown = {
        headerShown: false
    }

    const screenOptions = {
        gestureEnabled: false
    }

    return (
        <LoginStack.Navigator screenOptions={headerShown}>
            <LoginStack.Screen name={navigationStrings.Splash} component={Splash} options={screenOptions} />
            <LoginStack.Screen name={navigationStrings.Login} component={Login} options={screenOptions} />
            <LoginStack.Screen name={navigationStrings.SignUp} component={Signup} options={screenOptions} />
            <LoginStack.Screen name={navigationStrings.ForgotPassword} component={ForgotPassword} options={screenOptions} />
            <LoginStack.Screen name={navigationStrings.VerifyCode} component={VerifyCode} options={screenOptions} />
            <LoginStack.Screen name={navigationStrings.AppWebView} component={AppWebView} options={screenOptions} />
            <LoginStack.Screen name={navigationStrings.ChangePassword} component={ChangePassword} options={screenOptions} />
            <LoginStack.Screen name={navigationStrings.TermsScreen} component={TermsScreen} options={screenOptions} />
        </LoginStack.Navigator>
    );
}

export default LoginStackNavigator;