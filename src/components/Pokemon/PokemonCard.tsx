import { Image, Pressable, StyleSheet, View, ViewStyle } from "react-native";
import { useThemeColors } from "../../../hooks/useThemeColor";
import { Card } from "../Card";
import { ThemedText } from "../ThemedText";

type Props = {
    style: ViewStyle;
    id: number;
    name: string;
    onPress?: () => void; 
}

export function PokemonCard({ style, id, name, onPress }: Props) {
    const colors = useThemeColors();
    
    return (
        
        <Pressable onPress={onPress} style={style}>
            <Card style={styles.card}>
                <ThemedText style={[styles.id]} variant="caption" color="grayMedium">
                    #{id.toString().padStart(3,'0')} 
                </ThemedText>
                <Image source={{
                    width: 72,
                    height: 72,
                    uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
                }} />
                <ThemedText>
                    {name}
                </ThemedText>
                <View style={[styles.shadow,{backgroundColor:'grayMedium'}]} />
            </Card>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        position: 'relative',
        alignItems: 'center',
        padding: 4,
    },
    id: {
        alignSelf: "flex-end",
    },
    shadow: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 44,
        borderRadius: 7,
        zIndex: -1,
    }
});