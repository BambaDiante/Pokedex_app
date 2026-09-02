import { StyleSheet, View } from "react-native"
import { useThemeColors } from "../../hooks/useThemeColor"

type Props={
    checked:boolean
}

export function Radio({checked}:Props){
    const color=useThemeColors()
    return <View style={[styles.radio,{backgroundColor: color.grayWhite}]}>
        {checked && <View style={[styles.radioInner,{backgroundColor: color.ting}]}/>}
    </View>

}

const styles=StyleSheet.create({
    radio:{
        width:14,
        height:14,
        borderStyle:'solid',
        borderWidth:1,
        borderRadius:14,
        alignItems:'center',
        justifyContent:'center',


    },
    radioInner:{
        borderRadius:6,
        width:6,
        height:6,


    }
})
