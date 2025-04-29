import { Construct } from "constructs";
import { App, TerraformStack } from "cdktf";
import { GoogleProvider } from "@cdktf/provider-google/lib/provider";
import { ComputeInstance } from "@cdktf/provider-google/lib/compute-instance";

class MyStack extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new GoogleProvider(this, "google", {
      project: "your-gcp-project-id",
      region: "us-central1",
      zone: "us-central1-a",
    });

    new ComputeInstance(this, "vm-instance", {
      name: "cdktf-vm",
      machineType: "e2-micro",
      zone: "us-central1-a",
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
  }
}

const app = new App();
new MyStack(app, "infra");
app.synth();
