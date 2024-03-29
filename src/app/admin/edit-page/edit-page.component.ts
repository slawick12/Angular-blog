import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { PostsService } from "../shared/posts.service";
import { switchMap } from "rxjs/operators";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Post } from "src/app/shared/interfaces";
import { Observable, Subscription } from "rxjs";
import { AlertService } from 'src/app/shared/services/alert.service';

@Component({
  selector: "app-edit-page",
  templateUrl: "./edit-page.component.html",
  styleUrls: ["./edit-page.component.scss"]
})
export class EditPageComponent implements OnInit, OnDestroy {
  form: FormGroup;
  post: Post;
  submited = false;
  uSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private postsService: PostsService,
    private alert: AlertService
  ) {}

  ngOnInit() {
    this.route.params
      .pipe(
        switchMap((params: Params) => {
          return this.postsService.getById(params["id"]);
        })
      )
      .subscribe((post: Post) => {
        this.post = post;
        this.form = new FormGroup({
          title: new FormControl(post.title, Validators.required),
          text: new FormControl(post.text, Validators.required)
        });
      });
  }
  ngOnDestroy() {
    if (this.uSub) {
      this.uSub.unsubscribe();
    }
  }
  submit() {
    if (this.form.invalid) {
      return;
    }
    this.submited = true;
    this.uSub = this.postsService
      .update({
        ...this.post,
        text: this.form.value.text,
        title: this.form.value.title
      })
      .subscribe(() => {
        this.submited = false;
        this.alert.success("Post was updated")
      });
  }
}
