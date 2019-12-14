import { Injectable } from '@nestjs/common';
import { classLogger } from '../../shared/ts/helpers/logger';

@Injectable()
export class HomeService {
  private readonly logger = classLogger(this);

  constructor() { this.logger.dInfo('constructor'); }

  report() {
    return {
      title: process.title,
      exitCode: process.exitCode,
      version: process.version,
      pid: process.pid,
      domain: process.domain,
      execPath: process.execPath,
      execArgv: process.execArgv,
      debugPort: process.debugPort,
      platform: process.platform,
      ppid: process.ppid,
      uptime: process.uptime(),
      release: process.release,
      connected: process.connected,
      argv: process.argv,
      hrtime: process.hrtime(),
      cpuUsage: process.cpuUsage(),
      versions: process.versions,
      features: process.features,
      env: process.env,
      memoryUsage: process.memoryUsage(),
      config: process.config,
    };
  }
}
