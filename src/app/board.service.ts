import { Injectable } from '@angular/core';
import { HttpClient ,HttpParams,HttpHeaders} from '@angular/common/http';
import { WebsocketService} from './websocket.service';
import { Observable, Subject } from "rxjs";
import { map } from 'rxjs/operators';

export interface Message {
  size: number;
  gameName: string;
  board: number[][];
}

@Injectable({
  providedIn: 'root'
})
export class BoardService {
   URL = 'https://mi-board-games.herokuapp.com/tictactoe';
   wsURL = 'ws://topic/board'
  public messages: Subject<Message>;

  constructor(private http:HttpClient, private wsService: WebsocketService) {
  }

    getBoard(){
     console.log('Request is sent!');
     return this.http.get(this.URL);
    }

    markBoard(x,y):Observable<string>{
      console.log('Request is sent!');
      const myheader = new HttpHeaders().set('Content-Type', 'application/json')

      let queryParams = new HttpParams();
      queryParams = queryParams.append('xPos',x);
      queryParams = queryParams.append('yPos',y);

      console.log(queryParams.toString())

      return this.http.post(this.URL+'/mark',{},{params:queryParams, responseType: 'text' });

    }



}
