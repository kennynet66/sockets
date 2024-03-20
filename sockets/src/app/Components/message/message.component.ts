import { Component, OnInit } from '@angular/core';
// import { ChatService } from '../../Services/chat.service';
import { ActivatedRoute } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class MessageComponent implements OnInit {
  title = 'sockets';

  ngOnInit(): void {
    this.getUserId();
  }

  recipientId = "2";
  userId!: string;

  getUserId(){
    this.route.params.subscribe(params =>{
      this.userId = params['id']
    })
    // this.chat.setUserId(this.userId)
    this.setHeaders();
    
  }

  message:string = '';
  messages:any[] = []
  constructor( private route: ActivatedRoute, private socket: Socket){

    this.getMessage()
  }

  setHeaders(){
    console.log("Your id", this.userId);
    
    this.socket.ioSocket.io.opts.extraHeaders = {
      userId: this.userId
    };
    this.socket.connect()
}

  sendMessage(){
    this.socket.emit('message', {message: this.message, recipientId: this.recipientId});
  //   this.chat.sendMessage(this.message, this.recepientId)
    this.messages.push(this.message);
    this.message = ''
  }

  getMessage(){
    this.socket.fromEvent('message').pipe(map((data)=> data)).subscribe(Data=>{
      console.log(Data);
      
      this.messages.push(Data)
    });
  //   this.chat.getMessage().subscribe(data =>{
  //     console.log(data);
  //     this.messages.push(data)
  //   })
  }
}
