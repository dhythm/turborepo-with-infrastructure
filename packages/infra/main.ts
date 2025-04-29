import { Construct } from "constructs";
import { App, TerraformOutput, TerraformStack } from "cdktf";
import { GoogleProvider } from "@cdktf/provider-google/lib/provider";
import { ComputeInstance } from "@cdktf/provider-google/lib/compute-instance";
import { StorageBucket } from "@cdktf/provider-google/lib/storage-bucket";

interface EnvConfig {
  projectId: string;
  projectNumber: string;
  region: string;
  bucketName: string;
}


class MyStack extends TerraformStack {
  constructor(scope: Construct, env: "dev" | "prod" = "dev") {
    super(scope, env);
    const envConfig: EnvConfig = scope.node.tryGetContext(env);

    new GoogleProvider(this, "google", {
      project: envConfig.projectId,
      region: envConfig.region,
    });

    const bucket = new StorageBucket(this, "StateBucket", {
      name: envConfig.bucketName,
      location: envConfig.region,
      versioning: {
        enabled: true,
      },
    });

    new ComputeInstance(this, "vm-instance", {
      name: "cdktf-vm",
      machineType: "e2-micro",
      bootDisk: {
        initializeParams: {
          image: "debian-cloud/debian-11",
        },
      },
      networkInterface: [{
        network: "default",
        accessConfig: [{}],
      }],
    });

    new TerraformOutput(this, "bucket_name", {
      value: bucket.name,
    });
  }
}



const app = new App();

const env = (process.env.ENV || "dev") as "dev" | "prod";

new MyStack(app, env);

app.synth();
