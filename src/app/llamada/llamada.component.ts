import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Meeting, ReunionesService } from '../services/reuniones.service';

@Component({
  selector: 'app-llamada',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './llamada.component.html',
  styleUrl: './llamada.component.css'
})
export class LlamadaComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('videoLocal') videoLocal?: ElementRef<HTMLVideoElement>;

  meeting?: Meeting;
  meetingId = '';
  enlace = '';
  enlaceCopiado = false;
  microfonoActivo = true;
  camaraActiva = true;
  errorMedia = '';
  duracion = '00:00';

  private stream?: MediaStream;
  private intervalo?: ReturnType<typeof setInterval>;
  private inicio = Date.now();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reunionesService: ReunionesService
  ) {}

  ngOnInit(): void {
    this.meetingId = this.route.snapshot.paramMap.get('id') ?? '';
    this.meeting = this.reunionesService.getMeeting(this.meetingId);
    this.enlace = this.reunionesService.enlaceDeReunion(this.meetingId);
    this.intervalo = setInterval(() => this.actualizarDuracion(), 1000);
  }

  ngAfterViewInit(): void {
    this.iniciarMedia();
  }

  ngOnDestroy(): void {
    if (this.intervalo) {
      clearInterval(this.intervalo);
    }
    this.detenerMedia();
  }

  toggleMicrofono(): void {
    this.microfonoActivo = !this.microfonoActivo;
    this.stream?.getAudioTracks().forEach(track => (track.enabled = this.microfonoActivo));
  }

  toggleCamara(): void {
    this.camaraActiva = !this.camaraActiva;
    this.stream?.getVideoTracks().forEach(track => (track.enabled = this.camaraActiva));
  }

  copiarEnlace(): void {
    navigator.clipboard?.writeText(this.enlace);
    this.enlaceCopiado = true;
    setTimeout(() => (this.enlaceCopiado = false), 2000);
  }

  salir(): void {
    this.detenerMedia();
    this.router.navigate(['/reuniones']);
  }

  private async iniciarMedia(): Promise<void> {
    if (!navigator.mediaDevices?.getUserMedia) {
      this.errorMedia = 'Este navegador no permite acceder a la cámara y el micrófono.';
      return;
    }

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (this.videoLocal) {
        this.videoLocal.nativeElement.srcObject = this.stream;
      }
    } catch {
      this.errorMedia = 'No se pudo acceder a la cámara o el micrófono. Revisa los permisos del navegador.';
    }
  }

  private detenerMedia(): void {
    this.stream?.getTracks().forEach(track => track.stop());
    this.stream = undefined;
  }

  private actualizarDuracion(): void {
    const segundos = Math.floor((Date.now() - this.inicio) / 1000);
    const minutos = Math.floor(segundos / 60);
    this.duracion = `${minutos.toString().padStart(2, '0')}:${(segundos % 60).toString().padStart(2, '0')}`;
  }
}
