import { Card } from '@/components/Card';
import { PokemonCard } from '@/components/Pokemon/PokemonCard';
import { RootView } from '@/components/RootView';
import { Row } from '@/components/Row';
import { SearchBar } from '@/components/SearchBar';
import { SortButton } from '@/components/SortButton';
import { ThemedText } from '@/components/ThemedText';
import { Link } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet } from 'react-native';
import { getPokemonId } from '../../functions/pokemon';
import { useInfiniteFetchQuery } from '../../hooks/useFetchQuery';
import { useThemeColors } from '../../hooks/useThemeColor';

export default function Index() {
  const color=useThemeColors();
  const {data,isFetching,fetchNextPage}=useInfiniteFetchQuery('/pokemon?limit=21')
  const pokemons= data?.pages.flatMap(page=>page.results.map((r:any)=>({name:r.name,id:getPokemonId(r.url)}))) ?? []
  const [search,setSearch]=useState('')
  const [sortKey,setSortKey]=useState<"id"|"name">("id")

  const filteredPokemons= [...(search 
    ? pokemons.filter(
        p=>
          ((p.name.includes(search.toLowerCase())))|| 
           (p.id.toString()===search))
          
  :pokemons)].sort((a,b)=>(a[sortKey]<b[sortKey]? -1 : 1))



  return (
      <RootView>
      <Row style={styles.header} gap={12}>
          <Image source={require('@/assets/images/Pokeball.png')} width={24} height={24}/>
          <ThemedText 
            variant="headline"
            color='grayLight'
          >
            Pokedex        
        </ThemedText>
      </Row>
      <Row gap={16} style={styles.form}>
        <SearchBar value={search} onChange={setSearch}/>
        <SortButton value={sortKey} onChange={setSortKey}/>
      </Row>
      <Card style={styles.body}>
        <FlatList 
          data={filteredPokemons} 
          renderItem={({ item }) => (
            <Link href={{ pathname: "/pokemon/[id]", params: { id: item.id } }} asChild>
              <PokemonCard 
                id={item.id} 
                name={item.name} 
                style={{ flex: 1/3 }}
              />
            </Link>
          )} 
          keyExtractor={(item) => item.id.toString()}
          numColumns={3}
          contentContainerStyle={[styles.gridgap, styles.list]}
          columnWrapperStyle={[styles.gridgap]}
          ListFooterComponent={
            isFetching ? <ActivityIndicator color={color.ting}/> : null
          }
          onEndReached={search ? undefined : () => fetchNextPage()}
        />
      </Card>    
      
    </RootView>
  );
}

const styles = StyleSheet.create({

  header:{
    paddingHorizontal:12,
    paddingVertical:8,
  },
  body:{
    flex:1,
    marginTop:16,
  },
  gridgap:{
    gap:8,
  },
  list:{
    padding:12,
  },
  form:{
    paddingHorizontal:12
  }
});