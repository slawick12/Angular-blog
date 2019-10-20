import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";

export interface Todo {
  completed: boolean;
  id: string;
  title: string;
}
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  
}
