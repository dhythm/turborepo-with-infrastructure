import { Construct } from "constructs";
import { App, TerraformStack, TerraformOutput, LocalBackend } from "cdktf";
import { GoogleProvider } from "@cdktf/provider-google/lib/provider";
import { StorageBucket } from "@cdktf/provider-google/lib/storage-bucket";

interface EnvConfig {
  projectId: string;
  region: string;
  bucketName: string;
  prefix: string;
}


class MyStack extends TerraformStack {
  constructor(scope: Construct, env: "dev" | "prod" = "dev") {
    super(scope, env);
    const envConfig: EnvConfig = scope.node.tryGetContext(env);

    new GoogleProvider(this, "google", {
      project: envConfig.projectId,
      region: envConfig.region,
    });

    new StorageBucket(this, "bucket", {
      name: envConfig.bucketName,
      location: envConfig.region,
    });

    new LocalBackend(this, {
      path: `terraform-${env}.tfstate`,
    });

    new TerraformOutput(this, "bucket_name", {
      value: envConfig.bucketName,
    });
  }
}

const app = new App();

const environment = (process.env.ENV === "prod" ? "prod" : "dev")

new MyStack(app, environment);

app.synth();