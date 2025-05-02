import { Pipe, PipeTransform } from '@angular/core';

@Pipe ({
  name: 'genresTranslate'
})

export class GenresTranslatePipe implements PipeTransform {
  private genreMap: { [key: string]: string } = {
    Action: 'Acción',
    Adventure: 'Aventura',
    AvantGarde: 'Vanguardia',
    AwardWinning: 'Premiado',
    Comedy: 'Comedia',
    Drama: 'Drama',
    Fantasy: 'Fantasía',
    Horror: 'Terror',
    Mystery: 'Misterio',
    Romance: 'Romance',
    SciFi: 'Ciencia Ficción',
    SliceofLife: 'Recuentos de la Vida',
    Sports: 'Deportes',
    Supernatural: 'Sobrenatural',
    Suspense: 'Suspense',
    Ecchi: 'Ecchi',
    Hentai: 'Hentai',
    GirlsLove: 'Yuri',
    BoysLove: 'Yaoi',
    Mecha: 'Mechas',
    Military: 'Militar',
    Music: 'Musical',
    Psychological: 'Psicológico',
    Thriller: 'Thriller',
    Seinen: 'Seinen',
    Shoujo: 'Shoujo',
    Shounen: 'Shounen',
    Josei: 'Josei',
    Kids: 'Infantil',
    School: 'Escolar',
    Parody: 'Parodia',
    Historical: 'Histórico',
    Samurai: 'Samurái',
    Game: 'Juego',
    Demons: 'Demonios',
    Magic: 'Magia',
    Vampire: 'Vampiros', 
    MartialArts: 'Artes Marciales',
    Space: 'Espacio',
    Police: 'Policía',
    Cars: 'Coches',
    Dementia: 'Demencia'
  };

  transform (genres: { name: string }[] | undefined): string {
    if (!genres || !Array.isArray (genres)) return '';
    return genres
      .map (g => this.genreMap [this.normalize (g.name)] || g.name)
      .join (', ');
  }

  private normalize (name: string): string {
    return name.replace (/[\s\-]/g, '').replace (/[é]/g, 'e');
  }
}
