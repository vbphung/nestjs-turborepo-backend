import { DynamicModule, Module } from "@nestjs/common"
import { OpenTelemetryModule } from "nestjs-otel"
import { OpenTelemetryModuleOptions } from "nestjs-otel/lib/interfaces"

export * from "./tracing"

@Module({})
export class OtelModule {
  static forRoot(opts: OpenTelemetryModuleOptions): DynamicModule {
    return {
      module: OtelModule,
      global: true,
      imports: [OpenTelemetryModule.forRoot(opts)],
    }
  }
}
