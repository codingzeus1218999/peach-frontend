import {
  ViewerProtocolPolicy,
  AllowedMethods,
  CachedMethods,
  CachePolicy,
} from "aws-cdk-lib/aws-cloudfront";
import { S3Origin } from "aws-cdk-lib/aws-cloudfront-origins";
import { SSTConfig } from "sst";
import { NextjsSite } from "sst/constructs";

export default {
  config(_input) {
    return {
      name: "peachGo",
      region: "eu-west-1",
    };
  },
  stacks(app) {
    app.stack(function Site({ stack }) {
      const site = new NextjsSite(stack, "site", {
        warm: 20,
        memorySize: "3008 MB",
        customDomain:
          stack.stage === "prod"
            ? "go.peach.me"
            : {
                domainName: "uat.express.peach.me",
                hostedZone: "express.peach.me",
              },
      });

      if (site?.cdk?.bucket !== undefined) {
        const s3Origin = new S3Origin(site.cdk.bucket);
        site.cdk.distribution.addBehavior("locales/*", s3Origin, {
          viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          allowedMethods: AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
          cachedMethods: CachedMethods.CACHE_GET_HEAD_OPTIONS,
          compress: true,
          cachePolicy: CachePolicy.CACHING_OPTIMIZED,
        });
      }

      stack.addOutputs({
        SiteUrl: site.url,
      });
    });
  },
} satisfies SSTConfig;
