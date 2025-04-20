import { StyleSheet } from 'react-native'
import { theme } from '../../constants/theme'

import React from 'react';
import Home from './Home';
import List from './List';
import Plus from './Plus';
import Shoe from './Shoe';
import Repeat from './Repeat';
import Timer from './Timer';
import Pause from './Pause';
import Delete from './Delete';
import Bluetooth from './Bluetooth';
import Stop from './Stop';
import Search from './Search';
import Trophy from './Trophy';
import Profile from './Profile';
import Clipboard from './Clipboard';
import Settings from './Settings';
import Runner from './Runner';
import ArrowLeft from './Arrow';
import Touch from './Touch';
import WeekOne from './weekOne';
import FiveK from './fiveK';
import TenK from './tenK';
import fifteenK from './fifteenK';
import twentyK from './twentyK';

const icons = {
    home: Home,
    list: List,
    plus: Plus,
    shoe: Shoe,
    repeat: Repeat,
    timer: Timer,
    pause: Pause,
    delete: Delete,
    bluetooth: Bluetooth,
    stop: Stop,
    search: Search,
    trophy: Trophy,
    profile: Profile,
    clipboard: Clipboard,
    settings: Settings,
    runner: Runner,
    arrowLeft: ArrowLeft,
    touch: Touch,
    weekOne: WeekOne,
    fiveK: FiveK,
    tenK: TenK,
    fifteenK: fifteenK,
    twentyK: twentyK,
}

const Icon = ({name, ...props}) => {
    const IconComponent = icons[name];
  return (
    <IconComponent
        height={props.size || 24}
        width={props.size || 24}
        strokeWidth={props.strokeWidth || 1.9}
        color={theme.colors.textLight}
        {...props}
        />
  )
}

export default Icon;

const styles = StyleSheet.create({})