import { Component } from '@angular/core';
import { BoardService } from './board.service';
import {Stomp} from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
   title = 'TIC-TAC-TOE';
   board: number[][] = [[0,0,0], [0,0,0], [0,0,0]];
   boardData:any;
   size=3;
   disabled = true;
   private stompClient = null;
   markResponse:any="Start the game!!!";


   constructor(private boardService: BoardService) {
//       boardService.messages.subscribe(msg =>{
//           this.board=msg.board;
//       });
   }

    ngOnInit() {

        this.getBoard();
        this.connect();
//       setInterval(() => {
//                       this.connect();
//                       }, 3000);
    }

    mark(x,y){
        console.log(x);
        console.log(y);
        this.boardService.markBoard(x,y).subscribe(data => {
                                                        console.log(data)
                                                        this.markResponse=data.toString();
                                                      }) ;
    }

    setConnected(connected: boolean) {
        this.disabled = !connected;

        if (connected) {
          //this.greetings = [];
        }
      }

      connect() {
        //const socket = new SockJS('http://localhost:8080/boardReceiver');
        const socket = new SockJS('https://mi-board-games.herokuapp.com/boardReceiver');

        this.stompClient = Stomp.over(socket);

        const _this = this;
        this.stompClient.connect({}, function (frame) {
          _this.setConnected(true);
          console.log('Connected: ' + frame);

          _this.stompClient.subscribe('/topic/board', function (data) {
                      console.log(JSON.parse(data.body).board);
                      _this.boardData=JSON.parse(data.body);
                      _this.board=JSON.parse(data.body).board.board;

          });
        });
      }

      disconnect() {
        if (this.stompClient != null) {
          this.stompClient.disconnect();
        }

        this.setConnected(false);
        console.log('Disconnected!');
      }

  getBoard() {
      this.markResponse="Start the game!!!";
      this.boardService.getBoard()
          .subscribe((data) => {
          console.log(data)
          this.boardData=data;
          this.board=this.boardData.board;
          });
  }


}
