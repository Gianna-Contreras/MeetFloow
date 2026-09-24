import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IpService {
  private localIpSubject = new BehaviorSubject<string>('192.168.1.8');
  localIp$ = this.localIpSubject.asObservable();

  constructor() {
    this.detectLocalIp();
  }

  async detectLocalIp(): Promise<void> {
    try {
      const ip = await this.getWebRTCIP();
      if (ip) {
        this.localIpSubject.next(ip);
      }
    } catch (error) {
      console.log('Could not detect IP automatically, using default');
    }
  }

  private getWebRTCIP(): Promise<string> {
    return new Promise((resolve, reject) => {
      const rtc = new RTCPeerConnection({ iceServers: [] });
      const noop = () => {};
      
      rtc.createDataChannel('');
      rtc.createOffer().then(sdp => {
        rtc.setLocalDescription(sdp, noop, noop);
      }).catch(reject);

      rtc.onicecandidate = (event) => {
        if (event.candidate) {
          const candidate = event.candidate.candidate;
          const match = candidate.match(/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/);
          if (match && !match[1].startsWith('127.')) {
            rtc.close();
            resolve(match[1]);
          }
        }
      };

      setTimeout(() => {
        rtc.close();
        reject(new Error('IP detection timeout'));
      }, 1000);
    });
  }

  setManualIp(ip: string): void {
    this.localIpSubject.next(ip);
  }

  getBaseUrl(): string {
    return `http://${this.localIpSubject.value}:4200`;
  }
}
