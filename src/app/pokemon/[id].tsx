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
import { useRef, useState } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import PagerView from "react-native-pager-view";
import { useSharedValue } from "react-native-reanimated";
import { Colors } from "../../../constants/Colors";
import { formatSize, formatWeight, getPokemonArtwork } from "../../../functions/pokemon";
import { useFetchQuery } from "../../../hooks/useFetchQuery";
import { useThemeColors } from "../../../hooks/useThemeColor";

// le [id] signifie que expo router peut creer des routes dynamiques
//comme pokemon/12 etc

export default function Pokemon(){
    const params = useLocalSearchParams() as {id:string};

    // id est maintenant un state local : il évolue au fil des swipes
    // sans avoir besoin de recharger la page via router.replace
    const [id, setId] = useState(parseInt(params.id, 10));

    // offset garde en mémoire dans quelle direction on a swipé
    // (0 = gauche/précédent, 1 = milieu/actuel, 2 = droite/suivant)
    // useRef plutôt que useState car on n'a pas besoin de re-render à ce moment-là
    const offset = useRef(1);

    // Appelé en continu pendant le swipe : on retient juste la position de page ciblée
    const onPageSelected = (e: {nativeEvent: {position: number}}) => {
        offset.current = e.nativeEvent.position;
    };

    // Appelé quand le swipe est terminé (l'utilisateur a relâché et l'animation est finie)
    const onPageScrollStateChanged = (e: {nativeEvent: {pageScrollState: string}}) => {
        if (e.nativeEvent.pageScrollState === 'idle' && offset.current !== 1) {
            // On calcule le nouvel id en fonction de la direction du swipe
            // offset.current === 0 -> on a swipé vers la gauche -> id précédent
            // offset.current === 2 -> on a swipé vers la droite -> id suivant
            const newId = offset.current === 0
                ? Math.max(id - 1, 1)
                : Math.min(id + 1, 151);

            setId(newId);
            // on remet offset à 1 pour le prochain swipe
            offset.current = 1;
        }
    };

    return (
        <PagerView
            // key force le PagerView à se "reset" sur la page du milieu
            // à chaque changement d'id, sinon il resterait sur la page qu'on vient de swiper
            key={id}
            onPageSelected={onPageSelected}
            onPageScrollStateChanged={onPageScrollStateChanged}
            initialPage={1}
            style={{ flex: 1 }}
        >
            <PokemonView id={id - 1} />
            <PokemonView id={id} />
            <PokemonView id={id + 1} />
        </PagerView>
    );
}


function PokemonView({id}:{id:number}){
    const colors= useThemeColors();
    const { data:pokemon } = useFetchQuery("/pokemon/[id]", { id: id.toString() })
    const { data:species } = useFetchQuery("/pokemon-species/[id]", { id: id.toString() })
    const mainType = pokemon?.types?.[0].type.name
    const colorType = mainType ? Colors.type[mainType as keyof typeof Colors.type] : colors.ting;
    const types = pokemon?.types ?? [];
    const bio = species?.flavor_text_entries?.find((language: any) => language.language.name === 'en')
    ?.flavor_text.replaceAll("\n",". ");

    const top=useSharedValue(0)
    const player = useAudioPlayer(pokemon?.cries.latest)

    const onImagePress = () => {
        if (!pokemon?.cries.latest){
            return;
        }
        player.seekTo(0)
        player.play()
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
                        #{ id.toString().padStart(3, '0') }
                    </ThemedText>
            </Row>
            <View style={styles.body}>
                <Row style={[styles.imageRow]}>
                    {/* les flèches ne servent plus qu'à afficher un indice visuel,
                        c'est maintenant le swipe qui déclenche la navigation */}
                    {id <= 1 ? (
                        <View style={{width:24,height:24}}/>
                    ) : (
                        <View style={{width:24,height:24}}>
                            <Image width={24} height={24} source={require("@/assets/images/preview.png")}/>
                        </View>
                    )}

                    <Pressable onPress={onImagePress}>
                        <Image 
                            style={[styles.artwork]}
                            source={{
                                width: 200,
                                height: 200,
                                uri: getPokemonArtwork(id)
                            }}
                        />
                    </Pressable>

                    {id >= 151 ? (
                        <View style={{width:24,height:24}}/>
                    ) : (
                        <View style={{width:24,height:24}}>
                            <Image width={24} height={24} source={require("@/assets/images/next.png")}/>
                        </View>
                    )}
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