import { StyleSheet, Text, type TextProps } from "react-native";
import { Colors } from "../../constants/Colors";
import { useThemeColors } from "../../hooks/useThemeColor";
//sert à récupérer la liste des propriétés qu'un composant <Text> peut accepter.

const styles=StyleSheet.create({
    body3:{
        fontSize:10,
        lineHeight:16,
    },

    headline: {
        fontSize: 24,
        lineHeight: 32,
        fontWeight: "bold",
    },

    caption: {
        fontSize: 8,
        lineHeight: 12,
    },

    subtitle1: {
        fontSize: 14,
        lineHeight: 16,
        fontWeight: "bold",
    },

    subtitle2: {
        fontSize: 12,
        lineHeight: 16,
        fontWeight: "bold"
    },

    subtitle3: {
    
        fontSize: 10,
        lineHeight: 16,
        fontWeight: "bold",
    },
})

type Props=TextProps & {
    //des proprietes chaines de caracteres de type optionnel
    variant?:keyof typeof styles,
    //variant peut uniquement contenir le nom d'une propriété qui existe dans styles
    color?: keyof typeof Colors.dark;

}
//Mon composant doit accepter toutes les propriétés de TextProps
//  ET mes propres propriétés supplémentaires.

export function ThemedText({
    variant,
    color,
    style, 
    ...rest
}: Props) {

    const colors = useThemeColors();

    return (
        <Text
            style={[
                styles[variant ?? "body3"],
                { color: colors[color ?? "grayDark"] },
                style 
            ]}
            {...rest}
        />
    );
}

