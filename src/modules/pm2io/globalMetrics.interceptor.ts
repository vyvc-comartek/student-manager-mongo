import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import * as io from '@pm2/io';
import { MetricBulk } from '@pm2/io/build/main/services/metrics';
import Counter from '@pm2/io/build/main/utils/metrics/counter';
import Gauge from '@pm2/io/build/main/utils/metrics/gauge';
import Meter from '@pm2/io/build/main/utils/metrics/meter';

export class GlobalMetricInterceptor implements NestInterceptor {
  private readonly _metricRequestsPerSec: Meter;
  private readonly _metricRequestsLastTime: Counter;
  private readonly _metricRequests: Gauge;

  constructor() {
    this._metricRequestsPerSec = io.meter({
      name: 'Request/s',
    });

    this._metricRequestsLastTime = io.counter({
      name: 'Requests in last 30s',
    });

    this._metricRequests = io.metric({});

    setInterval(() => this._metricRequestsLastTime.reset(), 30000);
  }

  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    const handling = next.handle();

    this._metricRequestsPerSec.mark();
    this._metricRequestsLastTime.inc();

    return handling;
  }
}
