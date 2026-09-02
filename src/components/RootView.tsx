import { ViewProps, ViewStyle } from "react-native";
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue } from "react-native-reanimated";
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
    });
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
