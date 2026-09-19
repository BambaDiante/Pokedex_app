import { Card } from "@/components/Card";
import { PokemonSpec } from "@/components/Pokemon/PokemonSpec";
import { PokemonStat } from "@/components/Pokemon/PokemonStat";
import { PokemonType } from "@/components/Pokemon/PokemonType";
import { RootView } from "@/components/RootView";
import { Row } from "@/components/Row";
import { ThemedText } from "@/components/ThemedText";
import { useAudioPlayer } from 'expo-audio';
import { router, useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import PagerView from "react-native-pager-view";
import { Colors } from "../../../constants/Colors";
import { formatSize, formatWeight, getPokemonArtwork } from "../../../functions/pokemon";
import { useFetchQuery } from "../../../hooks/useFetchQuery";
import { useThemeColors } from "../../../hooks/useThemeColor";

export default function Pokemon(){
    const params = useLocalSearchParams() as {id:string};
    const [id, setId] = useState(parseInt(params.id, 10));
    const offset = useRef(1);
    const pagerRef = useRef<PagerView>(null);

    const onPageSelected = (e: {nativeEvent: {position: number}}) => {
        offset.current = e.nativeEvent.position;
    };

    const onPageScrollStateChanged = (e: {nativeEvent: {pageScrollState: string}}) => {
        if (e.nativeEvent.pageScrollState === 'idle' && offset.current !== 1) {
            const newId = offset.current === 0
                ? Math.max(id - 1, 1)
                : Math.min(id + 1, 151);
            setId(newId);
            offset.current = 1;
        }
    };

    // Navigation par clic sur les flèches : on anime le pager vers la page voulue,
    // ce qui déclenche automatiquement onPageScrollStateChanged comme un vrai swipe
    const onPrevious = () => {
        if (id <= 1) return;
        pagerRef.current?.setPage(0);
    };
    const onNext = () => {
        if (id >= 151) return;
        pagerRef.current?.setPage(2);
    };

    return (
        <PagerView
            ref={pagerRef}
            key={id}
            onPageSelected={onPageSelected}
            onPageScrollStateChanged={onPageScrollStateChanged}
            initialPage={1}
            style={{ flex: 1 }}
        >
            <PokemonView id={id - 1} />
            <PokemonView id={id} onPrevious={onPrevious} onNext={onNext} />
            <PokemonView id={id + 1} />
        </PagerView>
    );
}


function PokemonView({id, onPrevious, onNext}:{id:number, onPrevious?: () => void, onNext?: () => void}){
    const colors= useThemeColors();
    const { data:pokemon } = useFetchQuery("/pokemon/[id]", { id: id.toString() })
    const { data:species } = useFetchQuery("/pokemon-species/[id]", { id: id.toString() })
    const mainType = pokemon?.types?.[0].type.name
    const colorType = mainType ? Colors.type[mainType as keyof typeof Colors.type] : colors.ting;
    const types = pokemon?.types ?? [];
    const bio = species?.flavor_text_entries?.find((language: any) => language.language.name === 'en')
    ?.flavor_text.replaceAll("\n",". ");

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
                    {id <= 1 ? (
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
                                uri: getPokemonArtwork(id)
                            }}
                        />
                    </Pressable>

                    {id >= 151 ? (
                        <View style={{width:24,height:24}}/>
                    ) : (
                        <Pressable onPress={onNext}>
                            <Image width={24} height={24} source={require("@/assets/images/next.png")}/>
                        </Pressable>
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
    header:{ margin:20, justifyContent:'space-between' },
    pokeball:{ opacity:.1, position:'absolute', right:8, top:8 },
    artwork:{ zIndex:2 },
    body:{ marginTop:144 },
    card:{ paddingHorizontal:20, paddingBottom:20, paddingTop:60, gap:16, alignItems:'center' },
    imageRow:{ position:"absolute", top:-140, zIndex:2, justifyContent:'space-between', left:0, right:0, paddingHorizontal:20 }
})