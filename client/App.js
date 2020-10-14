import React, { useEffect } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
// import { getUserLogged } from "./redux/actions/authActions";
import store from "./redux/store";
// import Index from "./components";
import * as Font from 'expo-font';
import CreditCard from './components/MyCards';

export default function App() {
  
  useEffect(() => {
    (async () => await Font.loadAsync({
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
    }))();
     }, [])

  return (
    <Provider store={store}>
      <CreditCard />
    </Provider>
  );
}
