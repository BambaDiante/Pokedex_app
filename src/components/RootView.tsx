import { useEffect } from "react";
import { ViewProps, ViewStyle } from "react-native";
import Animated, { Easing, interpolateColor, ReduceMotion, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeColors } from "../../hooks/useThemeColor";
type Props= ViewProps &{
    backgroundColor?: string
}

export function RootView({style,backgroundColor,...rest}:Props){
    const color=useThemeColors();
    const progress=useSharedValue(0);
    const animatedStyle = useAnimatedStyle(() => {
        return {
        backgroundColor: interpolateColor(
            progress.value,
            [0, 1],
            [color.ting, backgroundColor ?? color.ting]
        ),
        };
    },[backgroundColor]);

    useEffect(()=>{
        if(backgroundColor){
            progress.set(0)
            progress.set(withTiming(1, {
                duration: 700,
                easing: Easing.out(Easing.quad),
                reduceMotion: ReduceMotion.System,
            }));
        }
        
    },[backgroundColor, progress])
  
    


    if(!backgroundColor){
        return  (
            <SafeAreaView style={[rootStyle,{backgroundColor:color.ting},style]}
            {...rest}/>
        )
    }

    return <Animated.View style={[{flex:1},animatedStyle,style]} >
        <SafeAreaView style={rootStyle} {...rest}/>
    </Animated.View>

}
const rootStyle ={
    flex:1,
    padding:4,
  }satisfies ViewStyle
