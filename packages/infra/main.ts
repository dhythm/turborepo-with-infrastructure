import * as dotenv from 'dotenv';
import { Construct } from "constructs";
import { App, TerraformStack, TerraformOutput, LocalBackend } from "cdktf";
import { GoogleProvider } from "@cdktf/provider-google/lib/provider";
import { StorageBucket } from "@cdktf/provider-google/lib/storage-bucket";
import {  } from '@cdktf/provider-archive';
import { ArchiveProvider } from '@cdktf/provider-archive/lib/provider';
import { DataArchiveFile } from '@cdktf/provider-archive/lib/data-archive-file';
import path = require('path');
import { StorageBucketObject } from '@cdktf/provider-google/lib/storage-bucket-object';
import { Cloudfunctions2Function } from '@cdktf/provider-google/lib/cloudfunctions2-function';
import { CloudRunServiceIamMember } from '@cdktf/provider-google/lib/cloud-run-service-iam-member';

dotenv.config();

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

    const PROJECT_ID = process.env.PROJECT_ID;

    new GoogleProvider(this, "google", {
      project: PROJECT_ID,
      region: envConfig.region,
    });

    new ArchiveProvider(this, 'archive', {});

    const bucket = new StorageBucket(this, 'function-bucket', {
      name: 'cdktf-function-bucket',
      location: 'ASIA',
    });

    const archive = new DataArchiveFile(this, 'function-archive', {
      type: 'zip',
      sourceDir: path.resolve(__dirname, '../python-service/function'),
      outputPath: path.resolve(__dirname, 'function.zip'),
    });

    const object = new StorageBucketObject(this, 'function-object', {
      name: 'function.zip',
      bucket: bucket.name,
      source: archive.outputPath,
    });

    const cloudFunction = new Cloudfunctions2Function(this, 'hello-function', {
      name: 'hello-function',
      location: envConfig.region,
      buildConfig: {
        runtime: 'python312',
        entryPoint: 'hello_world',
        source: {
          storageSource: {
            bucket: bucket.name,
            object: object.name,
          },
        },
      },
      serviceConfig: {
        maxInstanceCount: 1,
        availableMemory: '256M',
        timeoutSeconds: 60,
        ingressSettings: 'ALLOW_ALL',
      },
    });

    // 👇 未認証アクセスを許可する設定を追加
    new CloudRunServiceIamMember(this, 'allow-unauthenticated', {
      location: envConfig.region,
      service: cloudFunction.name,
      role: 'roles/run.invoker',
      member: 'allUsers',
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