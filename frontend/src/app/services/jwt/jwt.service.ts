import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class JwtService {
  getToken(): string {
    return window.localStorage["feathers-jwt"];
  }

  saveToken(token: string): void {
    window.localStorage["feathers-jwt"] = token;
  }

  destroyToken(): void {
    window.localStorage.removeItem("feathers-jwt");
  }
}