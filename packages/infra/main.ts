import { Construct } from "constructs";
import { App, TerraformStack, TerraformOutput, LocalBackend } from "cdktf";
import { GoogleProvider } from "@cdktf/provider-google/lib/provider";
import { StorageBucket } from "@cdktf/provider-google/lib/storage-bucket";

interface EnvConfig {
  projectId: string;
  region: string;
  bucketName: string;
}

const configs: Record<string, EnvConfig> = {
  dev: {
    projectId: "your-dev-project-id",
    region: "us-central1",
    bucketName: "cdktf-dev-bucket",
  },
  prod: {
    projectId: "your-prod-project-id",
    region: "us-central1",
    bucketName: "cdktf-prod-bucket",
  },
};

class MyStack extends TerraformStack {
  constructor(scope: Construct, id: string, envConfig: EnvConfig) {
    super(scope, id);

    new GoogleProvider(this, "google", {
      project: envConfig.projectId,
      region: envConfig.region,
    });

    new StorageBucket(this, "bucket", {
      name: envConfig.bucketName,
      location: envConfig.region,
    });

    new LocalBackend(this, {
      path: `terraform-${id}.tfstate`,
    });

    new TerraformOutput(this, "bucket_name", {
      value: envConfig.bucketName,
    });
  }
}

const app = new App();

const environment = process.env.ENVIRONMENT ?? "dev";
const envConfig = configs[environment];

if (!envConfig) {
  throw new Error(`Invalid ENVIRONMENT: ${environment}`);
}

new MyStack(app, environment, envConfig);

app.synth();