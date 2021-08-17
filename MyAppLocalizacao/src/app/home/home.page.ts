import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ToastController } from '@ionic/angular';
import { Api } from './../../services/api';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  id: any = "";
  latitude: any = "";
  longitude: any = "";

  map: google.maps.Map;
  minhaPosicao: google.maps.LatLng;

  @ViewChild('map', { read: ElementRef, static: false }) mapRef: ElementRef;

  constructor(
    private router: Router,
    private geolocation: Geolocation, 
    private provider: Api,
    private actRuter: ActivatedRoute,
    public toastCtrl: ToastController,
    private httpClient: HttpClient 
    ) {}

    ngOninit(){
      this.mensagemSucesso();
      this.actRuter.params.subscribe((data:any) =>{

      });
    }

  ionViewWillEnter() {
    this.exibirMapa();
  }

  async mensagemSucesso(){
    const toast = await this.toastCtrl.create({
      message: 'Localização Salva com Sucesso',
      duration: 2000
    });
    toast.present();
  }
 
// colocando uma posição especifica no mapa.
  exibirMapa() {
    const posicao = new google.maps.LatLng(-6.463933, -37.113028);
    const opcao = {
      center: posicao,
      zoom: 8,
      disableDefaultUI: true
    };

    this.map = new google.maps.Map(this.mapRef.nativeElement, opcao);

    this.buscarPosicao();
  }

  // Obtendo Geolocalização no mapa
  buscarPosicao(){
    this.geolocation.getCurrentPosition().then((resp) => {
      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude    

      this.minhaPosicao = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);

      this.irParaMinhaPosicao();
      
     }).catch((error) => {
       console.log('Error getting location', error);
     });
  }

  // Mostrando a localização no mapa
  irParaMinhaPosicao(){
    this.map.setCenter(this.minhaPosicao);
    this.map.setZoom(15);

    const marker = new google.maps.Marker({
      position: this.minhaPosicao,
      title: 'Estou Aqui',
      animation: google.maps.Animation.BOUNCE,
      map: this.map
    });
  }

  // Salvando a posição no BD
  salvar(){
    return new Promise(resolve => {
      let dados = {
        latitude: this.latitude,
        longitude: this.longitude
      }
      this.provider.dadosApi(dados, 'localizacao/inserir.php').subscribe(
        data => {
          this.router.navigate(['home'])
          this.mensagemSucesso();
        }
      )
    });
    
  }

}
