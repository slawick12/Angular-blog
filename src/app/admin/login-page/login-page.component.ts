import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { User } from "src/app/shared/interfaces";
import { AuthService } from "src/app/shared/services/auth.service";
import { Router, ActivatedRoute, Params } from "@angular/router";

@Component({
  selector: "app-login-page",
  templateUrl: "./login-page.component.html",
  styleUrls: ["./login-page.component.scss"]
})
export class LoginPageComponent implements OnInit {
  form: FormGroup;
  submited = false;
  message: string;

  constructor(
    public auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params: Params) => {
      if (params["loginAgain"]) {
        this.message = "Пожалуста, введите данные";
      } else if (params["authFailed"]) {
        this.message = "Cессия истекла. Веедете данные заново";
      }
    });

    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6)
      ])
    });
  }
  submit() {
    console.log(this.form);
    if (this.form.invalid) {
      return;
    }
    this.submited = true;
    const user: User = {
      email: this.form.value.email,
      password: this.form.value.password
    };
    this.auth.login(user).subscribe(
      () => {
        this.form.reset();
        this.router.navigate(["/admin", "dashboard"]);
        this.submited = false;
      },
      () => {
        this.submited = false;
      }
    );
  }
}
