import React, { useState, useEffect } from "react";
import Splash from "../screens/Splash";
import Login from '../screens/Login';
import Signup from '../screens/Signup'
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { navigationStrings } from "./navigationStrings";
import ForgotPassword from "../screens/ForgotPassword";
import ChangePassword from "../screens/ChangePassword";
import Home from "../screens/Home";
import SelectCountryAndLanguage from "../screens/SelectCountryAndLanguage";
import Settings from "../screens/Settings";
import ViewProfile from "../screens/ViewProfile";
import EditProfile from "../screens/EditProfile";
import Search from "../screens/Search";
import PlaySong from "../screens/PlaySong";
import MyLibrary from "../screens/MyLibrary";
import Podcasts from "../screens/Podcasts";
import BottomTabBar from "./BottomTabNavigator";
import Artists from "../screens/Artists";
import SongsList from "../screens/SongsList";
import MixSongs from "../screens/MixSongs";
import Categories from "../screens/Categories";
import NewSongsListing from "../screens/NewSongsListing";
import SongsListingByDate from "../screens/SongsListingByDate";
import AddPlaylist from "../screens/AddPlaylist";
import VideosList from "../screens/VideosList";
import { AppWebView } from "../screens/AppWebView";
import Albums from "../screens/Albums";
import SongsByPlaylist from "../screens/SongsByPlaylist";
import AlbumsListing from "../screens/AlbumsListing";
import FavouritePlaylists from "../screens/FavouritePlaylists";
import PodcastEpisodes from "../screens/PodcastEpisodes";
import SongsByCategory from "../screens/SongsByCategory";
import NetInfo from "@react-native-community/netinfo";
import { BackHandler } from "react-native";
import ArtistFollowers from "../screens/ArtistFollowers";
import FeaturedArtists from "../screens/FeaturedArtists";

const MainStack = createStackNavigator();

const AppMainNavigator = (props) => {
  const headerShown = {
    headerShown: false
  }

  const screenOptions = {
    gestureEnabled: false
  }

  // const [isInternetConnected, setIsInternetConnected] = useState(false)

  return (
    <MainStack.Navigator screenOptions={headerShown}>
      <MainStack.Screen name={navigationStrings.BottomTabBar} component={BottomTabBar} options={screenOptions} />
      <MainStack.Screen name={navigationStrings.Home} component={Home} options={screenOptions} />
      <MainStack.Screen name={navigationStrings.SelectCountryAndLanguage} component={SelectCountryAndLanguage} options={screenOptions} />
      <MainStack.Screen name={navigationStrings.Settings} component={Settings} options={screenOptions} />
      <MainStack.Screen name={navigationStrings.ViewProfile} component={ViewProfile} options={screenOptions} />
      <MainStack.Screen name={navigationStrings.EditProfile} component={EditProfile} options={screenOptions} />
      <MainStack.Screen name={navigationStrings.Search} component={Search} options={screenOptions} />
      <MainStack.Screen name={navigationStrings.PlaySong} component={PlaySong} options={screenOptions} />
      <MainStack.Screen name={navigationStrings.MyLibrary} component={MyLibrary} options={screenOptions} />
      <MainStack.Screen name={navigationStrings.Podcasts} component={Podcasts} options={screenOptions} />
      <MainStack.Screen name={navigationStrings.Artists} component={Artists} options={screenOptions} />
      <MainStack.Screen name={navigationStrings.SongsList} component={SongsList} options={screenOptions} />
      <MainStack.Screen name={navigationStrings.MixSongs} component={MixSongs} options={screenOptions} />
      <MainStack.Screen name={navigationStrings.Categories} component={Categories} options={screenOptions} />
      <MainStack.Screen name={navigationStrings.NewSongsListing} component={NewSongsListing} options={screenOptions} />
      <MainStack.Screen name={navigationStrings.SongsListingByDate} component={SongsListingByDate} options={screenOptions} />
      <MainStack.Screen name={navigationStrings.AddPlaylist} component={AddPlaylist} options={screenOptions} />
      <MainStack.Screen name={navigationStrings.VideosList} component={VideosList} options={screenOptions} />
      <MainStack.Screen name={navigationStrings.AppWebView} component={AppWebView} options={screenOptions} />
      <MainStack.Screen name={navigationStrings.Albums} component={Albums} options={screenOptions} />
      <MainStack.Screen name={navigationStrings.SongsByPlaylist} component={SongsByPlaylist} options={screenOptions} />
      <MainStack.Screen name={navigationStrings.AlbumsListing} component={AlbumsListing} options={screenOptions} />
      <MainStack.Screen name={navigationStrings.FavouritePlaylists} component={FavouritePlaylists} options={screenOptions} />
      <MainStack.Screen name={navigationStrings.SongsByCategory} component={SongsByCategory} options={screenOptions} />
      <MainStack.Screen name={navigationStrings.PodcastEpisodes} component={PodcastEpisodes} options={screenOptions} />
      <MainStack.Screen name={navigationStrings.ArtistFollowers} component={ArtistFollowers} options={screenOptions} />
      <MainStack.Screen name={navigationStrings.FeaturedArtists} component={FeaturedArtists} options={screenOptions} />
    </MainStack.Navigator>
  );
}

export default AppMainNavigator;