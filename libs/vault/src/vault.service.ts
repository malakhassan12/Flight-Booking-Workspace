import {
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';

type VaultSecret = Record<string, string>;
@Injectable()
export class VaultService implements OnModuleInit {
  private readonly vault: AxiosInstance;

  constructor() {
    this.vault = axios.create({
      baseURL: process.env.VAULT_ADDR || 'http://vault:8200',
      headers: {
        'X-Vault-Token': process.env.VAULT_TOKEN,
      },
    });
  }

  async onModuleInit() {
    console.log('Vault URL:', process.env.VAULT_ADDR);
  }

  async getSecret(path: string): Promise<VaultSecret> {
    try {
      const response = await this.vault.get(`/v1/secret/data/${path}`);

      console.log('Vault response keys:', Object.keys(response.data));

      console.log(
        'Vault response.data keys:',
        Object.keys(response.data?.data ?? {}),
      );

      console.log(
        'Vault response.data.data.data keys:',
        Object.keys(response.data?.data?.data ?? {}),
      );

      return response.data.data.data;
    } catch (error: any) {
      console.error(`Failed to get Vault secret: ${path}`, {
        status: error?.response?.status,
        data: error?.response?.data,
        message: error?.message,
      });

      throw new InternalServerErrorException(
        `Failed to load secret from Vault: ${path}`,
      );
    }
  }
}
