import { Pipe, PipeTransform } from '@angular/core';

@Pipe ({
  name: 'statusTranslate'
})

export class StatusTranslatePipe implements PipeTransform {
  transform (value: string): string {
    const traducciones: { [key: string]: string } = {
      'Finished Airing': 'Finalizado',
      'Currently Airing': 'En Emisión',
      'Not yet Aired': 'Sin Emitir',
      'Hiatus': 'En Pausa'
    };

    return traducciones [value] || value;
  }
}
