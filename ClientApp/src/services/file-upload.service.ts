import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor(private sanitizer: DomSanitizer) { }

  public sanitizeIMG(base64: string) {
    const extensions = {
      "/": "jpg",
      "i": "png",
      "R": "gif",
      "U": "webp"
    };
    
    return this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/${extensions[base64[0]]};base64,` + base64);
  }

}