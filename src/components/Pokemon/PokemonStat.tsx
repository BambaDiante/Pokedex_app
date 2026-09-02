import { StyleSheet, View, ViewProps } from "react-native";
import { statShortName } from "../../../functions/pokemon";
import { useThemeColors } from "../../../hooks/useThemeColor";
import { Row } from "../Row";
import { ThemedText } from "../ThemedText";

type Props= ViewProps&{
    color:string,
    name:string,
    value:number
}

export function PokemonStat({style,color,name,value,...rest}:Props){
    const colors=useThemeColors()
    return(
        <Row gap={8} style={[style,styles.root]} {...rest}>
            <View style={[styles.name,{borderColor:colors.grayLight}]}>
                <ThemedText variant='subtitle3' style={{color:color}}>{statShortName(name)}</ThemedText>
            </View>
            <View style={[styles.number]}>
                <ThemedText>{value.toString().padStart(3,"0")}</ThemedText>
            </View>
            <View style={[styles.bar]}>
                <View style={[styles.barInner,{flex:value, backgroundColor:color}]}>
                </View>
                <View style={[styles.barBackgound,{flex:255-value, backgroundColor:color}]}></View>
            </View>
        </Row>
    );
}

const styles=StyleSheet.create({
    root:{},
    name:{
        width:40,
        paddingRight:8,
        borderRightWidth:1,
        borderStyle:'solid',
    },
    number:{
        width:23,
    },
    bar:{
        flexDirection:'row',
        borderRadius:20,
        height:4,
        overflow:'hidden',
        flex:1,
    },
    barInner:{
        height:4,        
    },
    barBackgound:{
        height:4,
        opacity:0.24,
    },
})