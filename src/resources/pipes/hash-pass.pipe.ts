import { Injectable, PipeTransform } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashPassPipe implements PipeTransform {
  constructor(private configService: ConfigService) {}

  async transform(pass: string) {
    const sal = this.configService.get<string>('SALT_PASS');

    const passHash = await bcrypt.hash(pass, sal!);
    return passHash;
  }
}
