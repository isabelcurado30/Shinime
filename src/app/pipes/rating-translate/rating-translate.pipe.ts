import { Pipe, PipeTransform } from '@angular/core';

@Pipe ({
  name: 'ratingTranslate'
})

export class RatingTranslatePipe implements PipeTransform {
  transform (value: string): string {
    const map: { [key: string]: string } = {
      'G - All Ages': 'G- Todas las Edades',
      'PG - Children': 'PG - Infantil',
      'PG-13 - Teens 13 or older': 'PG-13 - Mayores de 13 Años',
      'R - 17+ (violence & profanity)': 'R - 17+ (violencia y lenguaje)',
      'R+ - Mild Nudity': 'R+ - Desnudez Moderada',
      'Rx - Hentai': 'Rx - Contenido Adulto'
    };

    return map [value] || value;
  }
}