import { Image, StyleSheet, TextInput } from "react-native"
import { useThemeColors } from "../../hooks/useThemeColor"
import { Row } from "./Row"

type Props={
    value:string,
    onChange: (s:string)=>void
}

export function SearchBar({value,onChange}:Props){
    const colors=useThemeColors()
    return <Row gap={8} style={[styles.wrapper,{backgroundColor:colors.grayWhite}]}>
        <Image source={require('@/assets/images/search.png')} width={16} height={16}/>
        <TextInput style={[styles.input]} onChangeText={onChange} value={value}/>
    </Row>
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        borderRadius: 32,
        height: 40, 
        paddingHorizontal: 12,
        alignItems: 'center', 
    },
    input: {
        flex: 1,
        height: 40,
        fontSize: 14, 
        color: '#000', 
    }
})