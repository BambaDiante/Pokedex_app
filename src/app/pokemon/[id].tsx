import { RootView } from "@/components/RootView";
import { router, useLocalSearchParams } from "expo-router";
//il permet de recuperer les paramtres present dabs l'url
import { Card } from "@/components/Card";
import { PokemonSpec } from "@/components/Pokemon/PokemonSpec";
import { PokemonStat } from "@/components/Pokemon/PokemonStat";
import { PokemonType } from "@/components/Pokemon/PokemonType";
import { Row } from "@/components/Row";
import { ThemedText } from "@/components/ThemedText";
import { useAudioPlayer } from 'expo-audio';
import { Image, Pressable, StyleSheet, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { Colors } from "../../../constants/Colors";
import { formatSize, formatWeight, getPokemonArtwork } from "../../../functions/pokemon";
import { useFetchQuery } from "../../../hooks/useFetchQuery";
import { useThemeColors } from "../../../hooks/useThemeColor";

// le [id] signifie que expo router peut creer des routes dynamiques
//comme pokemon/12 etc
export default function Pokemon(){
    const colors= useThemeColors();
    const params=useLocalSearchParams();
    const { data:pokemon } = useFetchQuery("/pokemon/[id]", { id: params.id as string })
    const { data:species } = useFetchQuery("/pokemon-species/[id]", { id: params.id as string })
    const mainType = pokemon?.types?.[0].type.name
    const colorType = mainType ? Colors.type[mainType as keyof typeof Colors.type] : colors.ting;
    console.log({mainType,colorType})
    const types = pokemon?.types ?? [];
    const bio = species?.flavor_text_entries?.find((language: any) => language.language.name === 'en')
    ?.flavor_text.replaceAll("\n",". ");

    const top=useSharedValue(0)
    const idString = typeof params.id === 'string' ? params.id : params.id?.[0] ?? '1';
    const pokemonId = parseInt(idString, 10);
    const player = useAudioPlayer(pokemon?.cries.latest)

    const onImagePress = () => {
        if (!pokemon?.cries.latest){
            return;
        }
        player.seekTo(0)
        player.play()
    }

    const onPrevious = () => {
        router.replace({
            pathname: '/pokemon/[id]',
            params: { id: Math.max((Number(params.id) - 1),1)}
        })
    }
    const onNext = () => {
        router.replace({
            pathname: '/pokemon/[id]',
            params: { id: Math.min((Number(params.id) + 1),151) }
        })
    }
    return <RootView backgroundColor={colorType}>
        <View>
            <Image style={[styles.pokeball]} source={require("@/assets/images/pokeball_big.png")}  width={208} height={208}/>
            <Row style={[styles.header]}>
                <Pressable onPress={router.back}>
                    <Row gap={8}>
                        <Image source={require("@/assets/images/arrow_back.png")} width={32}height={32}/>
                
                        <ThemedText color="grayWhite" variant='headline' style={{textTransform:"capitalize"}}>
                            {pokemon?.name}          
                        </ThemedText>
                    </Row>
                </Pressable>
                    <ThemedText color="grayWhite" variant="subtitle2">
                        #{ (params.id as string).padStart(3, '0') }
                    </ThemedText>
            </Row>
            <View style={styles.body}>
                <Row style={[styles.imageRow]}>
                    {pokemonId === 1 ? (
                        <View style={{width:24,height:24}}/>
                    ) : (
                        <Pressable onPress={onPrevious}>
                            <Image width={24} height={24} source={require("@/assets/images/preview.png")}/>
                        </Pressable>
                    )}

                    <Pressable onPress={onImagePress}>
                        <Image 
                            style={[styles.artwork]}
                            source={{
                                width: 200,
                                height: 200,
                                uri: getPokemonArtwork(parseInt(params.id as string, 10))
                            }}
                        />
                    </Pressable>

                    <Pressable onPress={onNext}>
                        <Image width={24} height={24} source={require("@/assets/images/next.png")}/>
                    </Pressable>
                </Row>
                <Card style={styles.card}>
                    <Row  gap={16} style={{height:20}}>
                        {types.map((type: any) => (
                            <PokemonType name={type.type.name} key={type.type.name} />
                        ))}
                    </Row>
                    <ThemedText variant="subtitle1" style={{color:colorType}}>
                        A propos
                    </ThemedText>
                    <Row>
                        <PokemonSpec 
                            style={{borderStyle:'solid',borderRightWidth:1,borderColor:colors.grayLight}}
                            title={formatWeight(pokemon?.weight)} 
                            description="Poids" 
                            image={require("@/assets/images/Vector.png")}
                        />
                        <PokemonSpec 
                            style={{borderStyle:'solid',borderRightWidth:1,borderColor:colors.grayLight}}
                            title={formatSize(pokemon?.height)} 
                            description="Taille" 
                            image={require("@/assets/images/weight.png")}
                        />
                        <PokemonSpec 
                            title={pokemon?.moves
                                .slice(0,2).
                                map((m:any)=>
                                m.move.name)
                                .join("\n")
                            } 
                            description="Mouvements" 
                        />
                    </Row>
                    <ThemedText>
                        {bio}
                    </ThemedText>
                    <ThemedText variant="subtitle1" style={{color:colorType}}>
                        Stats de base 
                    </ThemedText>
                    <View style={[{alignSelf:'stretch'}]}>
                        {pokemon?.stats.map(
                            (stat:any)=>
                            <PokemonStat 
                                key={stat.stat.name} 
                                name={stat.stat.name} 
                                color={colorType} 
                                value={stat.base_stat}
                            />
                        )}
                    </View>
                </Card>
            </View>        
        
        </View>
    </RootView>
}

const styles=StyleSheet.create({
    header:{
        margin:20,
        justifyContent:'space-between'

    },
    pokeball:{
        opacity:.1,
        position:'absolute',
        right:8,
        top:8,
    },
    artwork:{
        zIndex:2,
    },
    body:{
        marginTop:144,
    },
    card:{
        paddingHorizontal:20, 
        paddingBottom:20,
        paddingTop:60,
        gap:16,
        alignItems:'center',
    },
    imageRow:{
        position:"absolute",
        top:-140,
        zIndex:2,
        justifyContent:'space-between',
        left:0,
        right:0,
        paddingHorizontal:20,
    }
})