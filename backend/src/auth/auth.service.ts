import { Injectable } from '@nestjs/common';

@Injectable({})
export class AuthService {
  signup() {
    return { msg: 'signup!' };
  }
  signin() {
    return { msg: 'signin!' };
  }
}
