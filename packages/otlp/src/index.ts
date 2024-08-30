import { DynamicModule, Module } from "@nestjs/common"
import { OpenTelemetryModule } from "nestjs-otel"
import { OpenTelemetryModuleOptions } from "nestjs-otel/lib/interfaces"

export * from "./tracing"

@Module({})
export class OtlpModule {
  static forRoot(opts: OpenTelemetryModuleOptions): DynamicModule {
    return {
      module: OtlpModule,
      global: true,
      imports: [OpenTelemetryModule.forRoot(opts)],
    }
  }
}
