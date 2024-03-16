import { Component } from '@angular/core';
import { ChatService } from './Services/chat.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'sockets';

  message:string = '';
  messages:any[] = []
  constructor(private chat: ChatService){

    this.getMessage()
  }

  sendMessage(){
    this.chat.sendMessage(this.message)
    this.messages.push(this.message);
    this.message = ''
  }

  getMessage(){
    this.chat.getMessage().subscribe(data =>{
      console.log(data);
      this.messages.push(data)
    })
  }
}
