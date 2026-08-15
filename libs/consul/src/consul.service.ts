import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import axios from 'axios';

export interface ConsulServiceInstance {
  id: string;
  address: string;
  name: string;
  port: number;
  tags: string[];
  check: {
    id: string;
    name: string;
    tcp: string;
    interval: string;
    timeout: string;
  };
}

@Injectable()
export class ConsulService {
  private readonly consulUrl = 'http://consul:8500';

  async discover(serviceName: string) {
    try {
      const response = await axios.get(
        `${this.consulUrl}/v1/health/service/${serviceName}`,
        {
          params: {
            passing: true,
          },
        },
      );

      const services = response.data;

      if (!services.length) {
        throw new ServiceUnavailableException(
          `No healthy instance found for ${serviceName}`,
        );
      }

      const service = services[0].Service;

      return {
        id: service.ID,
        name: service.Service,
        host: service.Address,
        port: service.Port,
      };
    } catch (error) {
      console.log(
        '-------------------- "Error in the Consul Service!" --------------------',
      );

      console.log(error);

      throw new ServiceUnavailableException(
        `Unable to discover ${serviceName}`,
      );
    }
  }
  async getValue(key: string): Promise<string> {
    try {
      const response = await axios.get(`${this.consulUrl}/v1/kv/${key}`, {
        params: {
          raw: true,
        },
      });

      return response.data;
    } catch (error) {
      console.error(`Failed to get KV: ${key}`, error);

      throw new ServiceUnavailableException(`Unable to get Consul KV: ${key}`);
    }
  }
  async getInstances(serviceName: string): Promise<ConsulServiceInstance[]> {
    const response = await axios.get(
      `${this.consulUrl}/v1/health/service/${serviceName}`,
      {
        params: {
          passing: true,
        },
      },
    );

    return response.data.map((item: any) => ({
      id: item.Service.ID,
      service: item.Service.Service,
      address: item.Service.Address,
      port: item.Service.Port,
      tags: item.Service.Tags || [],
    }));
  }

  async registerService(service: ConsulServiceInstance) {
    try {
      await axios.put(`${this.consulUrl}/v1/agent/service/register`, {
        id: service.id,
        name: service.name,
        address: service.address,
        port: service.port,
        tags: service.tags,
        check: {
          id: service.check.id,
          name: service.check.name,
          tcp: service.check.tcp,
          interval: service.check.interval,
          timeout: service.check.timeout,
        },
      });

      console.log(`Service ${service.name} registered successfully`);
    } catch (error) {
      console.error(`Failed to register ${service.name} in Consul`, error);
    }
  }

  async deregisterService(serviceId: string) {
    await axios.put(
      `${this.consulUrl}/v1/agent/service/deregister/${serviceId}`,
    );
  }

  async createIntention(
    source: string,
    destination: string,
    action: 'allow' | 'deny',
  ) {
    return axios.put(
      `${this.consulUrl}/v1/connect/intentions/exact`,
      {
        Action: action,
      },
      {
        params: {
          source,
          destination,
        },
      },
    );
  }

  async checkIntention(source: string, destination: string) {
    const response = await axios.get(
      `${this.consulUrl}/v1/connect/intentions/check`,
      {
        params: {
          source,
          destination,
        },
      },
    );

    return response.data;
  }

  async getServices() {
    const response = await axios.get(`${this.consulUrl}/v1/agent/services`);

    return response.data;
  }

  async getTopology() {
    const services = await this.getServices();

    const topology = [];

    for (const service of Object.values(services) as any[]) {
      const instances = await this.getInstances(service.Service);

      topology.push({
        service: service.Service,
        tags: service.Tags,
        instances,
      });
    }

    return topology;
  }

  async getInstancesByTag(serviceName: string, tag: string) {
    const instances = await this.getInstances(serviceName);

    return instances.filter((instance) => instance.tags.includes(tag));
  }

  async discoverOne(serviceName: string) {
    const instances = await this.getInstances(serviceName);

    if (!instances.length) {
      throw new Error(`No healthy ${serviceName} instances`);
    }

    const index = Math.floor(Math.random() * instances.length);

    return instances[index];
  }

  /*


  Access Controls
    Tokens
    Policies
    Roles
    Auth Methods

  */
}
