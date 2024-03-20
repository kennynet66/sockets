/* import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ChatService {

  userId!: string;
  setUserId(userId: string) {
    this.userId = userId
  }
  constructor(private socket: Socket, private route: ActivatedRoute) {
      console.log("Your id", this.userId)
    }
    setHeaders(){
      this.socket.ioSocket.io.opts.extraHeaders = {
        userId: this.userId
      };
      this.socket.connect()
}
  sendMessage(msg: string, recepientId: string) {
    this.socket.emit('message', {message: msg, recepientId});
  }
  getMessage() {
    return this.socket.fromEvent('message').pipe(map((data)=> data));
  }
}
 */