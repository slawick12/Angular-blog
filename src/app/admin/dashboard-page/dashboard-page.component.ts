import { Component, OnInit, OnDestroy } from "@angular/core";
import { PostsService } from "../shared/posts.service";
import { Post } from "src/app/shared/interfaces";
import { Subscription, Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { AlertService } from "src/app/shared/services/alert.service";

@Component({
  selector: "app-dashboard-page",
  templateUrl: "./dashboard-page.component.html",
  styleUrls: ["./dashboard-page.component.scss"]
})
export class DashboardPageComponent implements OnInit, OnDestroy {
  posts: Post[];
  pSub: Subscription;
  dSub: Subscription;
  searchStr: "";

  constructor(
    private postsService: PostsService,
    private http: HttpClient,
    private alert: AlertService
  ) {}

  ngOnInit() {
    this.pSub = this.postsService.getAll().subscribe(posts => {
      this.posts = posts;
    });
  }
  ngOnDestroy() {
    if (this.pSub) {
      this.pSub.unsubscribe();
    }
    if (this.dSub) {
      this.dSub.unsubscribe();
    }
  }
  remove(id: string) {
    this.dSub = this.postsService.remove(id).subscribe(() => {
      this.posts = this.posts.filter(post => post.id != id);
      this.alert.danger("Post was deleted")
    });
  }
}
